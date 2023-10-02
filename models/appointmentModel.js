import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  dean: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  appointmentAt: {
    type: Date,
    required: true,
    unique: true,
  },
  isAllocated: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
