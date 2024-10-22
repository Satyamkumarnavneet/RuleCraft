import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import ruleRoutes from './routes/ruleRoutes.js'; // Adjust if your routes file is named differently

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ruleengine', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api', ruleRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
