require('dotenv').config();

const { connectDB } = require('./db');
const { pageModels } = require('./models/PageContent');

const API_ORIGIN = process.env.API_ORIGIN || `http://localhost:${process.env.PORT || 5000}`;
const asset = (name) => `${API_ORIGIN}/assets/${name}`;

async function addItems() {
  await connectDB();
  const Model = pageModels['resume'];
  if (!Model) {
    console.error('resume model not found');
    process.exit(1);
  }

  const existing = await Model.find({ category: { $in: ['education', 'experience'] } });
  if (existing.length > 0) {
    console.log(`resume: already has ${existing.length} education/experience items — no changes made`);
    process.exit(0);
  }

  const docs = [
    { category: 'education', title: 'Bachelor of Computer Applications (BCA)', text: 'Naran Lala College of Professional & Applied Sciences - Navsari', items: ['Veer Narmad South Gujarat University, Surat, Gujarat', 'July 2023 - May 2026 | CGPA: 7.76 | Percentage: 77.60%'], order: 10, published: true },
    { category: 'experience', title: 'Frontend Developer Intern', text: 'Techfusion Technologies - Navsari', items: ['Oct 2025 - Dec 2025 | React.js, JavaScript, HTML5, CSS3, React Router DOM'], order: 20, published: true },
    { category: 'experience', title: 'Independent Learning - App Development', text: 'Online Platforms', items: ['2026 - Present | Dart, Flutter, mini-projects, debugging, and problem-solving'], order: 21, published: true },
  ];

  await Model.insertMany(docs);
  console.log(`resume: inserted ${docs.length} education/experience items`);
  process.exit(0);
}

addItems().catch((err) => {
  console.error(err);
  process.exit(1);
});
