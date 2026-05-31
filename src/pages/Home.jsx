import React from 'react'
import { motion } from 'framer-motion'
import "../CSS/Home.css"
import '../index.css'

import { byCategory, loadPageItems, toContactLinks } from '../lib/pageContent'
import { buildAssetUrl } from '../config/api'

export default function Home() {
  const [remoteItems, setRemoteItems] = React.useState([])
  const [contactItems, setContactItems] = React.useState([])

  React.useEffect(() => {
    let active = true
    Promise.all([loadPageItems('home'), loadPageItems('contact')])
      .then(([homeItems, contactContent]) => {
        if (!active) return
        setRemoteItems(homeItems)
        setContactItems(contactContent)
      })
      .catch(() => {
        if (!active) return
        setRemoteItems([])
        setContactItems([])
      })
    return () => {
      active = false
    }
  }, [])

  const section = byCategory(remoteItems, 'section')[0]
  const hero = byCategory(remoteItems, 'hero')[0]
  const professions = byCategory(remoteItems, 'profession').map((item) => item.title || item.text).filter(Boolean)
  const quickLinks = toContactLinks(contactItems)
  const primaryContact = quickLinks.find((item) => /email|contact/i.test(item.title)) || quickLinks[0]
  const primaryContactValue = primaryContact?.link?.replace(/^mailto:/, '').replace(/^https:\/\/wa\.me\//, '+')
  const infoCards = byCategory(remoteItems, 'info').map((item) => ({
    label: item.title,
    value: /contact/i.test(item.title) && primaryContactValue ? primaryContactValue : item.text,
  }))
  const displayName = hero?.title || section?.title || 'Portfolio'
  const introText = section?.text || 'Hi, I am'
  const headline = hero?.text || 'Content is loading from the database.'

  return (
    <section className="home-section">
      <style>
        {`
          @keyframes typing { from { width: 0; } to { width: 100%; } }
          @keyframes blink { 50% { border-color: transparent; } }
        `}
      </style>

      <div className="home-top">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="photo-container"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="photo-ring"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="photo-frame"
          >
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="profile-photo"
              src={buildAssetUrl(hero?.image)}
              alt={displayName}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="home-info"
        >
          <h1 className="home-title">
            {introText}{' '}
            <motion.span
              animate={{ backgroundPositionX: ['0%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="home-name"
            >
              {displayName}
            </motion.span>
          </h1>

          <p className="typing-effect">
            {headline}
          </p>

          <motion.div className="profession-tags">
            {professions.map((role, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05, background: 'linear-gradient(90deg,var(--accent),var(--accent-2))' }} transition={{ type: 'spring', stiffness: 200 }} className="profession-tag">
                {role}
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="info-cards">
            {infoCards.map((info, i) => (
              <motion.div key={i} whileHover={{ y: -4, scale: 1.05 }} transition={{ type: 'spring', stiffness: 250 }} className="info-card">
                <strong>{info.label}</strong>
                <p>{info.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div className="quick-links">
        <h2 className="quick-links-title">{byCategory(remoteItems, 'links-title')[0]?.title || 'Links'}</h2>
        <div className="quick-links-list">
          {quickLinks.map((item, i) => (
            <motion.a
              key={item.id || i}
              href={item.link}
              title={item.title}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 250 }}
            >
              <motion.img
                src={item.img}
                alt={item.title}
                whileHover={{ filter: 'drop-shadow(0 0 15px var(--accent)) brightness(1.2)' }}
                className="quick-link-img"
              />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
