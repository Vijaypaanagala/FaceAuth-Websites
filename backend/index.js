import express from 'express';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/UserRoutes.js';

dotenv.config();

const app = express();


app.use(cors({
  origin: 'http://localhost:5173',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());


app.use(express.json());


app.get('/', (req, res) => {
  res.send("API is running");
});

app.use('/user', router);

const PORT = process.env.port || 3000;

mongoose.connect(process.env.mongoUrl)
  .then(() => {
    console.log("Connected successfully to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
