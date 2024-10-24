// models/MockTest.js

import mongoose from 'mongoose';

// Define the schema for a question
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: Map, // A map of key-value pairs where key is the option label (e.g., 'A', 'B') and value is the option text
    of: String,
    required: true,
  },
  answer: {
    type: String, // Correct answer (e.g., 'A', 'B', 'C')
    required: true,
  },
  explanation: {
    type: String, // Optional explanation for the correct answer
    default: '',
  },
});

// Define the schema for a mock test
const MockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  questions: [QuestionSchema], // Array of questions using the QuestionSchema
  userScore: {
    type: String, // Storing the user's score (e.g., "3/5")
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model exists already (to avoid overwriting) and export it
export default mongoose.models.MockTest || mongoose.model('MockTest', MockTestSchema);
