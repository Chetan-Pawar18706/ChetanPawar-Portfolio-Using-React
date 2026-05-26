import React, { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "emailjs-com";

import githubLogo from "../../public/github.png";
import linkedinLogo from "../../public/linkedin.png";
import gmailLogo from "../../public/gmail.png";
import whatsappLogo from "../../public/whatsapp.png";

import "../CSS/Contact.css"
import '../index.css'
import { apiFetch } from "../lib/api";
import { byCategory, loadPageItems } from "../lib/pageContent";

export default function Contact() {
  const [form, setForm] = useState({ name: "", contact: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const [remoteItems, setRemoteItems] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.contact || !form.subject || !form.message) {
      setStatus("Please fill in all fields.");
      return;
    }

    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    const isEmail = emailPattern.test(form.contact);
    if (!isEmail && isNaN(form.contact)) {
      setStatus("Please enter a valid email or phone number.");
      return;
    }

    setStatus("Sending...");

    try {
      await apiFetch("/messages", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (
        import.meta.env.VITE_EMAILJS_SERVICE_ID &&
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID &&
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      ) {
        emailjs
          .send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              from_name: form.name,
              contact_info: form.contact,
              subject: form.subject,
              message: form.message,
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          )
          .catch((error) => console.error("EmailJS failed after saving message:", error));
      }

      setStatus("Message sent successfully!");
      setForm({ name: "", contact: "", subject: "", message: "" });
    } catch (error) {
      setStatus(error.message || "Failed to send. Try again later.");
    }
  };

  React.useEffect(() => {
    let active = true;
    loadPageItems("contact").then((items) => active && setRemoteItems(items)).catch(() => active && setRemoteItems([]));
    return () => {
      active = false;
    };
  }, []);

  const quickLinksFallback = [
    { img: githubLogo, title: "GitHub", link: "https://github.com/Chetan-Pawar18706" },
    { img: linkedinLogo, title: "LinkedIn", link: "https://www.linkedin.com/in/chetan-pawarr" },
    { img: gmailLogo, title: "Email", link: "mailto:chetanpawar8125@gmail.com" },
    { img: whatsappLogo, title: "WhatsApp", link: "https://wa.me/919099281970" },
  ];
  const content = byCategory(remoteItems, "content")[0];
  const quickLinks = byCategory(remoteItems, "link").length
    ? byCategory(remoteItems, "link").map((item) => ({ img: item.image, title: item.title, link: item.url || "#" }))
    : quickLinksFallback;

  return (
    <section className="contact-section">
      <motion.h1
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="contact-title"
      >
        {content?.title || "Let’s Connect & Collaborate"}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="contact-subtitle"
      >
        {content?.text || "Open to Software Developer Intern roles, frontend opportunities, and real-world project collaboration."}
      </motion.p>

      <motion.div className="contact-links">
        {quickLinks.map((item, i) => (
          <motion.a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            whileHover={{ scale: 1.15, rotate: 5 }}
            transition={{ type: "spring", stiffness: 250 }}
          >
            <motion.img
              src={item.img}
              alt={item.title}
              className="social-icon"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.a>
        ))}
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        className="contact-form"
      >
        <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        <input type="text" name="contact" placeholder="Your Email or Phone" value={form.contact} onChange={handleChange} required />
        <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
        <textarea name="message" placeholder="Your Message..." value={form.message} onChange={handleChange} rows="5" required />
        <motion.button type="submit" className="contact-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          Send Message
        </motion.button>

        {status && <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="contact-status">{status}</motion.p>}
      </motion.form>
    </section>
  );
}
