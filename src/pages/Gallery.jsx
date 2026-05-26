import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import "../CSS/Gallery.css";

import profile from "../../assets/chetan.jpg";
import royalPalace from "../../assets/chetan_royal_palace.png";
import classThrong from "../../assets/chetan_class_throng.png";
import masalaMastery from "../../assets/chetan_masala_mastery.png";
import musicStreamer from "../../assets/chetan_music_stremer.png";
import coachingSystem from "../../assets/chetan_coaching_management_system.png";
import serviceBooking from "../../assets/chetan_service_booking_system.png";
import jobPortal from "../../assets/chetan_job_portal.png";
import hospitalSystem from "../../assets/chetan_hospital_management_system.png";
import eduHub from "../../assets/chetan_eduhub_online_exam.png";
import { loadPageItems } from "../lib/pageContent";

const IMAGES = {
  personal: [
    {
      id: 1,
      caption: "Chetan Sitaram Pawar - BCA student and aspiring Software Developer Intern.",
      photos: [profile],
    },
  ],
  projects: [
    {
      id: 1,
      caption: "Royal Palace Management System - hotel operations, room booking, guest management, billing, and staff coordination.",
      photos: [royalPalace],
    },
    {
      id: 2,
      caption: "Class Throng - PHP and MySQL project for registration, authentication, sessions, profiles, and dynamic content.",
      photos: [classThrong],
    },
    {
      id: 3,
      caption: "Masala Mastery - PHP masala website with products, accounts, cart, recipes, blogs, and admin controls.",
      photos: [masalaMastery],
    },
    {
      id: 4,
      caption: "Music Streamer - upload, manage, and listen to music tracks with playlists and admin dashboard.",
      photos: [musicStreamer],
    },
    {
      id: 5,
      caption: "Coaching Management System - students, batches, fees, attendance, and centralized institute records.",
      photos: [coachingSystem],
    },
    {
      id: 6,
      caption: "Service Booking System - users can register, browse, and book practical services.",
      photos: [serviceBooking],
    },
    {
      id: 7,
      caption: "Job Portal - PHP and MySQL app with job posting, search, resume uploads, and application tracking.",
      photos: [jobPortal],
    },
    {
      id: 8,
      caption: "Hospital Management System - patient registration, appointments, doctor management, billing, and role-based access.",
      photos: [hospitalSystem],
    },
    {
      id: 9,
      caption: "EduHub Online Examination - secure MCQ online exams with admin control and instant result evaluation.",
      photos: [eduHub],
    },
  ],
  achievements: [
    {
      id: 1,
      caption: "Royal Palace Management System - complete hotel management workflow with rooms, bookings, billing, and staff coordination.",
      photos: [royalPalace],
    },
    {
      id: 2,
      caption: "Class Throng - dynamic PHP and MySQL platform with registration, sessions, profiles, and content management.",
      photos: [classThrong],
    },
    {
      id: 3,
      caption: "EduHub Online Examination - secure MCQ exam system with admin controls and instant result evaluation.",
      photos: [eduHub],
    },
    {
      id: 4,
      caption: "Service Booking System - practical service browsing and booking flow with user registration.",
      photos: [serviceBooking],
    },
  ],
};

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

  React.useEffect(() => {
    let active = true;
    loadPageItems("gallery")
      .then((items) => {
        if (!active || items.length === 0) return;
        setRemoteImages(
          items.reduce(
            (groups, item) => {
              const category = groups[item.category] ? item.category : "personal";
              groups[category].push({
                id: item._id,
                caption: item.text || item.title,
                photos: item.items.length ? item.items : [item.image].filter(Boolean),
              });
              return groups;
            },
            { personal: [], projects: [], achievements: [] }
          )
        );
      })
      .catch(() => active && setRemoteImages(null));

    return () => {
      active = false;
    };
  }, []);

  const images = remoteImages || IMAGES;

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
      <motion.h2 className="gallery-title" variants={childVariants}>Gallery</motion.h2>

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
                    <img src={src} alt="gallery" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
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
              src={zoom.img}
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
