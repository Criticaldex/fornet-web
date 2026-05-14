"use client";

import Image from "next/image";
import { useLang } from "../context/LangContext";
import FadeIn from "./FadeIn";

const benefits = [
    { icon: "/assets/icons/integration_2.png", titleKey: "benefit_1", descKey: "sub_benefit_1" },
    { icon: "/assets/icons/customization.png", titleKey: "benefit_2", descKey: "sub_benefit_2" },
    { icon: "/assets/icons/competitiveness.png", titleKey: "benefit_3", descKey: "sub_benefit_3" },
    { icon: "/assets/icons/decision.png", titleKey: "benefit_4", descKey: "sub_benefit_4" },
] as const;

export default function Benefits() {
    const { t } = useLang();

    return (
        <section id="benefits" style={{ padding: "90px 0" }}>
            <div style={{ width: "90%", maxWidth: 1500, margin: "auto", fontSize: "1.5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: 40 }}>{t.benefits_title}</h2>
                <div className="benefits-grid">
                    {benefits.map((b) => (
                        <FadeIn key={b.titleKey} className="benefit-card">
                            <Image src={b.icon} alt="" width={70} height={70} style={{ height: 70, width: "auto", margin: "0 auto 20px" }} />
                            <h3>{t[b.titleKey]}</h3>
                            <p>{t[b.descKey]}</p>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
