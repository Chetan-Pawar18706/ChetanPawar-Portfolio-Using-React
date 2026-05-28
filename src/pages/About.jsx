import React from "react";
import { motion } from "framer-motion";
import { FaUniversity } from "react-icons/fa";
import { byCategory, loadPageItems } from "../lib/pageContent";

const AboutMe = () => {
  const [remoteItems, setRemoteItems] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    loadPageItems("about").then((items) => active && setRemoteItems(items)).catch(() => active && setRemoteItems([]));
    return () => {
      active = false;
    };
  }, []);

  const section = byCategory(remoteItems, "section")[0];
  const paragraphs = byCategory(remoteItems, "paragraph");
  const educationTitle = byCategory(remoteItems, "education-title")[0];
  const adminEducation = byCategory(remoteItems, "education");

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #0d0d0d, #000)",
        color: "white",
        padding: "3rem 1rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        style={{
          width: "100%",
          maxWidth: "1100px",
          textAlign: "left",
          marginTop: "1rem",
          lineHeight: 1.8,
          background: "rgba(255,255,255,0.04)",
          padding: "3rem 3.5rem",
          borderRadius: "18px",
          boxShadow: "0 0 25px rgba(0,255,200,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            fontSize: "1.9rem",
            marginBottom: "1.2rem",
            background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          {section?.title || "About"}
        </h2>

        {paragraphs.length > 0 ? (
          paragraphs.map((item, index) => (
            <p key={`${item._id || item.title}-${index}`} style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", marginBottom: "1rem" }}>
              {item.text || item.title}
            </p>
          ))
        ) : (
          <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)" }}>
            About content is not available in the database.
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{ marginTop: "3rem" }}
        >
          <h3
            style={{
              fontSize: "1.6rem",
              marginBottom: "1.5rem",
              background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            {educationTitle?.title || "Education"}
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {adminEducation.length > 0 ? (
              adminEducation.map((item) => (
                <motion.div
                  key={item._id}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,255,200,0.15)" }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "14px",
                    padding: "1.5rem 2rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 0 15px rgba(0,255,200,0.05)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <FaUniversity size={40} color="var(--accent)" />
                  <div>
                    <h4 style={{ color: "var(--accent)", marginBottom: "0.4rem", fontSize: "1.25rem" }}>{item.title}</h4>
                    {item.text && <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "0.2rem" }}>{item.text}</p>}
                    {item.items.map((line) => (
                      <p key={line} style={{ color: "rgba(255,255,255,0.7)" }}>{line}</p>
                    ))}
                  </div>
                </motion.div>
              ))
            ) : (
              <p style={{ color: "rgba(255,255,255,0.7)" }}>Education content is not available in the database.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutMe;
