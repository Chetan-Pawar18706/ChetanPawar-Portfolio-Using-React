import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "../CSS/Gallery.css";
import { byCategory, loadPageItems } from "../lib/pageContent";
import { apiFetch } from "../lib/api";
import { buildAssetUrl } from "../config/api";

const pageVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.2, duration: 0.8, ease: "easeOut" },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit: { opacity: 0, y: -30, scale: 0.98, transition: { duration: 0.4 } },
};

export default function Gallery() {
  const [tab, setTab] = useState("personal");
  const [zoom, setZoom] = useState({ img: null, post: null, index: 0 });
  const [remoteImages, setRemoteImages] = useState(null);
  const [pageItems, setPageItems] = useState([]);
  const [projects, setProjects] = useState([]);

  React.useEffect(() => {
    let active = true;
    Promise.all([loadPageItems("gallery"), apiFetch("/projects")])
      .then(([items, projectItems]) => {
        if (!active) return;
        setPageItems(items);
        setProjects(Array.isArray(projectItems) ? projectItems : []);
        if (items.length === 0) return;
        setRemoteImages(
          items.reduce(
            (groups, item) => {
              const category = groups[item.category] ? item.category : "personal";
              groups[category].push({
                id: item._id,
                caption: item.text || item.title,
                photos: item.items.length ? item.items.map(buildAssetUrl) : [buildAssetUrl(item.image)].filter(Boolean),
              });
              return groups;
            },
            { personal: [], projects: [], achievements: [] }
          )
        );
      })
      .catch(() => {
        if (!active) return;
        setRemoteImages(null);
        setProjects([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const projectGalleryItems = projects.map((project) => ({
    id: project._id,
    caption: project.desc || project.title,
    photos: [buildAssetUrl(project.image)].filter(Boolean),
  }));
  const images = {
    ...(remoteImages || { personal: [], projects: [], achievements: [] }),
    projects: projectGalleryItems,
  };
  const section = byCategory(pageItems, "section")[0];

  const openZoom = (post, index) => setZoom({ img: post.photos[index], post, index });
  const closeZoom = () => setZoom({ img: null, post: null, index: 0 });

  const nextImage = () => {
    if (!zoom.post) return;
    const nextIndex = (zoom.index + 1) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[nextIndex], index: nextIndex });
  };

  const prevImage = () => {
    if (!zoom.post) return;
    const prevIndex = (zoom.index - 1 + zoom.post.photos.length) % zoom.post.photos.length;
    setZoom({ ...zoom, img: zoom.post.photos[prevIndex], index: prevIndex });
  };

  return (
    <motion.section className="gallery-container" variants={pageVariants} initial="hidden" animate="visible" exit="hidden">
      <motion.h2 className="gallery-title page-heading" style={{ color: "#00b4ff", marginBottom: 12 }} variants={childVariants}>{section?.title || "Gallery"}</motion.h2>

      <motion.div className="tab-buttons" variants={childVariants}>
        {["personal", "projects", "achievements"].map((type) => (
          <motion.button
            key={type}
            className={`tab ${tab === type ? "active" : ""}`}
            onClick={() => setTab(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} className="post-feed" variants={tabContentVariants} initial="hidden" animate="visible" exit="exit">
          {(images[tab] || []).map((post) => (
            <motion.div key={post.id} className="post-card" variants={childVariants} whileHover={{ y: -4 }}>
              <p className="caption">{post.caption}</p>
              <div className={`photo-grid ${post.photos.length > 1 ? "multi" : "single"}`}>
                {post.photos.map((src, i) => (
                  <motion.div key={i} className="photo-item" whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 250 }} onClick={() => openZoom(post, i)}>
                    <img src={buildAssetUrl(src)} alt="gallery" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
          {(images[tab] || []).length === 0 && (
            <p style={{ color: "#bbb" }}>No gallery items available from the database.</p>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {zoom.img && (
          <motion.div
            className="zoom-overlay"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(6px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
          >
            <motion.img
              key={zoom.img}
              src={buildAssetUrl(zoom.img)}
              alt="zoom"
              className="zoom-img"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {zoom.post?.photos.length > 1 && (
              <>
                <button className="nav-btn left" onClick={prevImage}><ChevronLeft size={32} /></button>
                <button className="nav-btn right" onClick={nextImage}><ChevronRight size={32} /></button>
              </>
            )}
            <button className="close-btn" onClick={closeZoom}><X size={28} /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
