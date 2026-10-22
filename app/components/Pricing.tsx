"use client";

import { useState } from "react";
import { useLang, texts } from "../context/LangContext";
import type { TextKey } from "../context/LangContext";
import FadeIn from "./FadeIn";

type SensorTier = 10 | 50 | 100 | 200 | 500;
type UserTier = 50 | 100 | 200 | 500;
type BillingMode = "annual" | "monthly";
type AddonKey = "powerbi" | "mqtt" | "reports" | "viewer";

interface AddonConfig {
    key: AddonKey;
    icon: string;
    labelKey: TextKey;
    descKey: TextKey;
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
    { key: "powerbi",  icon: "fa-solid fa-chart-pie",     labelKey: "pricing_addon_powerbi",  descKey: "pricing_addon_powerbi_desc",  rate: 0.30 },
    { key: "mqtt",     icon: "fa-solid fa-network-wired", labelKey: "pricing_addon_mqtt",     descKey: "pricing_addon_mqtt_desc",     rate: 0.30 },
    { key: "reports",  icon: "fa-solid fa-file-pdf",      labelKey: "pricing_addon_reports",  descKey: "pricing_addon_reports_desc",  rate: 0.10 },
    { key: "viewer",   icon: "fa-solid fa-cube",          labelKey: "pricing_addon_viewer",   descKey: "pricing_addon_viewer_desc",   rate: 0.30 },
];

const USER_TIERS: UserTier[] = [50, 100, 200, 500];

// Surcharge on the base sensor price; up to 50 users are included.
const USER_RATES: Record<UserTier, number> = {
    50: 0,
    100: 0.05,
    200: 0.10,
    500: 0.20,
};

const IMPL_COST_PER_NODE = 3000;
const MONTHLY_SURCHARGE  = 1.15;
const MIN_NODES = 1;
const MAX_NODES = 20;

interface PricingResult {
    baseAnnual: number;
    addonsAnnual: number;
    usersAnnual: number;
    subscriptionAnnual: number;
    implementation: number;
    totalAnnual: number;
    mainAmount: number;
    altAmount: number;
}

function addonPrice(baseAnnual: number, addon: AddonConfig) {
    return Math.round(baseAnnual * addon.rate);
}

function calcPricing(
    tier: SensorTier,
    users: UserTier,
    billing: BillingMode,
    activeAddons: Set<AddonKey>,
    nodes: number,
): PricingResult {
    const baseAnnual = SENSOR_PRICES[tier];
    const addonsAnnual = ADDONS.filter(a => activeAddons.has(a.key)).reduce((s, a) => s + addonPrice(baseAnnual, a), 0);
    const usersAnnual = Math.round(baseAnnual * USER_RATES[users]);
    const subscriptionAnnual = baseAnnual + addonsAnnual + usersAnnual;
    const implementation = nodes * IMPL_COST_PER_NODE;

    // totalAnnual: recurring subscription in €/year (with surcharge if monthly billing).
    // Implementation is a one-time fee and is NOT included.
    const totalAnnual = billing === "annual"
        ? subscriptionAnnual
        : Math.round(subscriptionAnnual * MONTHLY_SURCHARGE);

    // mainAmount: shown big (period selected). altAmount: shown small (other period).
    // Symmetric within mode: main × 12 = alt (monthly), main / 12 = alt (annual).
    const mainAmount = billing === "annual" ? totalAnnual : Math.round(totalAnnual / 12);
    const altAmount  = billing === "annual" ? Math.round(totalAnnual / 12) : totalAnnual;

    return { baseAnnual, addonsAnnual, usersAnnual, subscriptionAnnual, implementation, totalAnnual, mainAmount, altAmount };
}

function fmt(n: number) {
    return n.toLocaleString("es-ES");
}

function buildPrefillMessage(
    lang: "es" | "en",
    tier: SensorTier,
    users: UserTier,
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
        const mainUnit = billing === "annual" ? "€/año" : "€/mes";
        const altUnit  = billing === "annual" ? "€/mes" : "€/año";
        return [
            "Solicitud de presupuesto ForNet:",
            `- Sensores: ${tier} sensores`,
            `- Usuarios: ${users}`,
            `- Facturación: ${billingLabel}`,
            `- Módulos activos: ${addonsLine}`,
            `- Nodos / IPs: ${nodes}`,
            `- Coste total: ${fmt(result.mainAmount)} ${mainUnit} (${fmt(result.altAmount)} ${altUnit})`,
            `- Implementación (pago único): ${fmt(result.implementation)} €`,
        ].join("\n");
    } else {
        const addonsLine = activeList.length
            ? activeList.map(a => texts.en[a.labelKey]).join(", ")
            : "Base visualization only";
        const billingLabel = billing === "annual" ? "Annual" : "Monthly";
        const mainUnit = billing === "annual" ? "€/year" : "€/month";
        const altUnit  = billing === "annual" ? "€/month" : "€/year";
        return [
            "ForNet pricing request:",
            `- Sensors: ${tier} sensors`,
            `- Users: ${users}`,
            `- Billing: ${billingLabel}`,
            `- Active modules: ${addonsLine}`,
            `- Nodes / IPs: ${nodes}`,
            `- Total cost: ${fmt(result.mainAmount)} ${mainUnit} (${fmt(result.altAmount)} ${altUnit})`,
            `- Implementation (one-time): ${fmt(result.implementation)} €`,
        ].join("\n");
    }
}

