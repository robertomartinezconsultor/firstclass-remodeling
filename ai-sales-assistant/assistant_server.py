from __future__ import annotations

import argparse
import json
import os
import re
import textwrap
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, asdict
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
CATALOG_PATH = BASE_DIR / "catalog" / "services.json"
LEADS_PATH = BASE_DIR / "data" / "leads.jsonl"
PROMPT_PATH = BASE_DIR / "prompts" / "system_prompt.md"

load_dotenv(BASE_DIR / ".env")

EMAIL_RE = re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.IGNORECASE)
PHONE_RE = re.compile(r"(\+?1?[\s\-.]?\(?\d{3}\)?[\s\-.]?\d{3}[\s\-.]?\d{4})")
AMOUNT_RE = re.compile(r"\$?\s?(\d[\d,]{3,})")


@dataclass
class LeadState:
    name: str = ""
    phone: str = ""
    email: str = ""
    project_type: str = ""
    budget: str = ""
    neighborhood: str = ""
    timeline: str = ""
    recommended_service: str = ""
    qualification_status: str = "in_progress"


class SalesAssistant:
    def __init__(self, catalog_path: Path, leads_path: Path, prompt_path: Path) -> None:
        self.catalog = json.loads(catalog_path.read_text())
        self.company = self.catalog["company"]
        self.services = self.catalog["services"]
        self.areas_lookup = {area.lower(): area for area in self.company["areas_served"]}
        self.sessions: dict[str, dict[str, Any]] = {}
        self.leads_path = leads_path
        self.leads_path.parent.mkdir(parents=True, exist_ok=True)
        self.system_prompt = prompt_path.read_text() if prompt_path.exists() else ""
        self.enable_ollama = os.getenv("ENABLE_OLLAMA", "false").lower() == "true"
        self.ollama_model = os.getenv("OLLAMA_MODEL", "qwen2.5:3b")

    def get_session(self, session_id: str) -> dict[str, Any]:
        return self.sessions.setdefault(
            session_id,
            {
                "lead": LeadState(),
                "history": [],
                "lead_saved": False,
            },
        )

    def chat(self, session_id: str, message: str) -> dict[str, Any]:
        session = self.get_session(session_id)
        lead: LeadState = session["lead"]
        session["history"].append({"role": "user", "content": message, "ts": time.time()})

        detected = self.extract_lead_fields(message)
        for key, value in detected.items():
            if value:
                setattr(lead, key, value)

        service = self.pick_service(message, lead)
        if service:
            lead.project_type = lead.project_type or service["name"]
            lead.recommended_service = service["headline"]

        lead.qualification_status = self.qualify(lead)

        reply = self.compose_reply(message, lead, service)
        refined = self.try_ollama(message, lead, service, reply)
        if refined:
            reply = refined

        session["history"].append({"role": "assistant", "content": reply, "ts": time.time()})

        if lead.qualification_status == "qualified" and not session["lead_saved"]:
            self.save_lead(session_id, lead, service)
            session["lead_saved"] = True

        return {
            "reply": reply,
            "lead": asdict(lead),
        }

    def extract_lead_fields(self, message: str) -> dict[str, str]:
        fields: dict[str, str] = {}
        lower = message.lower()

        email = EMAIL_RE.search(message)
        if email:
            fields["email"] = email.group(0)

        phone = PHONE_RE.search(message)
        if phone:
            digits = re.sub(r"\D", "", phone.group(0))
            if len(digits) == 10:
                fields["phone"] = f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
            elif len(digits) == 11 and digits.startswith("1"):
                digits = digits[1:]
                fields["phone"] = f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"

        name_patterns = [
            r"\bmy name is ([a-zA-Z][a-zA-Z'\- ]{1,40})",
            r"\bme llamo ([a-zA-ZáéíóúñÁÉÍÓÚÑ][a-zA-ZáéíóúñÁÉÍÓÚÑ'\- ]{1,40})",
            r"\bmi nombre es ([a-zA-ZáéíóúñÁÉÍÓÚÑ][a-zA-ZáéíóúñÁÉÍÓÚÑ'\- ]{1,40})",
        ]
        for pattern in name_patterns:
            match = re.search(pattern, message, re.IGNORECASE)
            if match:
                raw_name = match.group(1).strip(" .,-")
                raw_name = re.split(
                    r"\b(?:and|y|phone|telefono|teléfono|email|correo)\b",
                    raw_name,
                    maxsplit=1,
                    flags=re.IGNORECASE,
                )[0].strip(" .,-")
                fields["name"] = " ".join(part.capitalize() for part in raw_name.split())
                break

        amount = AMOUNT_RE.search(message)
        if amount:
            raw_amount = int(amount.group(1).replace(",", ""))
            fields["budget"] = self.normalize_budget(raw_amount)
        else:
            budget_labels = {
                "$15,000 - $30,000": ["15", "20", "25", "30", "under 30", "30k", "30 mil"],
                "$30,000 - $60,000": ["40", "45", "50", "60", "40k", "50k", "60k", "60 mil"],
                "$60,000 - $100,000": ["70", "80", "90", "100", "70k", "80k", "90k", "100k"],
                "$100,000+": ["100+", "120", "150", "200", "high end", "luxury", "120k", "150k"],
            }
            for label, hints in budget_labels.items():
                if any(hint in lower for hint in hints):
                    fields["budget"] = label
                    break
            if "prefer to discuss" in lower:
                fields["budget"] = "Prefer to discuss"

        timeline_map = {
            "ASAP": ["asap", "right away", "urgent", "urgente", "este mes", "this month"],
            "1-3 months": ["next month", "1 month", "2 months", "3 months", "one to three months", "1-3 months"],
            "3-6 months": ["spring", "summer", "fall", "3-6 months", "later this year", "later this summer"],
            "Researching": ["just looking", "researching", "shopping around", "exploring", "cotizando"],
        }
        for timeline, hints in timeline_map.items():
            if any(hint in lower for hint in hints):
                fields["timeline"] = timeline
                break

        for area_lower, proper_name in self.areas_lookup.items():
            if area_lower in lower:
                fields["neighborhood"] = proper_name
                break

        return fields

    def normalize_budget(self, amount: int) -> str:
        if amount < 30000:
            return "$15,000 - $30,000"
        if amount < 60000:
            return "$30,000 - $60,000"
        if amount < 100000:
            return "$60,000 - $100,000"
        return "$100,000+"

    def pick_service(self, message: str, lead: LeadState) -> dict[str, Any] | None:
        lower = message.lower()
        if lead.project_type:
            for service in self.services:
                if lead.project_type.lower() in {service["name"].lower(), service["headline"].lower()}:
                    return service

        if ("kitchen" in lower or "cocina" in lower) and (
            "bath" in lower or "bathroom" in lower or "baño" in lower or "bano" in lower
        ):
            return self.find_service("kitchen_bath_combo")

        scored: list[tuple[int, dict[str, Any]]] = []
        for service in self.services:
            score = sum(1 for keyword in service["keywords"] if keyword.lower() in lower)
            if score:
                scored.append((score, service))

        if scored:
            scored.sort(key=lambda item: item[0], reverse=True)
            return scored[0][1]

        return None

    def find_service(self, service_id: str) -> dict[str, Any] | None:
        for service in self.services:
            if service["id"] == service_id:
                return service
        return None

    def qualify(self, lead: LeadState) -> str:
        has_contact = bool(lead.phone or lead.email)
        core = bool(lead.project_type and lead.budget and lead.neighborhood)
        return "qualified" if has_contact and core else "in_progress"

    def compose_reply(self, message: str, lead: LeadState, service: dict[str, Any] | None) -> str:
        if not service:
            return (
                "Happy to help. What are you thinking about remodeling, and what area is the home in?"
            )

        missing = self.missing_fields(lead)
        summary = self.short_service_summary(service)

        if lead.qualification_status == "qualified":
            extra_missing = [field for field in self.missing_fields(lead) if field in {"name", "timeline"}]
            follow_up = self.questions_for_missing(extra_missing[:1])
            return (
                f"{summary}\n\n"
                f"If you want, the next step is a free consultation. "
                f"You can call {self.company['phone']} or use WhatsApp: {self.company['whatsapp']}. "
                f"{follow_up}"
            )

        questions = self.questions_for_missing(missing)
        return f"{summary}\n\n{questions}"

    def short_service_summary(self, service: dict[str, Any]) -> str:
        service_name = service["headline"]
        budget = service["budget_label"]
        return (
            f"That sounds like a good fit for {service_name}. "
            f"Most projects in that range land around {budget}, depending on layout and finishes. "
            f"We've been doing this in San Antonio since {self.company['established']}."
        )

    def missing_fields(self, lead: LeadState) -> list[str]:
        missing = []
        if not lead.name:
            missing.append("name")
        if not (lead.phone or lead.email):
            missing.append("contact")
        if not lead.neighborhood:
            missing.append("neighborhood")
        if not lead.budget:
            missing.append("budget")
        if not lead.timeline:
            missing.append("timeline")
        return missing

    def questions_for_missing(self, missing: list[str]) -> str:
        if not missing:
            return ""

        prompts = {
            "name": "What name should I put on the estimate?",
            "contact": "What is the best phone number or email for you?",
            "neighborhood": "What area is the home in?",
            "budget": "What budget range are you aiming for?",
            "timeline": "When are you hoping to start?",
        }

        selected = [prompts[key] for key in missing[:1]]
        return " ".join(selected)

    def try_ollama(
        self,
        message: str,
        lead: LeadState,
        service: dict[str, Any] | None,
        fallback_reply: str,
    ) -> str | None:
        if not self.enable_ollama:
            return None

        payload = {
            "model": self.ollama_model,
            "stream": False,
            "prompt": textwrap.dedent(
                f"""
                {self.system_prompt}

                Company context:
                {json.dumps(self.company, indent=2)}

                Suggested service:
                {json.dumps(service, indent=2) if service else "None"}

                Current lead:
                {json.dumps(asdict(lead), indent=2)}

                User message:
                {message}

                Fallback reply:
                {fallback_reply}

                Rewrite the fallback reply to sound warm, human and concise, but do not invent services or prices.
                """
            ).strip(),
        }

        try:
            req = urllib.request.Request(
                "http://localhost:11434/api/generate",
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
            )
            with urllib.request.urlopen(req, timeout=1.5) as response:
                data = json.loads(response.read().decode("utf-8"))
            return data.get("response", "").strip() or None
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError):
            return None

    def ollama_is_available(self) -> bool:
        try:
            with urllib.request.urlopen("http://localhost:11434/api/tags", timeout=0.4) as response:
                return response.status == 200
        except urllib.error.URLError:
            return False

    def save_lead(self, session_id: str, lead: LeadState, service: dict[str, Any] | None) -> None:
        record = {
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "session_id": session_id,
            "source": "local-web-chat",
            "recommended_service_id": service["id"] if service else "",
            "lead": asdict(lead),
        }
        with self.leads_path.open("a", encoding="utf-8") as handle:
            handle.write(json.dumps(record, ensure_ascii=True) + "\n")

    def status(self) -> dict[str, Any]:
        return {
            "assistant_name": self.company["assistant_name"],
            "engine_label": "Ollama live" if self.ollama_is_available() and self.enable_ollama else "Local rule engine",
            "lead_count": self.count_leads(),
            "area_count": len(self.company["areas_served"]),
            "phone": self.company["phone"],
            "whatsapp": self.company["whatsapp"],
        }

    def count_leads(self) -> int:
        if not self.leads_path.exists():
            return 0
        with self.leads_path.open("r", encoding="utf-8") as handle:
            return sum(1 for line in handle if line.strip())


