const express = require("express");
const moment = require("moment");


const router = express.Router();

const Booking = require("../models/booking");
const Room = require("../models/room");

router.post("/getallbookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;
  try {
    const booking = await Booking.findOne({ _id: bookingid });

    booking.status = "cancelled";
    await booking.save();
    const room = await Room.findOne({ roomnumber: roomid });
    const bookings = room.currentbookings;
    const temp = bookings.filter((x) => x.bookingid.toString() !== bookingid);
    room.currentbookings = temp;
    await room.save();

    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/getbookingbyuserid", async (req, res) => {
  const { userid } = req.body;
  try {
    const bookings = await Booking.find({ userid: userid });

    res.send(bookings);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.post("/bookroom", async (req, res) => {
  try {
    console.log(req.body);
    const { room, userid, fromdate, todate, totalAmount, totaldays } = req.body;

      const newBooking = new Booking({
        room: room.roomnumber,
        roomid: room.roomnumber,
        userid: userid,
        fromdate: moment(fromdate).format("DD-MM-YYYY"),
        todate: moment(todate).format("DD-MM-YYYY"),
        totalamount: totalAmount,
        totaldays
      });

      console.log(newBooking);

      newBooking.save()
      .then(async (booking) => {
        console.log("searching room : " + room.room_id);
        const roomTmp = await Room.findOne({ room_id: room.room_id });

        if(!roomTmp){
          return res.status(404).json({message: "Room not found"});
        }
        roomTmp.currentbookings.push({
          bookingid: booking._id,
          fromdate: moment(fromdate).format("DD-MM-YYYY"),
          todate: moment(todate).format("DD-MM-YYYY"),
          userid: userid,
          status: booking.status,
        });

        await roomTmp.save();
        res.send("Payment Successful, Your Room is booked");
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({ message: "Error saving new booking" });
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

module.exports = router;
