import expressAsyncHandler from 'express-async-handler';

import User from '../models/userModel.js';
import Appointment from '../models/appointmentModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Get free Slots
// @route GET /api/v1/appointments
// @access protect
const getSlots = expressAsyncHandler(async (req, res) => {
  const alreadyCreatedFreeSlots = await Appointment.find({
    isAllocated: { $eq: false },
    appointmentAt: { $gt: new Date() },
  });
  let newlyCreatedFreeSlots = [];

  // checking whether there are enough free slots or not
  if (alreadyCreatedFreeSlots.length < 4) {
    // finding max last date
    const lastAppointedSlot = await Appointment.find({
      isAllocated: { $eq: true },
    })
      .sort({ appointmentAt: -1 })
      .limit(1);

    const lastUnappointedSlot = await Appointment.find({
      isAllocated: { $eq: false },
    })
      .sort({ appointmentAt: -1 })
      .limit(1);

    let maxDate = new Date();

    if (
      lastAppointedSlot.length &&
      lastAppointedSlot[0].appointmentAt > maxDate
    )
      maxDate = lastAppointedSlot[0].appointmentAt;

    if (
      lastUnappointedSlot.length &&
      lastUnappointedSlot[0].appointmentAt > maxDate
    )
      maxDate = lastUnappointedSlot[0].appointmentAt;

    let appointmentTime = [];

    for (let i = 0; i < 4; i++) {
      let d1 = new Date(maxDate),
        d2 = new Date(maxDate);

      // Thursday
      d1.setDate(d1.getDate() + ((4 + 7 - d1.getDay()) % 7 || 7) + 7 * i);
      d1.setHours(10, 0, 0, 0);
      appointmentTime.push({ appointmentAt: d1 });

      // Friday
      d2.setDate(d2.getDate() + ((5 + 7 - d2.getDay()) % 7 || 7) + 7 * i);
      d2.setHours(10, 0, 0, 0);
      appointmentTime.push({ appointmentAt: d2 });
    }

    newlyCreatedFreeSlots = await Appointment.insertMany(appointmentTime);
  }

  res.json({ slots: [...alreadyCreatedFreeSlots, ...newlyCreatedFreeSlots] });
});

// @desc Book free slot
// @route PATCH /api/v1/appointments/:id
// @access protect
const bookSlot = expressAsyncHandler(async (req, res) => {
  const slot = await Appointment.findById(req.params.id);

  if (slot) {
    if (slot.isAllocated) {
      res.status(401);
      throw new Error('Slot already booked');
    } else {
      slot.user = req.user;
      slot.isAllocated = true;
      await slot.save();

      return res
        .status(201)
        .json({ message: 'Slot is successfully booked!!!' });
    }
  } else {
    res.status(404);
    throw new Error('Slot not found');
  }
});

// @desc Get future booked slots by dean
// @route GET /api/v1/appointments/:id
// @access protect + dean
const getBookedSlots = expressAsyncHandler(async (req, res) => {
  const bookedSlots = await Appointment.find({
    isAllocated: { $eq: true },
    appointmentAt: { $gt: new Date() },
  });
  res.json({ slots: bookedSlots });
});

export { getSlots, bookSlot, getBookedSlots };
