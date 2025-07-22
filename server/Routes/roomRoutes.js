const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

// POST /api/rooms/join
router.post('/join', async (req, res) => {
  const { roomId } = req.body;
  let room = await Room.findOne({ roomId });

  if (!room) {
    room = new Room({ roomId });
    await room.save();
  }

  res.json(room);
});

// GET /api/rooms/:roomId
router.get('/:roomId', async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ msg: 'Room not found' });
  res.json(room);
});

module.exports = router;
