import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();
dotenv.config();
// Connect to database
connectDB();
//cors setup
app.use(cors({
origin : process.env.FRONTENDURI,
credentials:true,
methods:["GET","POST","PUT","UPDATE","DELETE"]
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


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API ROUTE NOT FOUND",
    path: req.originalUrl
  });
});

const PORT = process.env.PORT 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
