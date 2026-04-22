import React from "react";
import {Link, NavLink} from "react-router-dom";
import {
  HelpCircle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ArrowLeft,
  LayoutDashboard,
  Users,
  Grid3x3,
  LogIn,
  DollarSign,
  Star,
  Globe,
  Lock,
  FolderKanban,
  Workflow,
  Sparkles,
} from "lucide-react";

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

const adminMainItems = [
  {label: "Dashboard", icon: LayoutDashboard, path: "/admin-center"},
  {label: "Users", icon: Users, path: "/admin-center/users"},
  {label: "Groups", icon: Grid3x3, path: "/admin-center/groups"},
];

const adminOrgItems = [
  {label: "Login", icon: LogIn},
  {label: "Billing", icon: DollarSign},
  {label: "Branding", icon: Star},
  {label: "Permissions", icon: Globe},
  {label: "Security", icon: Lock},
];

const adminTemplateItems = [
  {label: "Managed events", icon: FolderKanban},
  {label: "Managed workflows", icon: Workflow},
  {label: "Access", icon: Sparkles},
];

const AdminDashboard = () => {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: "grid",
        gridTemplateColumns: "270px 1fr",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <aside
        style={{
          borderRight: "1px solid #d7e1ee",
          background: "#ffffff",
          padding: "1rem 1rem 1.5rem",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div style={{padding: "0.25rem 0.45rem 0.8rem"}}>
          <div
            style={{
              fontSize: "2.6rem",
              lineHeight: 1,
              fontWeight: 800,
              color: "#0f65e8",
              letterSpacing: "-0.04em",
            }}
          >
            Calendly
          </div>
        </div>

        <Link
          to="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            color: "#2563eb",
            textDecoration: "none",
            fontWeight: 700,
            margin: "0.45rem 0 0.95rem 0.25rem",
            fontSize: "0.95rem",
          }}
        >
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div style={{padding: "0 0.35rem", marginBottom: "0.65rem"}}>
          <h2 style={{margin: 0, fontSize: "1.2rem", fontWeight: 600}}>
            Admin center
          </h2>
        </div>

        <nav style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}>
          {adminMainItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({isActive}) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  padding: "0.7rem 0.75rem",
                  borderRadius: "10px",
                  textDecoration: "none",
                  color: isActive ? "#0f65e8" : "#1f3652",
                  fontWeight: 600,
                  background: isActive ? "#ecf4ff" : "transparent",
                })}
              >
                <Icon size={18} /> {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div style={{marginTop: "1.2rem", padding: "0 0.35rem"}}>
          <p
            style={{
              margin: "0 0 0.55rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#446082",
            }}
          >
            Organization
          </p>
          <div
            style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}
          >
            {adminOrgItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    color: "#0e2c4a",
                    fontWeight: 600,
                    fontSize: "1.02rem",
                    cursor: "pointer",
                    padding: "0.66rem 0.45rem",
                    textAlign: "left",
                  }}
                >
                  <Icon size={21} /> {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{marginTop: "1rem", padding: "0 0.35rem"}}>
          <p
            style={{
              margin: "0 0 0.55rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#446082",
            }}
          >
            Templates
          </p>
          <div
            style={{display: "flex", flexDirection: "column", gap: "0.2rem"}}
          >
            {adminTemplateItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    color: "#0e2c4a",
                    fontWeight: 600,
                    fontSize: "1.02rem",
                    cursor: "pointer",
                    padding: "0.66rem 0.45rem",
                    textAlign: "left",
                  }}
                >
                  <Icon size={21} /> {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <section style={{background: "#f8fafc"}}>
        <div
          style={{
            minHeight: "70px",
            borderBottom: "1px solid #d7e1ee",
            background: "#ffffff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 1.6rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.8rem",
              color: "#0e2c4a",
              fontWeight: 700,
            }}
          >
            <Users size={18} />
            <div
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "999px",
                background: "#e9eff8",
                display: "grid",
                placeItems: "center",
                fontSize: "0.78rem",
              }}
            >
              R
            </div>
          </div>
        </div>

        <div style={{padding: "1.55rem 2rem 2rem"}}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.65rem",
              paddingBottom: "1rem",
              borderBottom: "1px solid #d7e1ee",
            }}
          >
            <div style={{display: "flex", alignItems: "center", gap: "0.5rem"}}>
              <h1 style={{fontSize: "2rem", fontWeight: 800, margin: 0}}>
                Dashboard
              </h1>
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
                    <p
                      style={{
                        fontSize: "2rem",
                        fontWeight: 700,
                        marginBottom: "0.35rem",
                      }}
                    >
                      {card.value}
                    </p>
                    <p
                      style={{
                        fontSize: "1.05rem",
                        color: "#334155",
                        marginBottom: "1.25rem",
                      }}
                    >
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
      </section>
    </div>
  );
};

export default AdminDashboard;
