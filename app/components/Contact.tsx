"use client";

import { useState } from "react";
import { useLang } from "../context/LangContext";
import FadeIn from "./FadeIn";

export default function Contact() {
    const { t } = useLang();
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
            email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
            company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
            role: (form.elements.namedItem("role") as HTMLInputElement).value.trim(),
            message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
        };

        setStatus("sending");
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const json = await res.json();
            if (json.success) {
                setStatus("ok");
                form.reset();
            } else {
                setStatus("error");
            }
        } catch {
            setStatus("error");
        }
    }

    return (
        <section
            id="contact"
            style={{ padding: "90px 0", background: "#0d0d0d", textAlign: "center" }}
        >
            <div style={{ width: "90%", maxWidth: 1500, margin: "auto", fontSize: "1.5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: 16 }}>{t.contact_title}</h2>
                <p style={{ color: "#f5f5f5", fontSize: "1rem" }}>{t.contact_desc}</p>

                <FadeIn>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input name="name" type="text" placeholder={t.contact_name} required />
                            <input name="email" type="email" placeholder={t.contact_email} required />
                        </div>
                        <div className="form-row">
                            <input name="company" type="text" placeholder={t.contact_company} required />
                            <input name="role" type="text" placeholder={t.contact_role} />
                        </div>
                        <textarea name="message" placeholder={t.contact_message} rows={6} required />

                        <button type="submit" className="btn primary" disabled={status === "sending"}>
                            {status === "sending" ? "..." : t.cta_contact}
                        </button>

                        {status === "ok" && (
                            <p style={{ color: "#4caf50", marginTop: 12 }}>
                                Mensaje enviado correctamente.
                            </p>
                        )}
                        {status === "error" && (
                            <p style={{ color: "#f44336", marginTop: 12 }}>Error al enviar. Inténtalo de nuevo.</p>
                        )}
                    </form>
                </FadeIn>
            </div>
        </section>
    );
}
