import React from 'react'
import { motion } from 'framer-motion'
import "../CSS/Home.css"
import '../index.css'

import photo from '../../assets/chetan.jpg'
import githubLogo from '../../public/github.png'
import linkedinLogo from '../../public/linkedin.png'
import gmailLogo from '../../public/gmail.png'
import whatsappLogo from '../../public/whatsapp.png'
import { byCategory, loadPageItems } from '../lib/pageContent'

export default function Home() {
  const [remoteItems, setRemoteItems] = React.useState([])
  const professionsFallback = [
    'Software Developer Intern',
    'Frontend Developer',
    'React.js Developer',
    'PHP & MySQL Developer',
    'Flutter Learner',
  ]

  const quickLinksFallback = [
    { img: githubLogo, title: 'GitHub', link: 'https://github.com/Chetan-Pawar18706' },
    { img: linkedinLogo, title: 'LinkedIn', link: 'https://www.linkedin.com/in/chetan-pawarr' },
    { img: gmailLogo, title: 'Email', link: 'mailto:chetanpawar8125@gmail.com' },
    { img: whatsappLogo, title: 'WhatsApp', link: 'https://wa.me/919099281970' },
  ]
  const infoFallback = [
    { label: 'Location', value: 'Navsari, Gujarat, India' },
    { label: 'Expertise', value: 'React.js, PHP, MySQL, CRUD Apps' },
    { label: 'Contact', value: 'chetanpawar8125@gmail.com' },
  ]

  React.useEffect(() => {
    let active = true
    loadPageItems('home').then((items) => active && setRemoteItems(items)).catch(() => active && setRemoteItems([]))
    return () => {
      active = false
    }
  }, [])

  const hero = byCategory(remoteItems, 'hero')[0]
  const professions = byCategory(remoteItems, 'profession').length
    ? byCategory(remoteItems, 'profession').map((item) => item.title || item.text).filter(Boolean)
    : professionsFallback
  const infoCards = byCategory(remoteItems, 'info').length
    ? byCategory(remoteItems, 'info').map((item) => ({ label: item.title, value: item.text }))
    : infoFallback
  const quickLinks = byCategory(remoteItems, 'link').length
    ? byCategory(remoteItems, 'link').map((item) => ({ img: item.image, title: item.title, link: item.url || '#' }))
    : quickLinksFallback

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
              src={hero?.image || photo}
              alt={hero?.title || "Chetan Sitaram Pawar"}
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
            Hi, I’m{' '}
            <motion.span
              animate={{ backgroundPositionX: ['0%', '200%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="home-name"
            >
              Chetan Pawar
            </motion.span>
          </h1>

          <p className="typing-effect">
            {hero?.text || 'BCA Student | Frontend Developer | Software Developer Intern'}
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
        <h2 className="quick-links-title">Connect with me</h2>
        <div className="quick-links-list">
          {quickLinks.map((item, i) => (
            <motion.a
              key={i}
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
