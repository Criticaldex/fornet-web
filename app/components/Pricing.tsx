"use client";

import { useState } from "react";
import { useLang, texts } from "../context/LangContext";
import type { TextKey } from "../context/LangContext";
import FadeIn from "./FadeIn";

type SensorTier = 10 | 50 | 100 | 200 | 500;
type BillingMode = "annual" | "monthly";
type AddonKey = "powerbi" | "mqtt" | "reports" | "viewer";

interface AddonConfig {
    key: AddonKey;
    icon: string;
    labelKey: TextKey;
    rate: number;
}

const SENSOR_PRICES: Record<SensorTier, number> = {
    10: 600,
    50: 3000,
    100: 5500,
    200: 9000,
    500: 20000,
};

const SENSOR_TIERS: SensorTier[] = [10, 50, 100, 200, 500];

const ADDONS: AddonConfig[] = [
    { key: "powerbi",  icon: "fa-solid fa-chart-pie",     labelKey: "pricing_addon_powerbi",  rate: 0.40 },
    { key: "mqtt",     icon: "fa-solid fa-network-wired", labelKey: "pricing_addon_mqtt",     rate: 0.25 },
    { key: "reports",  icon: "fa-solid fa-file-pdf",      labelKey: "pricing_addon_reports",  rate: 0.20 },
    { key: "viewer",   icon: "fa-solid fa-cube",          labelKey: "pricing_addon_viewer",   rate: 0.25 },
];

const IMPL_COST_PER_NODE = 2000;
const MONTHLY_SURCHARGE  = 1.15;
const MIN_NODES = 1;
const MAX_NODES = 20;

interface PricingResult {
    baseAnnual: number;
    addonsAnnual: number;
    subscriptionAnnual: number;
    subscriptionDisplay: number;
    implementation: number;
    firstYearTotal: number;
    isMonthly: boolean;
}

function calcPricing(
    tier: SensorTier,
    billing: BillingMode,
    activeAddons: Set<AddonKey>,
    nodes: number,
): PricingResult {
    const baseAnnual = SENSOR_PRICES[tier];
    const addonsRate = ADDONS.filter(a => activeAddons.has(a.key)).reduce((s, a) => s + a.rate, 0);
    const addonsAnnual = Math.round(baseAnnual * addonsRate);
    const subscriptionAnnual = baseAnnual + addonsAnnual;
    const isMonthly = billing === "monthly";
    const subscriptionDisplay = isMonthly
        ? Math.round((subscriptionAnnual * MONTHLY_SURCHARGE) / 12)
        : subscriptionAnnual;
    const implementation = nodes * IMPL_COST_PER_NODE;
    const firstYearTotal = isMonthly
        ? Math.round(subscriptionAnnual * MONTHLY_SURCHARGE) + implementation
        : subscriptionAnnual + implementation;
    return { baseAnnual, addonsAnnual, subscriptionAnnual, subscriptionDisplay, implementation, firstYearTotal, isMonthly };
}

function fmt(n: number) {
    return n.toLocaleString("es-ES");
}

function buildPrefillMessage(
    lang: "es" | "en",
    tier: SensorTier,
    billing: BillingMode,
    activeAddons: Set<AddonKey>,
    nodes: number,
    result: PricingResult,
): string {
    const activeList = ADDONS.filter(a => activeAddons.has(a.key));

    if (lang === "es") {
        const addonsLine = activeList.length
            ? activeList.map(a => texts.es[a.labelKey]).join(", ")
            : "Solo visualización base";
        const billingLabel = billing === "annual" ? "Anual" : "Mensual";
        const subLabel = billing === "annual" ? "€/año" : "€/mes";
        return [
            "Solicitud de presupuesto ForNet:",
            `- Sensores: ${tier} sensores`,
            `- Facturación: ${billingLabel}`,
            `- Módulos activos: ${addonsLine}`,
            `- Nodos / IPs: ${nodes}`,
            `- Coste suscripción: ${fmt(result.subscriptionDisplay)} ${subLabel}`,
            `- Implementación (único): ${fmt(result.implementation)} €`,
            `- Total primer año estimado: ${fmt(result.firstYearTotal)} €`,
        ].join("\n");
    } else {
        const addonsLine = activeList.length
            ? activeList.map(a => texts.en[a.labelKey]).join(", ")
            : "Base visualization only";
        const billingLabel = billing === "annual" ? "Annual" : "Monthly";
        const subLabel = billing === "annual" ? "€/year" : "€/month";
        return [
            "ForNet pricing request:",
            `- Sensors: ${tier} sensors`,
            `- Billing: ${billingLabel}`,
            `- Active modules: ${addonsLine}`,
            `- Nodes / IPs: ${nodes}`,
            `- Subscription cost: ${fmt(result.subscriptionDisplay)} ${subLabel}`,
            `- Implementation (one-time): ${fmt(result.implementation)} €`,
            `- Estimated first year total: ${fmt(result.firstYearTotal)} €`,
        ].join("\n");
    }
}

