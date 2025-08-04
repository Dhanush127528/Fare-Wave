import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const rideHistorySchema = new mongoose.Schema(
  {
    from: String,
    to: String,
    fare: Number,
    date: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
    },
    wallet: {
      type: Number,
      default: 0,
    },
    coins: {
      type: Number,
      default: 0,
    },
    rideHistory: {
      type: [rideHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;