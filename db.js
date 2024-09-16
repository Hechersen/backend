const mongoose = require('mongoose');
const { mongoURL } = require('./config');
const logger = require('./src/utils/logger');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    logger.info('MongoDB connected...');
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
