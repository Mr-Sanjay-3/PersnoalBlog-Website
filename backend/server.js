import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();
// Connect to database
connectDB();
const app = express();
//cors setup
app.use(cors({
origin :"https://persnoal-blog-website.vercel.app",
credentials:true,
methods:["POST","PUT","UPDATE","DELETE"]
},
))
app.use(express.json());

import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);

//Home
app.get('/', (req, res ,next) => {
  res.send('API is running...');
});


app.use((req,res ,next)=>{
      success:false,
     res.status(404).json({
      message:"API ROUTE NOT FOUND",
      path: req.originalUrl

     }),
           next()

})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
