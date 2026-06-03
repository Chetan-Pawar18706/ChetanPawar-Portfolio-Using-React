import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import "./blog.css";
import { byCategory, loadPageItems } from "../lib/pageContent";
import { apiFetch } from "../lib/api";

export default function Blog() {
  const [pageItems, setPageItems] = useState([]);
  const [votedByUser, setVotedByUser] = useState({});
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    let active = true;
    const savedVotes = JSON.parse(localStorage.getItem("cp_blog_voted") || "{}");
    if (active) {
      setVotedByUser(savedVotes);
    }

    loadPageItems("blog")
      .then((items) => {
        if (!active) return;
        setPageItems(
          items.map((item) => ({
            ...item,
            agree: Number.isFinite(Number(item.agree)) ? Number(item.agree) : 0,
            disagree: Number.isFinite(Number(item.disagree)) ? Number(item.disagree) : 0,
          }))
        );
      })
      .catch(() => {
        if (!active) return;
        setPageItems([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const section = byCategory(pageItems, "section")[0];
  const posts = byCategory(pageItems, "post");
  const articles = byCategory(pageItems, "article");

  function textToHtml(text) {
    if (!text) return "";

    let html = text
      .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer noopener">$1</a>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noreferrer noopener">$1</a>');

    return html.replace(/\n/g, "<br />");
  }

  async function vote(id, type) {
    const voted = JSON.parse(localStorage.getItem("cp_blog_voted") || "{}");
    if (voted[id]) return;

    try {
      const data = await apiFetch(`/pages/blog/${id}/vote`, {
        method: "POST",
        body: JSON.stringify({ type }),
      });

      setPageItems((current) =>
        current.map((item) =>
          item._id === id ? { ...item, agree: data.agree, disagree: data.disagree } : item
        )
      );

      const nextVoted = { ...voted, [id]: type };
      localStorage.setItem("cp_blog_voted", JSON.stringify(nextVoted));
      setVotedByUser(nextVoted);
    } catch (error) {
      console.error("Vote failed", error);
    }
  }

  return (
    <motion.section className="blog-section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <motion.h2 className="blog-title page-heading" style={{ color: "#00b4ff", marginBottom: 12 }} initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
        {section?.title || "Blog"}
      </motion.h2>
      {section?.text && <p className="blog-sub page-subtitle">{section.text}</p>}

      <div className="blog-tabs">
        <button type="button" className={`blog-tab ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>Posts ({posts.length})</button>
        <button type="button" className={`blog-tab ${activeTab === "articles" ? "active" : ""}`} onClick={() => setActiveTab("articles")}>Articles ({articles.length})</button>
      </div>

      {activeTab === "articles" && (
        <div className="blog-section-block">
          <h3 className="section-heading">Articles</h3>
          <div className="blog-grid">
            {articles.length > 0 ? articles.map((article, idx) => (
              <motion.div
                key={article._id}
                className="blog-post"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.12 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
              >
                <h3 className="post-title">{article.title}</h3>
                <p className="post-text" dangerouslySetInnerHTML={{ __html: textToHtml(article.text) }} />
                {article.url && (
                  <p className="post-link-wrap">
                    <a className="post-link" href={article.url} target="_blank" rel="noreferrer noopener">
                      Read full article
                    </a>
                  </p>
                )}
                <div className="vote-container">
                  <motion.button
                    type="button"
                    onClick={() => vote(article._id, "agree")}
                    disabled={!!votedByUser[article._id]}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.15 }}
                    className={`vote-btn-circle agree ${votedByUser[article._id] === "agree" ? "active" : ""}`}
                  >
                    <ThumbsUp size={20} />
                    <motion.span key={article.agree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                      {article.agree || 0}
                    </motion.span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => vote(article._id, "disagree")}
                    disabled={!!votedByUser[article._id]}
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.15 }}
                    className={`vote-btn-circle disagree ${votedByUser[article._id] === "disagree" ? "active" : ""}`}
                  >
                    <ThumbsDown size={20} />
                    <motion.span key={article.disagree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                      {article.disagree || 0}
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            )) : (
              <p style={{ color: "#bbb" }}>No articles available yet.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "posts" && (
        <div className="blog-section-block">
          <h3 className="section-heading">Posts</h3>
          <div className="blog-grid">
            {posts.length > 0 ? posts.map((p, idx) => (
              <motion.div
                key={p._id}
                className="blog-post"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,255,255,0.1)" }}
              >
                <h3 className="post-title">{p.title}</h3>
                <p className="post-text" dangerouslySetInnerHTML={{ __html: textToHtml(p.text) }} />
                {p.url && (
                  <p className="post-link-wrap">
                    <a className="post-link" href={p.url} target="_blank" rel="noreferrer noopener">
                      Read more
                    </a>
                  </p>
                )}

                <div className="vote-container">
                  <motion.button type="button" onClick={() => vote(p._id, "agree")} disabled={!!votedByUser[p._id]} whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }} className={`vote-btn-circle agree ${votedByUser[p._id] === "agree" ? "active" : ""}`}>
                    <ThumbsUp size={20} />
                    <motion.span key={p.agree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                      {p.agree || 0}
                    </motion.span>
                  </motion.button>

                  <motion.button type="button" onClick={() => vote(p._id, "disagree")} disabled={!!votedByUser[p._id]} whileTap={{ scale: 0.85 }} whileHover={{ scale: 1.15 }} className={`vote-btn-circle disagree ${votedByUser[p._id] === "disagree" ? "active" : ""}`}>
                    <ThumbsDown size={20} />
                    <motion.span key={p.disagree} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="vote-count">
                      {p.disagree || 0}
                    </motion.span>
                  </motion.button>
                </div>
              </motion.div>
            )) : (
              <p style={{ color: "#bbb" }}>No posts available yet.</p>
            )}
          </div>
        </div>
      )}
    </motion.section>
  );
}
