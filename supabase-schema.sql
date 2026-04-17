-- ══════════════════════════════════════════════════════
-- FCR CLIENT PORTAL — SUPABASE DATABASE SCHEMA
-- First Class Remodeling TX
-- Relational: users → clients → projects → estimates → invoices
-- ══════════════════════════════════════════════════════

-- ── ENUMS ──
CREATE TYPE project_status AS ENUM ('planning', 'in_progress', 'punch_list', 'complete', 'on_hold', 'cancelled');
CREATE TYPE phase_status AS ENUM ('pending', 'in_progress', 'complete');
CREATE TYPE estimate_status AS ENUM ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired');
CREATE TYPE invoice_status AS ENUM ('draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE payment_method AS ENUM ('cash', 'check', 'zelle', 'card', 'ach', 'stripe', 'other');
CREATE TYPE change_order_status AS ENUM ('pending', 'approved', 'declined');
CREATE TYPE message_sender AS ENUM ('client', 'admin', 'joe');

-- ══════════════════════════════════════════════════════
-- 1. USERS (extends Supabase auth.users)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('admin', 'client')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- 2. CLIENTS (business entity — can have multiple projects)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_user_id ON public.clients(user_id);

-- ══════════════════════════════════════════════════════
-- 3. PROJECTS (linked to client)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- FCR-XXXXXX
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_type TEXT NOT NULL DEFAULT 'Other',
  address TEXT,
  description TEXT,
  status project_status NOT NULL DEFAULT 'planning',
  progress_percent INTEGER NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  start_date DATE,
  estimated_completion DATE,
  actual_completion DATE,
  contract_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_projects_client ON public.projects(client_id);
CREATE INDEX idx_projects_code ON public.projects(code);

-- ══════════════════════════════════════════════════════
-- 4. ESTIMATES (linked to project + client)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  estimate_number TEXT NOT NULL, -- EST-001
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  line_items JSONB DEFAULT '[]', -- [{name, qty, unit_price, total}]
  status estimate_status NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  client_signature TEXT, -- base64 data URL
  client_notes TEXT,
  preferred_start_date DATE,
  valid_until DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_estimates_project ON public.estimates(project_id);
CREATE INDEX idx_estimates_client ON public.estimates(client_id);
CREATE INDEX idx_estimates_status ON public.estimates(status);

-- ══════════════════════════════════════════════════════
-- 5. INVOICES (linked to project + client + optionally estimate)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  estimate_id UUID REFERENCES public.estimates(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL, -- INV-001
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  description TEXT,
  line_items JSONB DEFAULT '[]',
  status invoice_status NOT NULL DEFAULT 'draft',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  payment_method payment_method,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_invoices_project ON public.invoices(project_id);
CREATE INDEX idx_invoices_client ON public.invoices(client_id);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due ON public.invoices(due_date) WHERE status IN ('sent', 'pending');

-- ══════════════════════════════════════════════════════
-- 6. PHASES (linked to project)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status phase_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_phases_project ON public.phases(project_id);

-- ══════════════════════════════════════════════════════
-- 7. PHOTOS (linked to project + optionally phase)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  phase_id UUID REFERENCES public.phases(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  caption TEXT,
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  uploaded_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_photos_project ON public.photos(project_id);

-- ══════════════════════════════════════════════════════
-- 8. CHANGE ORDERS (linked to project)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.change_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  reason TEXT,
  amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status change_order_status NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  client_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_change_orders_project ON public.change_orders(project_id);

-- ══════════════════════════════════════════════════════
-- 9. MESSAGES (chat — linked to project)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender message_sender NOT NULL,
  sender_name TEXT,
  text TEXT NOT NULL,
  photos JSONB, -- [{url, caption}]
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_messages_project ON public.messages(project_id);
CREATE INDEX idx_messages_created ON public.messages(project_id, created_at);

-- ══════════════════════════════════════════════════════
-- 10. UPDATES / ACTIVITY LOG (linked to project)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  update_type TEXT NOT NULL DEFAULT 'note' CHECK (update_type IN ('milestone', 'payment', 'note', 'photo', 'delay')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_updates_project ON public.updates(project_id);

-- ══════════════════════════════════════════════════════
-- 11. CONFIG (system settings — Joe AI key, etc)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- 12. EMAIL LOG (audit trail)
-- ══════════════════════════════════════════════════════
CREATE TABLE public.email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email TEXT NOT NULL,
  client_name TEXT,
  project_code TEXT,
  email_type TEXT NOT NULL DEFAULT 'invite',
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════
-- VIEWS (computed data for easy queries)
-- ══════════════════════════════════════════════════════

-- Client dashboard view: project + financial summary
CREATE VIEW public.client_dashboard AS
SELECT
  p.id AS project_id,
  p.code,
  p.project_type,
  p.address,
  p.status,
  p.progress_percent,
  p.contract_amount,
  p.start_date,
  p.estimated_completion,
  c.id AS client_id,
  c.name AS client_name,
  c.email AS client_email,
  c.user_id,
  COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.paid_amount ELSE 0 END), 0) AS total_paid,
  p.contract_amount - COALESCE(SUM(CASE WHEN i.status = 'paid' THEN i.paid_amount ELSE 0 END), 0) AS balance_due,
  COUNT(DISTINCT ph.id) FILTER (WHERE ph.status = 'complete') AS phases_complete,
  COUNT(DISTINCT ph.id) AS phases_total,
  (SELECT COUNT(*) FROM public.photos WHERE project_id = p.id) AS photo_count,
  (SELECT COUNT(*) FROM public.messages WHERE project_id = p.id AND is_read = FALSE AND sender = 'client') AS unread_messages
FROM public.projects p
JOIN public.clients c ON c.id = p.client_id
LEFT JOIN public.invoices i ON i.project_id = p.id
LEFT JOIN public.phases ph ON ph.project_id = p.id
GROUP BY p.id, c.id;

-- Overdue invoices view
CREATE VIEW public.overdue_invoices AS
SELECT i.*, c.name AS client_name, c.email AS client_email, p.code AS project_code
FROM public.invoices i
JOIN public.projects p ON p.id = i.project_id
JOIN public.clients c ON c.id = p.client_id
WHERE i.status IN ('sent', 'pending')
  AND i.due_date < CURRENT_DATE;

-- ══════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- ADMIN: full access
CREATE POLICY admin_all ON public.users FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.clients FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.projects FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.estimates FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.invoices FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.phases FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.photos FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.change_orders FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.messages FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.updates FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);
CREATE POLICY admin_all ON public.config FOR ALL USING (
  (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
);

-- CLIENT: read own data only
CREATE POLICY client_read_self ON public.users FOR SELECT USING (id = auth.uid());
CREATE POLICY client_read_own ON public.clients FOR SELECT USING (user_id = auth.uid());
CREATE POLICY client_read_projects ON public.projects FOR SELECT USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);
CREATE POLICY client_read_estimates ON public.estimates FOR SELECT USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);
CREATE POLICY client_read_invoices ON public.invoices FOR SELECT USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
);
CREATE POLICY client_read_phases ON public.phases FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
);
CREATE POLICY client_read_photos ON public.photos FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
);
CREATE POLICY client_read_change_orders ON public.change_orders FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
);
CREATE POLICY client_read_messages ON public.messages FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
);
CREATE POLICY client_read_updates ON public.updates FOR SELECT USING (
  project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
);
CREATE POLICY client_read_config ON public.config FOR SELECT USING (true);

