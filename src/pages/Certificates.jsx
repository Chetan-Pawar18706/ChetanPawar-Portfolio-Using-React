import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { byCategory, loadPageItems } from "../lib/pageContent";
import { buildAssetUrl, buildPublicUrl } from "../config/api";

export default function Certificates() {
  const [tab, setTab] = useState("tech");
  const [remoteCerts, setRemoteCerts] = useState(null);
  const [pageItems, setPageItems] = useState([]);

  React.useEffect(() => {
    let active = true;
    loadPageItems("certificates")
      .then((items) => {
        if (!active) return;
        setPageItems(items);
        if (items.length === 0) return;
        setRemoteCerts(
          items.reduce(
            (groups, item) => {
              const category = groups[item.category] ? item.category : "tech";
              groups[category].push(item);
              return groups;
            },
            { tech: [], other: [] }
          )
        );
      })
      .catch(() => active && setRemoteCerts(null));
    return () => {
      active = false;
    };
  }, []);

  const certs = remoteCerts || { tech: [], other: [] };
  const section = byCategory(pageItems, "section")[0];

  return (
    <section className="container" style={{ padding: "40px 0" }}>
      <div className="card" style={{ background: "#111", borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: "1.8rem", color: "#fff", marginBottom: 4 }}>{section?.title || "Certificates"}</h2>
        <p className="lead" style={{ color: "#aaa" }}>
          {section?.text || "Certificate content is loaded from the database."}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          {["tech", "other"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "tab active" : "tab"}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: tab === t ? "#007bff" : "#333",
                color: "#fff",
                fontWeight: 500,
                transition: "0.3s",
              }}
            >
              {t === "tech" ? "Tech" : "Others"}
            </button>
          ))}
        </div>

        <div
          className="certs-grid"
          style={{
            marginTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          <AnimatePresence mode="wait">
            {certs[tab].length === 0 && (
              <motion.div
                key="empty"
                className="cert card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ background: "#1a1a1a", borderRadius: 12, padding: 16, color: "#fff" }}
              >
                <strong style={{ fontSize: 16 }}>No certificate available from the database.</strong>
                <div className="muted" style={{ fontSize: 13, color: "#bbb", marginTop: 8 }}>
                  Add certificates from the admin panel to show them here.
                </div>
              </motion.div>
            )}
            {certs[tab].map((cert) => (
              <motion.a
                key={cert._id || cert.title}
                href={buildPublicUrl(cert.url || cert.image || "#")}
                target="_blank"
                rel="noreferrer"
                className="cert card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ background: "#1a1a1a", borderRadius: 12, padding: 16, color: "#fff", textDecoration: "none" }}
              >
                {cert.image && <img src={buildAssetUrl(cert.image)} alt={cert.title} style={{ width: "100%", height: 170, objectFit: "cover", borderRadius: 8, marginBottom: 12 }} />}
                <strong style={{ fontSize: 16 }}>{cert.title}</strong>
                {cert.text && <div className="muted" style={{ fontSize: 13, color: "#bbb", marginTop: 8 }}>{cert.text}</div>}
              </motion.a>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
