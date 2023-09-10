import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  appointmentAt: {
    type: Date,
    required: true,
    unique: true,
    index: true,
  },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
