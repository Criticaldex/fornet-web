"use client";

import { useLang } from "../context/LangContext";

export default function Hero() {
    const { t } = useLang();

    return (
        <section id="home" className="hero">
            <div className="section-container" style={{ textAlign: "center" }}>
                <span className="hero-badge">{t.hero_badge}</span>
                <h1>{t.hero_title}</h1>
                <p>{t.hero_subtitle}</p>
                <div className="hero-cta">
                    <button
                        className="btn primary"
                        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                    >
                        {t.cta_demo}
                    </button>
                </div>
            </div>
        </section>
    );
}
