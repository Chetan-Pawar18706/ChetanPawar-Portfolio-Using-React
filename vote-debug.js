import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI not configured');
}

const schema = new mongoose.Schema({ agree: Number, disagree: Number }, { collection: 'blog_posts' });
const Blog = mongoose.model('BlogVoteDebug', schema, 'blog_posts');

async function run() {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  const id = '69f58bd240372a5c390ddf26';
  const item = await Blog.findByIdAndUpdate(id, { $inc: { agree: 1 } }, { new: true });
  console.log(JSON.stringify(item, null, 2));
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
