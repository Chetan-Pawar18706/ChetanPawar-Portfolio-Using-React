import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "./blog.css";
import { loadPageItems } from "../lib/pageContent";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let active = true;
    const savedVotes = JSON.parse(localStorage.getItem("cp_blog_votes") || "{}");
    const votedByUser = JSON.parse(localStorage.getItem("cp_blog_voted") || "{}");
    const applyVotes = (sourcePosts) => sourcePosts.map((p) => ({
      ...p,
      agree: savedVotes[p.id]?.agree || 0,
      disagree: savedVotes[p.id]?.disagree || 0,
      userVote: votedByUser[p.id] || null,
    }));

    loadPageItems("blog")
      .then((items) => {
        const source = items.map((item) => ({ id: item._id, title: item.title, text: item.text }));
        if (active) setPosts(applyVotes(source));
      })
      .catch(() => active && setPosts([]));

    return () => {
      active = false;
    };
  }, []);

  function vote(id, type) {
    const votedByUser = JSON.parse(localStorage.getItem("cp_blog_voted") || "{}");
    if (votedByUser[id]) return;

    const next = posts.map((p) =>
      p.id === id ? { ...p, [type]: p[type] + 1, userVote: type } : p
    );
    setPosts(next);

    const votes = Object.fromEntries(next.map((p) => [p.id, { agree: p.agree, disagree: p.disagree }]));
    localStorage.setItem("cp_blog_votes", JSON.stringify(votes));
    localStorage.setItem("cp_blog_voted", JSON.stringify({ ...votedByUser, [id]: type }));
  }

  return (
    <motion.section className="blog-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.h2 className="blog-title" initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        My Blog
      </motion.h2>
      <p className="blog-sub">Project learnings, development notes, and reflections.</p>

      <div className="blog-grid">
        {posts.map((p, idx) => (
          <motion.div
            key={p.id}
            className="blog-post"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: idx * 0.15 }}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
          >
            <h3 className="post-title">{p.title}</h3>
            <p className="post-text">{p.text}</p>

            <div className="vote-container">
              <motion.button onClick={() => vote(p.id, "agree")} disabled={!!p.userVote} whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }} className={`vote-btn-circle agree ${p.userVote === "agree" ? "active" : ""}`}>
                <ThumbsUp size={20} />
                <motion.span key={p.agree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                  {p.agree}
                </motion.span>
              </motion.button>

              <motion.button onClick={() => vote(p.id, "disagree")} disabled={!!p.userVote} whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }} className={`vote-btn-circle disagree ${p.userVote === "disagree" ? "active" : ""}`}>
                <ThumbsDown size={20} />
                <motion.span key={p.disagree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                  {p.disagree}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
