const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    room: { type: Number, required: false },
    status: { type: String, required: true, default: "booked" },
    roomid: { type: Number, required: false },
    userid: { type: Number, required: false },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalamount: {
      type: Number,
      required: true,
    },
    totaldays: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("bookings", bookingSchema);

module.exports = bookingModel;
