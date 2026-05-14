"use client";

import { useLang } from "../context/LangContext";
import type { TextKey } from "../context/LangContext";

type Module = { icon: string; titleKey: TextKey; descKey: TextKey; rotate?: boolean };

const modules: Module[] = [
    { icon: "fa-solid fa-chart-line", titleKey: "module_1_title", descKey: "module_1_desc" },
    { icon: "fa-solid fa-network-wired", titleKey: "module_2_title", descKey: "module_2_desc" },
    { icon: "fa-solid fa-chart-bar", titleKey: "module_3_title", descKey: "module_3_desc", rotate: true },
    { icon: "fa-solid fa-file-pdf", titleKey: "module_4_title", descKey: "module_4_desc" },
    { icon: "fa-solid fa-eye", titleKey: "module_5_title", descKey: "module_5_desc" },
];

export default function Modules() {
    const { t } = useLang();

    return (
        <section id="modules" style={{ padding: "90px 0" }}>
            <div style={{ width: "90%", maxWidth: 1500, margin: "auto", fontSize: "1.5rem", textAlign: "center" }}>
                <h2 style={{ fontSize: "2.5rem", marginBottom: 40 }}>{t.modules_title}</h2>
                <div className="cards">
                    {modules.map((mod) => (
                        <div key={mod.titleKey} className="card">
                            <i
                                className={`${mod.icon} card-fa-icon`}
                                style={mod.rotate ? { transform: "rotate(270deg)" } : undefined}
                            />
                            <h3>{t[mod.titleKey]}</h3>
                            <p>{t[mod.descKey]}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
