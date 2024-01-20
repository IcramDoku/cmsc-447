const mongoose = require('mongoose');

const getConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (conn) {
      console.log(`MongoDB Connected`);
      return conn.connection.db; // Return the database instance
    } else {
      console.log("Failed to connect DB");
      throw new Error('Failed to connect to MongoDB');
    }
  } catch (error) {
    console.log(`Failed with error: ${error.message}`);
    throw error;
  }
};

module.exports = getConnection;
