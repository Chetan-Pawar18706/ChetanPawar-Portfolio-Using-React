import React from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { apiFetch } from '../lib/api'

import royalPalace from '../../assets/chetan_royal_palace.png'
import classThrong from '../../assets/chetan_class_throng.png'
import masalaMastery from '../../assets/chetan_masala_mastery.png'
import musicStreamer from '../../assets/chetan_music_stremer.png'
import coachingSystem from '../../assets/chetan_coaching_management_system.png'
import serviceBooking from '../../assets/chetan_service_booking_system.png'
import jobPortal from '../../assets/chetan_job_portal.png'
import hospitalSystem from '../../assets/chetan_hospital_management_system.png'
import eduHub from '../../assets/chetan_eduhub_online_exam.png'

const PROJECTS = [
  {
    title: 'Royal Palace Management System',
    desc: 'Java Swing desktop application managing hotel operations including room booking, guest management, billing, and staff coordination with user-friendly interface.',
    ss: royalPalace,
    tech: ['Java', 'PHP', 'UI Design'],
    live: '#',
    code: '#'
  },
  {
    title: 'Class Throng',
    desc: 'The Class Throng PHP project uses PHP, MySQL, and OOP to manage user registration, authentication, session management, profile updates, and dynamic content.',
    ss: classThrong,
    tech: ['PHP', 'MySQL', 'HTML/CSS'],
    live: '#',
    code: '#'
  },
  {
    title: 'Masala Mastery',
    desc: 'A masala website in PHP offers vibrant product displays, user accounts, shopping cart, recipes, blogs, and admin controls with responsive design.',
    ss: masalaMastery,
    tech: ['PHP', 'MySQL', 'HTML/CSS'],
    live: '#',
    code: '#'
  },
  {
    title: 'Music Streamer',
    desc: 'Web-based music streaming platform where users can upload, manage, and listen to music tracks with playlist creation and admin dashboard.',
    ss: musicStreamer,
    tech: ['PHP', 'MySQL', 'JavaScript'],
    live: '#',
    code: '#'
  },
  {
    title: 'Coaching Management System',
    desc: 'Coaching Management System helps institutes manage students, batches, fees, attendance, and records in one centralized platform.',
    ss: coachingSystem,
    tech: ['PHP', 'MySQL', 'Admin Dashboard'],
    live: '#',
    code: '#'
  },
  {
    title: 'Service Booking System',
    desc: 'Service Booking System allows users to register, browse, and book services like drivers, AC technicians, painters, and mechanics.',
    ss: serviceBooking,
    tech: ['PHP', 'MySQL', 'Booking App'],
    live: '#',
    code: '#'
  },
  {
    title: 'Job Portal',
    desc: 'Job Portal web application built using PHP and MySQL with job posting, search, resume uploads, and application tracking.',
    ss: jobPortal,
    tech: ['PHP', 'MySQL', 'Web App'],
    live: '#',
    code: '#'
  },
  {
    title: 'Hospital Management System',
    desc: 'Hospital Management System for patient registration, appointments, doctor management, and billing with role-based access.',
    ss: hospitalSystem,
    tech: ['PHP', 'MySQL', 'Healthcare App'],
    live: '#',
    code: '#'
  },
  {
    title: 'EduHub Online Examination',
    desc: 'EduHub Online Exam System is a secure web application for MCQ-based online exams with admin control and instant result evaluation.',
    ss: eduHub,
    tech: ['PHP', 'JavaScript', 'MySQL'],
    live: 'https://online-exam.is-best.net',
    code: '#'
  }
]

export default function Projects() {
  const [remoteProjects, setRemoteProjects] = React.useState([])

  React.useEffect(() => {
    let active = true

    apiFetch('/projects')
      .then((data) => {
        if (active && Array.isArray(data) && data.length > 0) {
          setRemoteProjects(data)
        }
      })
      .catch(() => {
        if (active) setRemoteProjects([])
      })

    return () => {
      active = false
    }
  }, [])

  const projects = remoteProjects.length > 0 ? remoteProjects : PROJECTS

  return (
    <motion.section
      className="container"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      id="projects"
    >
      <div className="card" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 30 }}>
        <motion.h2
          className="text-4xl font-semibold text-cyan-400 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Projects
        </motion.h2>
        <p className="text-gray-400 mb-10">
          Practical web and software projects built with Java, PHP, MySQL, JavaScript, and responsive UI design.
        </p>

        <div className="projects-grid" style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {projects.map((p, idx) => (
            <motion.div
              key={idx}
              className="project-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              style={{
                background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.9))',
                border: '1px solid rgba(0,255,255,0.1)',
                borderRadius: 16,
                padding: 16,
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0,255,255,0.08)'
              }}
            >
              <motion.div className="ss" whileHover={{ scale: 1.05 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
                <img
                  src={p.image || p.ss}
                  alt={p.title}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: 12
                  }}
                />
              </motion.div>

              <div style={{ marginTop: 12 }}>
                <h3 style={{ fontSize: 18, color: '#0ea5e9', marginBottom: 6 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#bbb', marginBottom: 8, lineHeight: 1.6 }}>{p.desc}</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: 'rgba(0,255,255,0.05)',
                        border: '1px solid rgba(0,255,255,0.1)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#aaf'
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <motion.a
                    href={p.code}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    whileHover={{ scale: 1.08 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'rgba(255,255,255,0.05)',
                      color: '#0ea5e9',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      border: '1px solid rgba(0,255,255,0.1)',
                      textDecoration: 'none'
                    }}
                  >
                    <Github size={14} /> Code
                  </motion.a>
                  <motion.a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="btn"
                    whileHover={{ scale: 1.08 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'linear-gradient(90deg, #06b6d4, #0891b2)',
                      color: '#fff',
                      padding: '6px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> Live
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
