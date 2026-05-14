"use client";

import { useState, useEffect } from "react";
import { useLang } from "../context/LangContext";
import FadeIn from "./FadeIn";

export default function Contact({ prefillMessage = "" }: { prefillMessage?: string }) {
    const { t } = useLang();
    const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (prefillMessage) {
            setMessage(prefillMessage);
            setStatus("idle");
        }
    }, [prefillMessage]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const data = {
            name: (form.elements.namedItem("name") as HTMLInputElement).value.trim(),
            email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
            company: (form.elements.namedItem("company") as HTMLInputElement).value.trim(),
            role: (form.elements.namedItem("role") as HTMLInputElement).value.trim(),
            message: message.trim(),
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
                setMessage("");
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
            className="section-pad"
            style={{ background: "#0d0d0d", textAlign: "center" }}
        >
            <div className="section-container" style={{ textAlign: "center" }}>
                <h2 className="section-title" style={{ marginBottom: 16 }}>{t.contact_title}</h2>
                <p style={{ color: "#f5f5f5", fontSize: "1rem" }}>{t.contact_desc}</p>

                <FadeIn>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <input
                                name="name"
                                type="text"
                                placeholder={t.contact_name}
                                required
                                inputMode="text"
                                autoComplete="name"
                                autoCapitalize="words"
                                enterKeyHint="next"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder={t.contact_email}
                                required
                                inputMode="email"
                                autoComplete="email"
                                autoCapitalize="none"
                                spellCheck={false}
                                enterKeyHint="next"
                            />
                        </div>
                        <div className="form-row">
                            <input
                                name="company"
                                type="text"
                                placeholder={t.contact_company}
                                required
                                inputMode="text"
                                autoComplete="organization"
                                autoCapitalize="words"
                                enterKeyHint="next"
                            />
                            <input
                                name="role"
                                type="text"
                                placeholder={t.contact_role}
                                inputMode="text"
                                autoComplete="organization-title"
                                autoCapitalize="words"
                                enterKeyHint="next"
                            />
                        </div>
                        <textarea
                            name="message"
                            placeholder={t.contact_message}
                            rows={6}
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            inputMode="text"
                            autoComplete="off"
                            autoCapitalize="sentences"
                            enterKeyHint="send"
                        />

                        <button type="submit" className="btn primary" disabled={status === "sending"}>
                            {status === "sending" ? "..." : t.cta_contact}
                        </button>

                        {status === "ok" && (
                            <p style={{ color: "#4caf50", marginTop: 12 }}>
                                {t.contact_ok}
                            </p>
                        )}
                        {status === "error" && (
                            <p style={{ color: "#f44336", marginTop: 12 }}>{t.contact_error}</p>
                        )}
                    </form>
                </FadeIn>
            </div>
        </section>
    );
}