-- CLIENT: can send messages and update estimates (accept/decline)
CREATE POLICY client_send_messages ON public.messages FOR INSERT WITH CHECK (
  sender = 'client' AND
  project_id IN (SELECT id FROM public.projects WHERE client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid()))
);
CREATE POLICY client_accept_estimate ON public.estimates FOR UPDATE USING (
  client_id IN (SELECT id FROM public.clients WHERE user_id = auth.uid())
) WITH CHECK (
  status IN ('accepted', 'declined')
);

-- ══════════════════════════════════════════════════════
-- FUNCTIONS
-- ══════════════════════════════════════════════════════

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_estimates_updated BEFORE UPDATE ON public.estimates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_invoices_updated BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-mark invoices overdue (run via cron/pg_cron)
CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS void AS $$
BEGIN
  UPDATE public.invoices
  SET status = 'overdue'
  WHERE status IN ('sent', 'pending')
    AND due_date < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client'
  );
  -- Link to existing client by email
  UPDATE public.clients SET user_id = NEW.id WHERE email = NEW.email AND user_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update project progress when phases change
CREATE OR REPLACE FUNCTION update_project_progress()
RETURNS TRIGGER AS $$
DECLARE
  total INT;
  done INT;
BEGIN
  SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'complete')
  INTO total, done
  FROM public.phases WHERE project_id = COALESCE(NEW.project_id, OLD.project_id);

  IF total > 0 THEN
    UPDATE public.projects
    SET progress_percent = ROUND((done::DECIMAL / total) * 100),
        status = CASE
          WHEN done = total THEN 'complete'::project_status
          WHEN done > 0 THEN 'in_progress'::project_status
          ELSE status
        END
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_phase_progress
  AFTER INSERT OR UPDATE OR DELETE ON public.phases
  FOR EACH ROW EXECUTE FUNCTION update_project_progress();
