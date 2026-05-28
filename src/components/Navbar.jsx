import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Gallery", to: "/gallery" },
  { label: "Skills", to: "/skills" },
  { label: "Certificates", to: "/certificates" },
  { label: "Blog", to: "/blog" },
  { label: "Resume", to: "/resume" },
  { label: "About Me", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const navRef = useRef(null);
  const linksRef = useRef(null);

  // Check if links overflow nav width (to show hamburger)
  const checkOverflow = () => {
    if (!navRef.current || !linksRef.current) return;
    const smallScreen = window.innerWidth <= 1100;
    setIsSmallScreen(window.innerWidth <= 480);
    setShowButton(smallScreen || linksRef.current.scrollWidth > navRef.current.offsetWidth);
  };

  useEffect(() => {
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, []);

  useEffect(() => {
    if (!showButton) {
      setIsOpen(false);
    }
  }, [showButton]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* --- Navbar --- */}
      <nav
        ref={navRef}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isSmallScreen ? "0.8rem 1rem" : "1rem 2rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.6)",
          bacCPropFilter: "blur(10px)",
          fontFamily: "inherit",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <motion.div
            className="logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            style={{
              fontWeight: "bold",
              fontSize: "1.4rem",
              color: "var(--accent)",
            }}
          >
            CP
          </motion.div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 style={{ margin: 0, fontSize: 14 }}>Chetan Pawar</h1>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              Software Developer
            </div>
          </div>
        </div>

        {/* Desktop links */}
        <div
          ref={linksRef}
          style={{
            display: showButton ? "none" : "flex",
            justifyContent: "center",
            gap: "2rem",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              style={{
                position: "relative",
                fontSize: "0.95rem",
                textDecoration: "none",
                color: "white",
                fontWeight: 500,
              }}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{
                    scale: 1.1,
                    color: "var(--accent)",
                    textShadow: "0 0 8px var(--accent)",
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <motion.span
                    animate={{ color: isActive ? "var(--accent)" : "#ffffff" }}
                    transition={{ duration: 0.3 }}
                  >
                    {l.label}
                  </motion.span>
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: "70%",
                        height: "2px",
                        marginTop: "4px",
                        borderRadius: "1px",
                        backgroundColor: "var(--accent)",
                        boxShadow: "0 0 6px var(--accent)",
                      }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Hamburger */}
        {showButton && (
          <div className="mobile-btn">
            <button
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                zIndex: 10000,
                width: 36,
                height: 36,
                display: "grid",
                placeItems: "center",
              }}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  display: "block",
                  width: 24,
                  height: 18,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: isOpen ? 8 : 0,
                    width: "100%",
                    height: 2,
                    borderRadius: 2,
                    background: "#fff",
                    transform: isOpen ? "rotate(45deg)" : "none",
                    transition: "0.2s ease",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 8,
                    width: "100%",
                    height: 2,
                    borderRadius: 2,
                    background: "#fff",
                    opacity: isOpen ? 0 : 1,
                    transition: "0.2s ease",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: isOpen ? 8 : 16,
                    width: "100%",
                    height: 2,
                    borderRadius: 2,
                    background: "#fff",
                    transform: isOpen ? "rotate(-45deg)" : "none",
                    transition: "0.2s ease",
                  }}
                />
              </span>
            </button>
          </div>
        )}
      </nav>

      {/* --- Mobile Dropdown Menu --- */}
      <AnimatePresence>
        {isOpen && showButton && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100vh",
              background: "rgba(0,0,0,0.95)",
              bacCPropFilter: "blur(12px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: isSmallScreen ? "4.5rem" : "4rem",
              overflowY: "auto",
              zIndex: 9999,
            }}
          >
            <button
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                color: "#fff",
                background: "none",
                border: "none",
                cursor: "pointer",
                width: 40,
                height: 40,
                display: "grid",
                placeItems: "center",
              }}
              onClick={() => setIsOpen(false)}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "relative",
                  display: "block",
                  width: 24,
                  height: 24,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 11,
                    width: "100%",
                    height: 2,
                    borderRadius: 2,
                    background: "#fff",
                    transform: "rotate(45deg)",
                  }}
                />
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 11,
                    width: "100%",
                    height: 2,
                    borderRadius: 2,
                    background: "#fff",
                    transform: "rotate(-45deg)",
                  }}
                />
              </span>
            </button>

            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setIsOpen(false)}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  padding: "1rem 0",
                  width: "100%",
                  textAlign: "center",
                  fontSize: 16,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {l.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

