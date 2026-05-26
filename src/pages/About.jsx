import React from "react";
import { motion } from "framer-motion";
import { FaUniversity, FaLaptopCode, FaGraduationCap } from "react-icons/fa";
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
  const paragraphs = byCategory(remoteItems, "paragraph");
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
          About Me
        </h2>

        <p
          style={{
            fontSize: "1.1rem",
            color: "rgba(255,255,255,0.85)",
            marginBottom: "1rem",
          }}
        >
          Hi, I’m <strong>Chetan Sitaram Pawar</strong>, a detail-oriented BCA student with a strong foundation in Data Structures, DBMS, Computer Networks, and Operating Systems.
        </p>

        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)" }}>
          I build responsive frontend interfaces with <strong>React.js, JavaScript, HTML, and CSS</strong>, and I also work with backend technologies including <strong>PHP and MySQL</strong>. I enjoy creating CRUD-based web applications with clean navigation, secure role-based access, and practical user workflows.
        </p>

        <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)" }}>
          I am eager to start my career as a <strong>Software Developer Intern</strong> and contribute to real-world projects while continuing to improve in web and app development.
        </p>

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
            Education & Learning
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {adminEducation.map((item) => (
              <motion.div key={item._id} whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(0,255,200,0.15)" }} transition={{ duration: 0.3 }} style={{ background: "rgba(255,255,255,0.05)", borderRadius: "14px", padding: "1.5rem 2rem", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 0 15px rgba(0,255,200,0.05)", display: "flex", alignItems: "center", gap: "1.2rem" }}>
                <FaUniversity size={40} color="var(--accent)" />
                <div>
                  <h4 style={{ color: "var(--accent)", marginBottom: "0.4rem", fontSize: "1.25rem" }}>{item.title}</h4>
                  <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "0.2rem" }}>{item.text}</p>
                  {item.items.map((line) => <p key={line} style={{ color: "rgba(255,255,255,0.7)" }}>{line}</p>)}
                </div>
              </motion.div>
            ))}
            <motion.div
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
                <h4 style={{ color: "var(--accent)", marginBottom: "0.4rem", fontSize: "1.25rem" }}>
                  Bachelor of Computer Applications (BCA)
                </h4>
                <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "0.2rem" }}>
                  <strong>Naran Lala College of Professional & Applied Sciences</strong> — Navsari
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  Veer Narmad South Gujarat University, Surat, Gujarat
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  July 2023 - May 2026 | CGPA: 7.76 | Percentage: 77.60%
                </p>
              </div>
            </motion.div>

            <motion.div
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
              <FaLaptopCode size={38} color="var(--accent)" />
              <div>
                <h4 style={{ color: "var(--accent)", marginBottom: "0.4rem", fontSize: "1.25rem" }}>
                  Frontend Developer Intern
                </h4>
                <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "0.2rem" }}>
                  <strong>Techfusion Technologies</strong> — Navsari
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  Oct 2025 - Dec 2025 | React.js, JavaScript, HTML5, CSS3, React Router DOM
                </p>
              </div>
            </motion.div>

            <motion.div
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
              <FaGraduationCap size={36} color="var(--accent)" />
              <div>
                <h4 style={{ color: "var(--accent)", marginBottom: "0.4rem", fontSize: "1.25rem" }}>
                  Independent Learning - App Development
                </h4>
                <p style={{ color: "rgba(255,255,255,0.85)", marginBottom: "0.2rem" }}>
                  <strong>Online Platforms</strong>
                </p>
                <p style={{ color: "rgba(255,255,255,0.7)" }}>
                  2026 - Present | Dart, Flutter, mini-projects, debugging, and problem-solving
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AboutMe;