class AssistantHandler(SimpleHTTPRequestHandler):
    assistant = SalesAssistant(CATALOG_PATH, LEADS_PATH, PROMPT_PATH)

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/status":
            return self.send_json(self.assistant.status())
        if path == "/api/services":
            return self.send_json({"services": self.assistant.services})
        return super().do_GET()

    def do_POST(self) -> None:
        path = urlparse(self.path).path
        if path != "/api/chat":
            self.send_error(404)
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(content_length or 0)
        payload = json.loads(body.decode("utf-8") or "{}")
        message = str(payload.get("message", "")).strip()
        session_id = str(payload.get("session_id", "")).strip() or f"session-{int(time.time())}"

        if not message:
            self.send_json({"error": "Message is required"}, status=400)
            return

        response = self.assistant.chat(session_id, message)
        self.send_json(response)

    def send_json(self, payload: dict[str, Any], status: int = 200) -> None:
        data = json.dumps(payload, ensure_ascii=True).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, format: str, *args: Any) -> None:
        print(f"[assistant] {self.address_string()} - {format % args}")


def main() -> None:
    parser = argparse.ArgumentParser(description="First Class Remodeling TX project advisor")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8791)
    args = parser.parse_args()

    server = ThreadingHTTPServer((args.host, args.port), AssistantHandler)
    print(f"Assistant running on http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
