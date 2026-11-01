
const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    travelers: {
      type: Number,
      required: true,
    },

    budget: {
      type: String,
      required: true,
    },

    itinerary: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
