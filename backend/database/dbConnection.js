import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "nasa-blog",
    })
    .then(() => {
      console.log("Connected to database!");
    })
    .catch(() => {
      console.error(
        "Failed to connect to database. Please verify MongoDB configuration."
      );
    });
};

