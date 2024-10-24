// /models/Student.js
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  admissionNumber: { type: String, required: true },
  rollNumber: { type: String, required: true },
  dob: { type: Date, required: true },
  fatherDetails: {
    name: String,
    mobile: String,
    email: String,
  },
  motherDetails: {
    name: String,
    mobile: String,
    email: String,
  },
  guardianDetails: {
    name: String,
    mobile: String,
    email: String,
  },
  address: { type: String, required: true },
  profilePicture: { type: String },
});

export default mongoose.models.Student || mongoose.model('Student', studentSchema);
