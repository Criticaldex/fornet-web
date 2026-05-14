"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLang } from "../context/LangContext";

export default function Header() {
    const { t, toggleLang } = useLang();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const mql = window.matchMedia("(min-width: 901px)");
        const onResize = (e: MediaQueryListEvent) => {
            if (e.matches) setOpen(false);
        };

        document.addEventListener("keydown", onKey);
        mql.addEventListener("change", onResize);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", onKey);
            mql.removeEventListener("change", onResize);
        };
    }, [open]);

    const links: [string, string][] = [
        ["#home", t.nav_home],
        ["#modules", t.nav_modules],
        ["#benefits", t.nav_benefits],
        ["#pricing", t.nav_pricing],
        ["#contact", t.nav_contact],
    ];

    const goTo = (href: string) => {
        setOpen(false);
        requestAnimationFrame(() => {
            document
                .getElementById(href.replace("#", ""))
                ?.scrollIntoView({ behavior: "smooth" });
        });
    };

    return (
        <>
            <header className="header-shell">
                <div className="header-bar">
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
                        }}
                    >
                        {links.map(([href, label]) => (
                            <button
                                key={href}
                                className="header-nav-link"
                                onClick={() => goTo(href)}
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
                        className="header-lang-desktop"
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

                    <button
                        type="button"
                        className="mobile-menu-toggle"
                        aria-label={open ? t.nav_menu_close : t.nav_menu_open}
                        aria-expanded={open}
                        aria-controls="mobile-menu"
                        onClick={() => setOpen((o) => !o)}
                    >
                        <span className="bar" />
                        <span className="bar" />
                        <span className="bar" />
                    </button>
                </div>
            </header>

            <div
                id="mobile-menu"
                className={`mobile-menu${open ? " open" : ""}`}
                role="dialog"
                aria-modal="true"
                aria-hidden={!open}
                onClick={(e) => {
                    if (e.target === e.currentTarget) setOpen(false);
                }}
            >
                <nav className="mobile-menu-nav">
                    {links.map(([href, label]) => (
                        <button
                            key={href}
                            className="mobile-menu-link"
                            onClick={() => goTo(href)}
                        >
                            {label}
                        </button>
                    ))}
                    <button
                        type="button"
                        className="mobile-menu-lang"
                        onClick={toggleLang}
                    >
                        ES / EN
                    </button>
                </nav>
            </div>
        </>
    );
}
