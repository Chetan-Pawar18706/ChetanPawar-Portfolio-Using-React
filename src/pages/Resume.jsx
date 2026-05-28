import React from "react";
import { motion } from "framer-motion";
import { byCategory, loadPageItems } from "../lib/pageContent";

export default function Resume() {
  const [remoteItems, setRemoteItems] = React.useState([]);

  React.useEffect(() => {
    let active = true;
    loadPageItems("resume").then((items) => active && setRemoteItems(items)).catch(() => active && setRemoteItems([]));
    return () => {
      active = false;
    };
  }, []);

  const profile = byCategory(remoteItems, "profile")[0];
  const section = byCategory(remoteItems, "section")[0];
  const summary = byCategory(remoteItems, "summary")[0];
  const remoteProjects = byCategory(remoteItems, "project").map((item) => item.title || item.text).filter(Boolean);
  const remoteSkills = byCategory(remoteItems, "skill").flatMap((item) => (item.items?.length ? item.items : [item.title || item.text])).filter(Boolean);
  const education = byCategory(remoteItems, "education");
  const experience = byCategory(remoteItems, "experience");
  const links = byCategory(remoteItems, "link");
  const pdf = byCategory(remoteItems, "pdf")[0]?.url;
  const hasRemoteProjects = remoteProjects.length > 0;
  const hasRemoteSkills = remoteSkills.length > 0;
  const hasRemoteEducation = education.length > 0;
  const hasRemoteExperience = experience.length > 0;
  const displayName = profile?.title || "Resume";
  const displayHeadline = profile?.text || "";
  const resumeLinks = links
    .map((item) => ({ name: item.title, link: item.url }))
    .filter((item) => item.name && item.link);

  return (
    <section className="container" style={{ padding: "60px 0" }}>
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "#0b0b0b",
          borderRadius: 16,
          padding: "40px 30px",
          color: "#e5e5e5",
          boxShadow: "0 0 25px rgba(0, 153, 255, 0.1)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ fontSize: 28, color: "#00b4ff", marginBottom: 12 }}
        >
          {section?.title || "Resume"}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: "#aaa", marginBottom: 25 }}
        >
          {section?.text || "Resume content is loaded from the database."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 20,
            background: "rgba(255,255,255,0.03)",
            padding: "24px 20px",
            borderRadius: 12,
          }}
        >
          <div>
            <h3 style={{ fontSize: 24, color: "#00b4ff", marginBottom: 4 }}>
              {displayName}
            </h3>
            <p style={{ marginTop: 10, fontSize: 15, color: "#ccc" }}>
              {displayHeadline || "Profile summary is loading from the database..."}
            </p>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              background: "linear-gradient(135deg, #00b4ff44, #0b0b0b)",
              borderRadius: 12,
              padding: "14px 20px",
              border: "1px solid rgba(255,255,255,0.1)",
              maxWidth: 560,
              fontSize: 14,
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "#00b4ff" }}>Professional Summary:</strong>
            <p style={{ marginTop: 6, color: "#ccc" }}>
              {summary?.text || "Professional summary is not available in the database."}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>
            Education
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            {hasRemoteEducation ? (
              education.map((item) => (
                <li key={item._id || item.title} style={{ marginBottom: 12 }}>
                  <strong>{item.title}</strong>
                  {item.text && (
                    <>
                      <br />
                      <span style={{ color: "#aaa" }}>{item.text}</span>
                    </>
                  )}
                  {item.items?.length > 0 && (
                    <>
                      <br />
                      <span style={{ color: "#aaa" }}>{item.items.join(" | ")}</span>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li style={{ color: "#bbb" }}>Education details are not available in the database.</li>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            marginTop: 40,
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            padding: "20px 24px",
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>
            Experience
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            {hasRemoteExperience ? (
              experience.map((item) => (
                <li key={item._id || item.title} style={{ marginBottom: 12 }}>
                  <strong>{item.title}</strong>
                  {item.text && (
                    <>
                      <br />
                      <span style={{ color: "#aaa" }}>{item.text}</span>
                    </>
                  )}
                  {item.items?.length > 0 && (
                    <>
                      <br />
                      <span style={{ color: "#aaa" }}>{item.items.join(" | ")}</span>
                    </>
                  )}
                </li>
              ))
            ) : (
              <li style={{ color: "#bbb" }}>Experience details are not available in the database.</li>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{ marginTop: 40 }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>Projects</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: 1.8 }}>
            {hasRemoteProjects ? (
              remoteProjects.map((project, index) => (
                <li key={project}>{index + 1}. {project}</li>
              ))
            ) : (
              <li style={{ color: "#bbb" }}>No projects available from the database.</li>
            )}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{ marginTop: 40 }}
        >
          <h4 style={{ fontSize: 20, color: "#00b4ff", marginBottom: 12 }}>Skills</h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {hasRemoteSkills ? remoteSkills.map((skill) => (
              <motion.span
                key={skill}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,180,255,0.3)" }}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#ccc",
                }}
              >
                {skill}
              </motion.span>
            )) : (
              <motion.span
                style={{
                  background: "rgba(255,255,255,0.05)",
                  padding: "6px 12px",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#bbb",
                }}
              >
                No skills available from the database.
              </motion.span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          style={{ display: "flex", justifyContent: "center", gap: 30, marginTop: 40, flexWrap: "wrap" }}
        >
          {resumeLinks.length > 0 ? (
            resumeLinks.map((site) => (
              <motion.a
                key={site.name}
                href={site.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.1, color: "#00b4ff" }}
                style={{ color: "#ccc", textDecoration: "none", fontSize: 15, fontWeight: 500 }}
              >
                {site.name}
              </motion.a>
            ))
          ) : (
            <span style={{ color: "#bbb", fontSize: 14 }}>No resume links available from the database.</span>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{
            marginTop: 50,
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {pdf ? (
            <iframe
              src={pdf}
              title={`${displayName} Resume`}
              style={{
                width: "100%",
                height: "650px",
                border: "none",
                background: "#111",
              }}
            />
          ) : (
            <div style={{ padding: 40, color: "#bbb", background: "#0a0a0a", textAlign: "center" }}>
              Resume PDF is not available from the database.
            </div>
          )}
        </motion.div>

        {pdf && (
          <motion.a
            href={pdf}
            download
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "inline-block",
              marginTop: 20,
              background: "#00b4ff",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 500,
              letterSpacing: 0.3,
            }}
          >
            Download Resume
          </motion.a>
        )}
      </motion.div>
    </section>
  );
}