export default function Pricing({ onRequestQuote }: { onRequestQuote: (msg: string) => void }) {
    const { t, lang } = useLang();
    const [tier, setTier] = useState<SensorTier>(50);
    const [users, setUsers] = useState<UserTier>(50);
    const [billing, setBilling] = useState<BillingMode>("annual");
    const [activeAddons, setActiveAddons] = useState<Set<AddonKey>>(new Set());
    const [nodes, setNodes] = useState(1);

    const result = calcPricing(tier, users, billing, activeAddons, nodes);

    function toggleAddon(key: AddonKey) {
        setActiveAddons(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    }

    function handleCTA() {
        const msg = buildPrefillMessage(lang, tier, users, billing, activeAddons, nodes, result);
        onRequestQuote(msg);
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <section id="pricing" className="pricing-section">
            <div className="section-container" style={{ textAlign: "center" }}>
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

                        {/* User tiers */}
                        <div style={{ marginTop: 28 }}>
                            <span className="pricing-section-label">{t.pricing_users_label}</span>
                            <div className="pricing-tiers">
                                {USER_TIERS.map(u => (
                                    <button
                                        key={u}
                                        className={`pricing-tier-card${users === u ? " selected" : ""}`}
                                        onClick={() => setUsers(u)}
                                    >
                                        <span className="tier-sensors">{u}</span>
                                        <span className="tier-price">{USER_RATES[u] === 0 ? t.pricing_users_included : `+${Math.round(USER_RATES[u] * 100)}%`}</span>
                                    </button>
                                ))}
                            </div>
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
                                        <span className="addon-desc">{t[addon.descKey]}</span>
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
                                    aria-label={t.pricing_nodes_decrease}
                                >
                                    −
                                </button>
                                <span className="node-count">{nodes}</span>
                                <button
                                    onClick={() => setNodes(n => Math.min(MAX_NODES, n + 1))}
                                    disabled={nodes >= MAX_NODES}
                                    aria-label={t.pricing_nodes_increase}
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

                            {result.usersAnnual > 0 && (
                                <div className="pricing-summary-row">
                                    <div>
                                        <div>{t.pricing_users_row_label}</div>
                                        <div className="row-label">{users} {t.pricing_users_unit}</div>
                                    </div>
                                    <span className="amount">+{fmt(result.usersAnnual)} €/año</span>
                                </div>
                            )}

                            {ADDONS.filter(a => activeAddons.has(a.key)).map(a => (
                                <div key={a.key} className="pricing-summary-row">
                                    <div>
                                        <div>{t[a.labelKey]}</div>
                                        <div className="row-label">+{Math.round(a.rate * 100)}%</div>
                                    </div>
                                    <span className="amount">+{fmt(addonPrice(result.baseAnnual, a))} €/año</span>
                                </div>
                            ))}

                            {activeAddons.size > 0 && (
                                <div className="pricing-summary-row">
                                    <div>{t.pricing_addons_label}</div>
                                    <span className="amount">+{fmt(result.addonsAnnual)} €/año</span>
                                </div>
                            )}

                            <div style={{ marginTop: 12, borderTop: "2px solid var(--orange)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{ fontSize: "0.82rem", color: "#aaa" }}>{t.pricing_total_label}</span>
                                    <span style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--orange)" }}>
                                        {fmt(result.mainAmount)} {billing === "annual" ? "€/año" : "€/mes"}
                                    </span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <span style={{ fontSize: "0.75rem", color: "#666" }}>
                                        {billing === "annual" ? t.pricing_billing_monthly : t.pricing_billing_annual}
                                    </span>
                                    <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "#888" }}>
                                        {fmt(result.altAmount)} {billing === "annual" ? "€/mes" : "€/año"}
                                    </span>
                                </div>
                            </div>

                            <div className="pricing-summary-row" style={{ marginTop: 16 }}>
                                <div>
                                    <div>{t.pricing_implementation_label}</div>
                                    <div className="row-label">{nodes} {nodes === 1 ? "nodo" : "nodos"} × €{fmt(IMPL_COST_PER_NODE)}</div>
                                </div>
                                <span className="amount">{fmt(result.implementation)} € · {t.pricing_onetime}</span>
                            </div>

                            <p className="pricing-node-hint" style={{ marginTop: 4, textAlign: "left" }}>{t.pricing_impl_note}</p>

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
