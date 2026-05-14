"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "../context/LangContext";

const INTERVAL_MS = 4000;

const slides = [
    { src: "/assets/imagenes_web/home_fornet.PNG", caption: "Home ForNet" },
    { src: "/assets/imagenes_web/viewer_1.PNG", caption: "Viewer" },
    { src: "/assets/imagenes_web/viewer_2.PNG", caption: "Viewer 2" },
    { src: "/assets/imagenes_web/summary.PNG", caption: "Summary" },
    { src: "/assets/imagenes_web/sensorsfornet.PNG", caption: "Sensores ForNet" },
    { src: "/assets/imagenes_web/reports.PNG", caption: "Informes" },
    { src: "/assets/imagenes_web/bi20.PNG", caption: "Business Intelligence" },
    { src: "/assets/imagenes_web/101.PNG", caption: "ForNet 101" },
];

export default function Carousel() {
    const { t } = useLang();
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetAuto = (index: number) => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), INTERVAL_MS);
        setCurrent(((index % slides.length) + slides.length) % slides.length);
    };

    useEffect(() => {
        timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % slides.length), INTERVAL_MS);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    return (
        <section className="carousel-section">
            <div style={{ width: "90%", maxWidth: 1500, margin: "auto", textAlign: "center" }}>
                <h2 className="carousel-title">{t.carousel_title}</h2>
                <p className="carousel-subtitle">{t.carousel_subtitle}</p>
            </div>

            <div className="carousel-wrapper">
                <div className="carousel-track-container">
                    <div
                        className="carousel-track"
                        style={{ transform: `translateX(-${current * 100}%)` }}
                    >
                        {slides.map((slide) => (
                            <div key={slide.src} className="carousel-slide">
                                {/* Using <img> directly to avoid Next.js image optimization issues with unknown dimensions */}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={slide.src} alt={slide.caption} />
                                <div className="carousel-caption">{slide.caption}</div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="carousel-btn carousel-btn--prev"
                        onClick={() => resetAuto(current - 1)}
                        aria-label="Previous"
                    >
                        &#8592;
                    </button>
                    <button
                        className="carousel-btn carousel-btn--next"
                        onClick={() => resetAuto(current + 1)}
                        aria-label="Next"
                    >
                        &#8594;
                    </button>

                    <div className="carousel-counter">
                        {current + 1} / {slides.length}
                    </div>
                </div>
            </div>

            <div className="carousel-dots">
                {slides.map((_, i) => (
                    <span
                        key={i}
                        className={`dot${i === current ? " active" : ""}`}
                        onClick={() => resetAuto(i)}
                    />
                ))}
            </div>
        </section>
    );
}
