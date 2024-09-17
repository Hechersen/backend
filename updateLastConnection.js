const mongoose = require('mongoose');
require('dotenv').config();

// Conexión a la base de datos
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

// Modelo de usuario
const User = require('./models/user');

const updateUsers = async () => {
  try {
    await User.updateMany(
      { last_connection: { $exists: false } },
      { $set: { last_connection: new Date() } }
    );
    console.log('Usuarios actualizados con last_connection');
    process.exit();
  } catch (err) {
    console.error('Error al actualizar usuarios:', err);
    process.exit(1);
  }
};

// Conectarse a la base de datos y ejecutar actualización
connectDB().then(updateUsers);
