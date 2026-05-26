require("dotenv").config();

const connectDb = require("./db");
const Project = require("./models/Project");
const { pageModels } = require("./models/PageContent");

const API_ORIGIN = process.env.API_ORIGIN || `http://localhost:${process.env.PORT || 5000}`;
const asset = (name) => `${API_ORIGIN}/assets/${name}`;

const projectSeeds = [
  {
    title: "Royal Palace Management System",
    desc: "Java Swing desktop application managing hotel operations including room booking, guest management, billing, and staff coordination with user-friendly interface.",
    image: asset("chetan_royal_palace.png"),
    tech: ["Java", "PHP", "UI Design"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Class Throng",
    desc: "The Class Throng PHP project uses PHP, MySQL, and OOP to manage user registration, authentication, session management, profile updates, and dynamic content.",
    image: asset("chetan_class_throng.png"),
    tech: ["PHP", "MySQL", "HTML/CSS"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Masala Mastery",
    desc: "A masala website in PHP offers vibrant product displays, user accounts, shopping cart, recipes, blogs, and admin controls with responsive design.",
    image: asset("chetan_masala_mastery.png"),
    tech: ["PHP", "MySQL", "HTML/CSS"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Music Streamer",
    desc: "Web-based music streaming platform where users can upload, manage, and listen to music tracks with playlist creation and admin dashboard.",
    image: asset("chetan_music_stremer.png"),
    tech: ["PHP", "MySQL", "JavaScript"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Coaching Management System",
    desc: "Coaching Management System helps institutes manage students, batches, fees, attendance, and records in one centralized platform.",
    image: asset("chetan_coaching_management_system.png"),
    tech: ["PHP", "MySQL", "Admin Dashboard"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Service Booking System",
    desc: "Service Booking System allows users to register, browse, and book services like drivers, AC technicians, painters, and mechanics.",
    image: asset("chetan_service_booking_system.png"),
    tech: ["PHP", "MySQL", "Booking App"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Job Portal",
    desc: "Job Portal web application built using PHP and MySQL with job posting, search, resume uploads, and application tracking.",
    image: asset("chetan_job_portal.png"),
    tech: ["PHP", "MySQL", "Web App"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "Hospital Management System",
    desc: "Hospital Management System for patient registration, appointments, doctor management, and billing with role-based access.",
    image: asset("chetan_hospital_management_system.png"),
    tech: ["PHP", "MySQL", "Healthcare App"],
    live: "#",
    code: "#",
    published: true,
  },
  {
    title: "EduHub Online Examination",
    desc: "EduHub Online Exam System is a secure web application for MCQ-based online exams with admin control and instant result evaluation.",
    image: asset("chetan_eduhub_online_exam.png"),
    tech: ["PHP", "JavaScript", "MySQL"],
    live: "https://online-exam.is-best.net",
    code: "#",
    published: true,
  },
];

const pageSeeds = {
  home: [
    { category: "hero", title: "Chetan Sitaram Pawar", text: "BCA Student | Frontend Developer | Software Developer Intern", image: asset("chetan.jpg"), order: 1 },
    { category: "profession", title: "Software Developer Intern", order: 2 },
    { category: "profession", title: "Frontend Developer", order: 3 },
    { category: "profession", title: "React.js Developer", order: 4 },
    { category: "profession", title: "PHP & MySQL Developer", order: 5 },
    { category: "profession", title: "Flutter Learner", order: 6 },
    { category: "info", title: "Location", text: "Navsari, Gujarat, India", order: 7 },
    { category: "info", title: "Expertise", text: "React.js, PHP, MySQL, CRUD Apps", order: 8 },
    { category: "info", title: "Contact", text: "chetanpawar8125@gmail.com", order: 9 },
    { category: "link", title: "GitHub", image: "/github.png", url: "#", order: 10 },
    { category: "link", title: "LinkedIn", image: "/linkedin.png", url: "#", order: 11 },
    { category: "link", title: "Email", image: "/gmail.png", url: "mailto:chetanpawar8125@gmail.com", order: 12 },
    { category: "link", title: "WhatsApp", image: "/whatsapp.png", url: "https://wa.me/919099281970", order: 13 },
  ],
  gallery: [
    { category: "personal", title: "Profile", text: "Chetan Sitaram Pawar - BCA student and aspiring Software Developer Intern.", image: asset("chetan.jpg"), order: 1 },
    ...projectSeeds.map((project, index) => ({ category: "projects", title: project.title, text: project.desc, image: project.image, order: index + 2 })),
    ...projectSeeds.slice(0, 4).map((project, index) => ({ category: "achievements", title: project.title, text: project.desc, image: project.image, order: index + 20 })),
  ],
  blog: [
    { category: "post", title: "Why I Enjoy Building CRUD Applications", text: "CRUD projects teach the complete flow of a real application: forms, validation, database design, authentication, and user-friendly dashboards. They helped me understand how frontend and backend work together.", order: 1 },
    { category: "post", title: "What React.js Taught Me", text: "React helped me think in reusable components, props, hooks, and routing. It also improved the way I structure frontend code for responsive and interactive interfaces.", order: 2 },
    { category: "post", title: "Learning PHP and MySQL Through Projects", text: "Building systems like attendance management and online examination platforms improved my understanding of sessions, role-based access, relational tables, and secure data handling.", order: 3 },
    { category: "post", title: "Exploring Flutter and App Development", text: "I am learning Dart and Flutter through mini-projects to expand beyond web development and strengthen my problem-solving and debugging skills.", order: 4 },
  ],
  skills: [
    ...[
      ["C", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg"],
      ["PHP", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg"],
      ["Python", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"],
      ["JavaScript", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"],
      ["React", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"],
      ["HTML", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"],
      ["CSS", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"],
      ["Bootstrap", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg"],
      ["Tailwind", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg"],
      ["MySQL", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg"],
      ["SQL Server", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg"],
      ["MongoDB", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"],
      ["Git", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg"],
      ["Flutter", "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg"],
    ].map(([title, image], index) => ({ category: "skill", title, image, order: index + 1 })),
    { category: "group", title: "Programming Languages", items: ["C", "PHP", "Python (Basics)", "JavaScript"], order: 20 },
    { category: "group", title: "Frontend", items: ["React.js", "HTML5", "CSS3", "Bootstrap", "Tailwind CSS"], order: 21 },
    { category: "group", title: "Backend", items: ["PHP", "ASP.NET (Basics)"], order: 22 },
    { category: "group", title: "Databases & Tools", items: ["MySQL", "SQL Server", "MongoDB", "Git", "VS Code"], order: 23 },
    { category: "group", title: "Core Concepts", items: ["DBMS", "Object-Oriented Programming", "Operating Systems", "Data Structures", "Computer Networks"], order: 24 },
    { category: "group", title: "Additional Strengths", items: ["Problem Solving", "Analytical Skills", "Quick Learning", "Adaptability", "Communication", "Teamwork"], order: 25 },
  ],
  certificates: [
    { category: "tech", title: "No certificate uploaded yet", text: "Add certificate images from admin when available.", order: 1, published: false },
  ],
  resume: [
    { category: "profile", title: "CHETAN SITARAM PAWAR", text: "BCA Student | Frontend Developer | Software Developer Intern", order: 1 },
    { category: "summary", title: "Professional Summary", text: "Detail-oriented and motivated BCA student with a strong foundation in Data Structures, DBMS, Computer Networks, and Operating Systems. Proficient in frontend development using React.js, JavaScript, HTML, and CSS, with working knowledge of PHP and MySQL.", order: 2 },
    { category: "project", title: "Royal Palace Management System", order: 10 },
    { category: "project", title: "Class Throng", order: 11 },
    { category: "project", title: "Masala Mastery", order: 12 },
    { category: "project", title: "Music Streamer", order: 13 },
    { category: "project", title: "Coaching Management System", order: 14 },
    { category: "project", title: "Service Booking System", order: 15 },
    { category: "project", title: "Job Portal", order: 16 },
    { category: "project", title: "Hospital Management System", order: 17 },
    { category: "project", title: "EduHub Online Examination", order: 18 },
    { category: "skill", title: "Technical Skills", items: ["C", "PHP", "Python (Basics)", "JavaScript", "React.js", "HTML5", "CSS3", "Bootstrap", "Tailwind CSS", "ASP.NET (Basics)", "MySQL", "SQL Server", "MongoDB", "Git", "VS Code", "DBMS", "OOP", "Operating Systems", "Computer Networks"], order: 30 },
    { category: "link", title: "GitHub", url: "#", order: 40 },
    { category: "link", title: "LinkedIn", url: "#", order: 41 },
    { category: "link", title: "Email", url: "mailto:chetanpawar8125@gmail.com", order: 42 },
    { category: "pdf", title: "Resume PDF", url: "/resume.pdf", order: 50 },
  ],
  about: [
    { category: "paragraph", text: "Hi, I’m Chetan Sitaram Pawar, a detail-oriented BCA student with a strong foundation in Data Structures, DBMS, Computer Networks, and Operating Systems.", order: 1 },
    { category: "paragraph", text: "I build responsive frontend interfaces with React.js, JavaScript, HTML, and CSS, and I also work with backend technologies including PHP and MySQL. I enjoy creating CRUD-based web applications with clean navigation, secure role-based access, and practical user workflows.", order: 2 },
    { category: "paragraph", text: "I am eager to start my career as a Software Developer Intern and contribute to real-world projects while continuing to improve in web and app development.", order: 3 },
    { category: "education", title: "Bachelor of Computer Applications (BCA)", text: "Naran Lala College of Professional & Applied Sciences - Navsari", items: ["Veer Narmad South Gujarat University, Surat, Gujarat", "July 2023 - May 2026 | CGPA: 7.76 | Percentage: 77.60%"], order: 10 },
    { category: "education", title: "Frontend Developer Intern", text: "Techfusion Technologies - Navsari", items: ["Oct 2025 - Dec 2025 | React.js, JavaScript, HTML5, CSS3, React Router DOM"], order: 11 },
    { category: "education", title: "Independent Learning - App Development", text: "Online Platforms", items: ["2026 - Present | Dart, Flutter, mini-projects, debugging, and problem-solving"], order: 12 },
  ],
  contact: [
    { category: "content", title: "Let’s Connect & Collaborate", text: "Open to Software Developer Intern roles, frontend opportunities, and real-world project collaboration.", order: 1 },
    { category: "link", title: "GitHub", image: "/github.png", url: "#", order: 2 },
    { category: "link", title: "LinkedIn", image: "/linkedin.png", url: "#", order: 3 },
    { category: "link", title: "Email", image: "/gmail.png", url: "mailto:chetanpawar8125@gmail.com", order: 4 },
    { category: "link", title: "WhatsApp", image: "/whatsapp.png", url: "https://wa.me/919099281970", order: 5 },
  ],
};

async function seedCollection(name, Model, docs) {
  const count = await Model.countDocuments();
  if (count > 0) {
    console.log(`${name}: skipped (${count} existing)`);
    return;
  }

  await Model.insertMany(docs);
  console.log(`${name}: inserted ${docs.length}`);
}

async function seedContent() {
  await connectDb();

  await seedCollection("projects", Project, projectSeeds);

  for (const [slug, docs] of Object.entries(pageSeeds)) {
    await seedCollection(slug, pageModels[slug], docs);
  }

  process.exit(0);
}

seedContent().catch((error) => {
  console.error(error);
  process.exit(1);
});
