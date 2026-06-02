import React from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink } from 'lucide-react'
import { apiFetch } from '../lib/api'
import { buildAssetUrl } from '../config/api'


export default function Projects() {
  const [remoteProjects, setRemoteProjects] = React.useState([])
  const [expandedDescriptions, setExpandedDescriptions] = React.useState({})

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

  const projects = remoteProjects

  function ProjectDescription({ text, expanded, onToggle }) {
    const ref = React.useRef(null)
    const [overflow, setOverflow] = React.useState(false)

    React.useEffect(() => {
      const el = ref.current
      if (!el) return

      const checkOverflow = () => {
        setOverflow(el.scrollHeight > el.clientHeight + 1)
      }

      const raf = requestAnimationFrame(checkOverflow)
      const observer = new ResizeObserver(checkOverflow)
      observer.observe(el)

      return () => {
        cancelAnimationFrame(raf)
        observer.disconnect()
      }
    }, [text, expanded])

    return (
      <div style={{ minHeight: '6.4em', marginTop: 8 }}>
        <p
          ref={ref}
          style={{
            fontSize: 14,
            color: '#bbb',
            margin: 0,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: expanded ? undefined : '6.4em'
          }}
        >
          {text}
        </p>
        {(expanded || overflow) && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3dd6ff',
              cursor: 'pointer',
              padding: 0,
              fontSize: 13,
              marginTop: 8
            }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
    )
  }

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
          className="page-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ color: "#00b4ff", marginBottom: 12 }}
        >
          Projects
        </motion.h2>

        <div className="projects-grid" style={{ display: 'grid', gap: 24, gridAutoRows: '1fr', width: '100%' }}>
          {projects.length > 0 ? projects.map((p, idx) => {
            const projectKey = p._id || idx
            return (
            <motion.div
              key={projectKey}
              className="project-card"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}
              viewport={{ once: true }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                background: 'linear-gradient(145deg, rgba(20,20,20,0.9), rgba(10,10,10,0.9))',
                border: '1px solid rgba(0,255,255,0.1)',
                borderRadius: 16,
                padding: 16,
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(0,255,255,0.08)'
              }}
            >
              <motion.div className="ss" whileHover={{ scale: 1.05 }} style={{ borderRadius: 12, overflow: 'hidden', height: '220px' }}>
                <img
                  src={buildAssetUrl(p.image || p.ss)}
                  alt={p.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: 12
                  }}
                />
              </motion.div>

              <div>
                <h3 style={{ fontSize: 18, color: '#0ea5e9', margin: 0,  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h3>
                <ProjectDescription
                  text={p.desc}
                  expanded={!!expandedDescriptions[projectKey]}
                  onToggle={() => setExpandedDescriptions((prev) => ({
                    ...prev,
                    [projectKey]: !prev[projectKey]
                  }))}
                />

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
            )
          }) : (
            <p style={{ color: '#bbb' }}>No projects available from the database.</p>
          )}
        </div>
      </div>
    </motion.section>
  )
}
