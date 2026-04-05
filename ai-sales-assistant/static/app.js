const state = {
  sessionId: localStorage.getItem("fcr_assistant_session") || crypto.randomUUID(),
  lead: {},
};

localStorage.setItem("fcr_assistant_session", state.sessionId);

const chatLog = document.getElementById("chatLog");
const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const serviceList = document.getElementById("serviceList");
const leadGrid = document.getElementById("leadGrid");

function addMessage(role, content) {
  const article = document.createElement("article");
  article.className = `message ${role === "user" ? "message-user" : ""}`;

  const label = document.createElement("span");
  label.className = "message-role";
  label.textContent = role === "user" ? "You" : "Advisor";

  const body = document.createElement("div");
  body.textContent = content;

  article.append(label, body);
  chatLog.appendChild(article);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderLead(lead) {
  leadGrid.innerHTML = "";
  const labels = {
    name: "Name",
    phone: "Phone",
    email: "Email",
    project_type: "Project Type",
    budget: "Budget",
    neighborhood: "Neighborhood",
    timeline: "Timeline",
    recommended_service: "Recommended Service",
    qualification_status: "Status",
  };

  Object.entries(labels).forEach(([key, label]) => {
    const item = document.createElement("div");
    item.className = "lead-item";

    const title = document.createElement("div");
    title.className = "lead-item-label";
    title.textContent = label;

    const value = document.createElement("div");
    value.className = "lead-item-value";
    value.textContent = lead[key] || "Pending";
    if (key === "qualification_status") {
      value.classList.add(lead[key] === "qualified" ? "tone-ok" : "tone-warn");
    }

    item.append(title, value);
    leadGrid.appendChild(item);
  });
}

function renderServices(services) {
  serviceList.innerHTML = "";
  services.forEach((service) => {
    const card = document.createElement("article");
    card.className = "service-card";

    const title = document.createElement("h3");
    title.textContent = service.headline;

    const desc = document.createElement("p");
    desc.className = "panel-copy";
    desc.textContent = service.description;

    const meta = document.createElement("div");
    meta.className = "service-meta";
    meta.innerHTML = `
      <span class="pill">${service.budget_label}</span>
      <span class="pill">${service.roi_label}</span>
    `;

    const list = document.createElement("ul");
    service.includes.slice(0, 4).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    card.append(title, desc, meta, list);
    serviceList.appendChild(card);
  });
}

async function loadStatus() {
  const res = await fetch("/api/status");
  const data = await res.json();

  document.getElementById("engineLabel").textContent = data.engine_label;
  document.getElementById("areasServed").textContent = `${data.area_count} areas`;
  document.getElementById("leadCount").textContent = data.lead_count;
}

async function loadServices() {
  const res = await fetch("/api/services");
  const data = await res.json();
  renderServices(data.services);
}

async function sendMessage(message) {
  addMessage("user", message);
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: state.sessionId,
      message,
    }),
  });
  const data = await res.json();
  state.lead = data.lead;
  addMessage("assistant", data.reply);
  renderLead(state.lead);
  loadStatus();
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) {
    return;
  }
  messageInput.value = "";
  await sendMessage(message);
});

document.querySelectorAll(".quick-chip").forEach((button) => {
  button.addEventListener("click", async () => {
    await sendMessage(button.dataset.message);
  });
});

Promise.all([loadStatus(), loadServices()]).then(() => {
  const welcome = [
    "Hi, I'm your First Class project advisor.",
    "What are you thinking about remodeling?",
  ].join(" ");
  addMessage("assistant", welcome);
  renderLead({
    name: "",
    phone: "",
    email: "",
    project_type: "",
    budget: "",
    neighborhood: "",
    timeline: "",
    recommended_service: "",
    qualification_status: "in_progress",
  });
});
