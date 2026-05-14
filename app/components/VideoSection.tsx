"use client";

import { useLang } from "../context/LangContext";
import FadeIn from "./FadeIn";

export default function VideoSection() {
    const { t } = useLang();

    return (
        <section className="video-inline" style={{ padding: "90px 0" }}>
            <div
                style={{ width: "90%", maxWidth: 1500, margin: "auto" }}
                className="video-grid"
            >
                <FadeIn className="video-text">
                    <h2 className="section-title" style={{ marginBottom: 16 }}>{t.video_title}</h2>
                    <p>{t.video_desc}</p>
                </FadeIn>

                <FadeIn className="video-wrapper">
                    <video controls poster="/assets/fornet_color.svg">
                        <source src="/assets/video/ForNet.mp4" type="video/mp4" />
                    </video>
                </FadeIn>
            </div>
        </section>
    );
}