export default function Pricing({ onRequestQuote }: { onRequestQuote: (msg: string) => void }) {
    const { t, lang } = useLang();
    const [tier, setTier] = useState<SensorTier>(50);
    const [billing, setBilling] = useState<BillingMode>("annual");
    const [activeAddons, setActiveAddons] = useState<Set<AddonKey>>(new Set());
    const [nodes, setNodes] = useState(1);

    const result = calcPricing(tier, billing, activeAddons, nodes);

    function toggleAddon(key: AddonKey) {
        setActiveAddons(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }

    function handleCTA() {
        const msg = buildPrefillMessage(lang, tier, billing, activeAddons, nodes, result);
        onRequestQuote(msg);
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }

    const subLabel = result.isMonthly ? "€/mes" : "€/año";
    const subLabelEn = result.isMonthly ? "€/month" : "€/year";
    const currentSubLabel = lang === "es" ? subLabel : subLabelEn;

    return (
        <section id="pricing" className="pricing-section">
            <div style={{ width: "90%", maxWidth: 1500, margin: "auto", textAlign: "center" }}>
                <h2 className="section-title">{t.pricing_title}</h2>
                <p style={{ color: "#aaa", fontSize: "1rem" }}>{t.pricing_subtitle}</p>

                <div className="pricing-layout">
                    {/* Left column: controls */}
                    <div>
                        {/* Sensor tiers */}
                        <span className="pricing-section-label">{t.pricing_sensors_label}</span>
                        <div className="pricing-tiers">
                            {SENSOR_TIERS.map(s => (
                                <button
                                    key={s}
                                    className={`pricing-tier-card${tier === s ? " selected" : ""}`}
                                    onClick={() => setTier(s)}
                                >
                                    <span className="tier-sensors">{s}</span>
                                    <span className="tier-price">{fmt(SENSOR_PRICES[s])} €/año</span>
                                </button>
                            ))}
                        </div>

                        {/* Billing toggle */}
                        <div style={{ marginTop: 28 }}>
                            <div className="pricing-billing-toggle">
                                <button
                                    className={billing === "annual" ? "active" : ""}
                                    onClick={() => setBilling("annual")}
                                >
                                    {t.pricing_billing_annual}
                                </button>
                                <button
                                    className={billing === "monthly" ? "active" : ""}
                                    onClick={() => setBilling("monthly")}
                                >
                                    {t.pricing_billing_monthly}
                                </button>
                            </div>
                            <span className="pricing-billing-note">{t.pricing_billing_note}</span>
                        </div>

                        {/* Add-ons */}
                        <div style={{ marginTop: 32 }}>
                            <span className="pricing-section-label">{t.pricing_addons_title}</span>
                            <div className="pricing-addons">
                                {ADDONS.map(addon => (
                                    <button
                                        key={addon.key}
                                        className={`pricing-addon-card${activeAddons.has(addon.key) ? " selected" : ""}`}
                                        onClick={() => toggleAddon(addon.key)}
                                    >
                                        <i className={`${addon.icon} addon-icon`} />
                                        <span className="addon-name">{t[addon.labelKey]}</span>
                                        <span className="addon-rate">+{Math.round(addon.rate * 100)}%</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Node stepper */}
                        <div style={{ marginTop: 32 }}>
                            <span className="pricing-section-label">{t.pricing_nodes_label}</span>
                            <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: 8 }}>{t.pricing_nodes_desc}</p>
                            <div className="pricing-node-stepper">
                                <button
                                    onClick={() => setNodes(n => Math.max(MIN_NODES, n - 1))}
                                    disabled={nodes <= MIN_NODES}
                                    aria-label="Reducir nodos"
                                >
                                    −
                                </button>
                                <span className="node-count">{nodes}</span>
                                <button
                                    onClick={() => setNodes(n => Math.min(MAX_NODES, n + 1))}
                                    disabled={nodes >= MAX_NODES}
                                    aria-label="Aumentar nodos"
                                >
                                    +
                                </button>
                            </div>
                            <p className="pricing-node-hint">€{fmt(IMPL_COST_PER_NODE)}/nodo · {t.pricing_onetime}</p>
                        </div>
                    </div>

                    {/* Right column: summary */}
                    <FadeIn>
                        <div className="pricing-summary">
                            <div className="pricing-summary-row">
                                <div>
                                    <div>{t.pricing_base_label}</div>
                                    <div className="row-label">{tier} sensores · live + historial</div>
                                </div>
                                <span className="amount">{fmt(result.baseAnnual)} €/año</span>
                            </div>

                            {result.addonsAnnual > 0 && (
                                <div className="pricing-summary-row">
                                    <div>
                                        <div>{t.pricing_addons_label}</div>
                                        <div className="row-label">
                                            {ADDONS.filter(a => activeAddons.has(a.key)).map(a => t[a.labelKey]).join(", ")}
                                        </div>
                                    </div>
                                    <span className="amount">+{fmt(result.addonsAnnual)} €/año</span>
                                </div>
                            )}

                            <div className="pricing-summary-row">
                                <div>
                                    <div>{t.pricing_implementation_label}</div>
                                    <div className="row-label">{nodes} {nodes === 1 ? "nodo" : "nodos"} × €{fmt(IMPL_COST_PER_NODE)}</div>
                                </div>
                                <span className="amount">{fmt(result.implementation)} € · {t.pricing_onetime}</span>
                            </div>

                            <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                                    <span style={{ fontSize: "0.85rem", color: "#aaa" }}>
                                        {result.isMonthly ? t.pricing_billing_monthly : t.pricing_billing_annual}
                                    </span>
                                    <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff" }}>
                                        {fmt(result.subscriptionDisplay)} {currentSubLabel}
                                    </span>
                                </div>
                            </div>

                            <div className="pricing-summary-total">
                                <span className="label">{t.pricing_first_year_label}</span>
                                <span className="total-amount">{fmt(result.firstYearTotal)} €</span>
                            </div>

                            <button
                                className="btn primary"
                                style={{ width: "100%", marginTop: 24, textAlign: "center" }}
                                onClick={handleCTA}
                            >
                                {t.pricing_cta}
                            </button>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
