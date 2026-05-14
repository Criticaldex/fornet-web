"use client";

import Image from "next/image";
import { useLang } from "../context/LangContext";

export default function Header() {
    const { t, toggleLang } = useLang();

    return (
        <header
            style={{
                background: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                position: "fixed",
                width: "100%",
                top: 0,
                zIndex: 10,
            }}
        >
            <div
                style={{
                    width: "90%",
                    maxWidth: 1500,
                    margin: "auto",
                    display: "grid",
                    gridTemplateColumns: "auto 1fr auto",
                    alignItems: "center",
                    height: 80,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifySelf: "start" }}>
                    <Image
                        src="/assets/fornet_color.svg"
                        alt="ForNet logo"
                        width={48}
                        height={48}
                        style={{ height: 48, width: "auto" }}
                        priority
                    />
                    <span style={{ color: "#fff", fontFamily: "'DejaVu Sans', Helvetica, Arial, sans-serif", fontWeight: 700, fontSize: "2rem", letterSpacing: "-0.02em" }}>
                        ForNet
                    </span>
                </div>

                <nav
                    className="header-nav"
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: 40,
                    }}
                >
                    {(
                        [
                            ["#home", t.nav_home],
                            ["#modules", t.nav_modules],
                            ["#benefits", t.nav_benefits],
                            ["#pricing", t.nav_pricing],
                            ["#contact", t.nav_contact],
                        ] as [string, string][]
                    ).map(([href, label]) => (
                        <button
                            key={href}
                            className="header-nav-link"
                            onClick={() => document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" })}
                            style={{
                                background: "none",
                                border: "none",
                                color: "white",
                                cursor: "pointer",
                                fontSize: "1.2rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                                padding: 0,
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={toggleLang}
                    style={{
                        background: "transparent",
                        border: "1px solid #ff6600",
                        color: "#ff6600",
                        padding: "7px 18px",
                        cursor: "pointer",
                        justifySelf: "end",
                        height: 36,
                        display: "flex",
                        alignItems: "center",
                        borderRadius: 20,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                    }}
                >
                    ES / EN
                </button>
            </div>
        </header>
    );
}
