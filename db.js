// const mongoose = require('mongoose');

// const mongoURL = 'mongodb+srv://hechernandezmdp:nubedatamessi@ecommerce.vhn3njt.mongodb.net/?retryWrites=true&w=majority&appName=Ecommerce';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoURL);
//     console.log('MongoDB connected...');
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require('mongoose');
const { mongoURL } = require('./config');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

