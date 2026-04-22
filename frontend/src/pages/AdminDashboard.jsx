import React from "react";
import {HelpCircle, ArrowRight, TrendingDown, TrendingUp} from "lucide-react";

const metricCards = [
  {
    id: "created",
    title: "Created events",
    value: 0,
    trend: "down",
    percent: "100%",
  },
  {
    id: "completed",
    title: "Completed events",
    value: 0,
    trend: "down",
    percent: "100%",
  },
  {
    id: "canceled",
    title: "Canceled events",
    value: 0,
    trend: "up",
    percent: "0%",
  },
];

const trendIcon = {
  down: TrendingDown,
  up: TrendingUp,
};

const AdminDashboard = () => {
  return (
    <div className="dashboard-root animate-fade-in" style={{paddingTop: "1.6rem"}}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.65rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
          <h1 style={{fontSize: "2rem", fontWeight: 800, margin: 0}}>Dashboard</h1>
          <HelpCircle size={18} color="#64748b" />
        </div>

        <button
          type="button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.45rem",
            border: "none",
            background: "none",
            color: "#2563eb",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          View Analytics <ArrowRight size={16} />
        </button>
      </div>

      <section>
        <h2
          style={{
            margin: "0 0 1rem",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#475569",
          }}
        >
          Activity last week
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {metricCards.map((card) => {
            const TrendIcon = trendIcon[card.trend];
            const trendColor = card.trend === "up" ? "#64748b" : "#475569";

            return (
              <article
                key={card.id}
                className="card"
                style={{
                  borderRadius: "12px",
                  padding: "1.25rem 1.35rem",
                  boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
                }}
              >
                <p style={{fontSize: "2rem", fontWeight: 700, marginBottom: "0.35rem"}}>
                  {card.value}
                </p>
                <p style={{fontSize: "1.05rem", color: "#334155", marginBottom: "1.25rem"}}>
                  {card.title}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    color: trendColor,
                    fontWeight: 600,
                    fontSize: "1.05rem",
                  }}
                >
                  <TrendIcon size={16} />
                  <span>{card.percent}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
