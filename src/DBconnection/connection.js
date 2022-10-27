import mongoose from "mongoose";

const DB_CONNECTION = process.env.MONGO_URL;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const connectionDB = async () => {
  try {
    await mongoose.connect(DB_CONNECTION, options);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
