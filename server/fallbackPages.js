const fallbackPages = {
  home: [
    {
      category: "hero",
      title: "Chetan Sitaram Pawar",
      text: "BCA Student | Frontend Developer | Software Developer Intern",
      image: "/assets/chetan.jpg",
      url: "",
      items: [],
      order: 1,
      published: true,
    },
    { category: "profession", title: "Software Developer Intern", text: "", image: "", url: "", items: [], order: 2, published: true },
    { category: "profession", title: "Frontend Developer", text: "", image: "", url: "", items: [], order: 3, published: true },
    { category: "profession", title: "React.js Developer", text: "", image: "", url: "", items: [], order: 4, published: true },
    { category: "profession", title: "PHP & MySQL Developer", text: "", image: "", url: "", items: [], order: 5, published: true },
    { category: "profession", title: "Flutter Learner", text: "", image: "", url: "", items: [], order: 6, published: true },
    { category: "info", title: "Location", text: "Navsari, Gujarat, India", image: "", url: "", items: [], order: 7, published: true },
    { category: "info", title: "Expertise", text: "React.js, PHP, MySQL, CRUD Apps", image: "", url: "", items: [], order: 8, published: true },
    { category: "info", title: "Contact", text: "chetanpawar8125@gmail.com", image: "", url: "", items: [], order: 9, published: true },
  ],
  contact: [
    {
      category: "content",
      title: "Let's Connect & Collaborate",
      text: "Open to Software Developer Intern roles, frontend opportunities, and real-world project collaboration.",
      image: "",
      url: "",
      items: [],
      order: 1,
      published: true,
    },
    { category: "link", title: "GitHub", text: "", image: "/github.png", url: "#", items: [], order: 2, published: true },
    { category: "link", title: "LinkedIn", text: "", image: "/linkedin.png", url: "#", items: [], order: 3, published: true },
    { category: "link", title: "Email", text: "", image: "/gmail.png", url: "mailto:chetanpawar8125@gmail.com", items: [], order: 4, published: true },
    { category: "link", title: "WhatsApp", text: "", image: "/whatsapp.png", url: "https://wa.me/919099281970", items: [], order: 5, published: true },
  ],
  gallery: [{ category: "section", title: "Gallery", text: "", image: "", url: "", items: [], order: 0, published: true }],
  blog: [{ category: "section", title: "My Blog", text: "Project learnings, development notes, and reflections.", image: "", url: "", items: [], order: 0, published: true }],
  skills: [{ category: "section", title: "My Skills", text: "Frontend development, backend fundamentals, databases, and tools.", image: "", url: "", items: [], order: 0, published: true }],
  certificates: [{ category: "section", title: "Certificates", text: "Certifications and achievements will be updated here.", image: "", url: "", items: [], order: 0, published: true }],
  resume: [{ category: "section", title: "Resume", text: "A quick glance at my education, experience, projects, and technical skills.", image: "", url: "", items: [], order: 0, published: true }],
  about: [{ category: "section", title: "About Me", text: "BCA student and frontend developer building practical web applications.", image: "", url: "", items: [], order: 0, published: true }],
};

function getFallbackPage(slug, includeUnpublished = false) {
  const items = fallbackPages[slug] || [];
  return includeUnpublished ? items : items.filter((item) => item.published !== false);
}

module.exports = {
  fallbackPages,
  getFallbackPage,
};
