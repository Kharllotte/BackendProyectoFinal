import mongoose from "mongoose";

const userCollectionName = "users";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
  },
  role: {
    type: String,
    index: true,
    enum: ["user", "admin", "qa", "premium"],
    default: "user",
  },
  age: Number,
  documents: [
    {
      category: {
        type: String,
        require: true
      },
      name: {
        type: String,
        require: true,
      },
      reference: {
        type: String,
        require: true,
      },
      default: []
    },
  ],
  lastConnection: Date,
});

const userModel = mongoose.model(userCollectionName, userSchema);

export default userModel;
