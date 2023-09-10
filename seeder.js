import mongoose, { connect } from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import connectDB from './config/db.js';
import students from './data/students.js';
import dean from './data/dean.js';
import User from './models/userModel.js';
import Appointment from './models/appointmentModel.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Appointment.deleteMany();

    await User.insertMany([...students, dean]);

    console.log('Data imported!!!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Appointment.deleteMany();

    await User.insertMany([dean]);

    console.log('Data deleted!!!'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') destroyData();
else importData();
