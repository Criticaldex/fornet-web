"use client";

import { useLang } from "../context/LangContext";
import FadeIn from "./FadeIn";

const values = [
    { icon: "fa-solid fa-lightbulb", titleKey: "values_1", descKey: "sub_values_1" },
    { icon: "fa-solid fa-shield-halved", titleKey: "values_2", descKey: "sub_values_2" },
    { icon: "fa-solid fa-circle-check", titleKey: "values_3", descKey: "sub_values_3" },
] as const;

export default function Values() {
    const { t } = useLang();

    return (
        <section style={{ padding: "90px 0", background: "#424242" }}>
            <div style={{ width: "90%", maxWidth: 1500, margin: "auto", fontSize: "1.5rem", textAlign: "center" }}>
                <h2 className="section-title">{t.values_title}</h2>
                <div className="values-grid">
                    {values.map((v) => (
                        <FadeIn key={v.titleKey} className="value-item">
                            <i className={`${v.icon} value-icon`} />
                            <h3>{t[v.titleKey]}</h3>
                            <p style={{ color: "#f5f5f5" }}>{t[v.descKey]}</p>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
