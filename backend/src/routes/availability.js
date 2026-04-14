const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const auth = require('../middleware/auth');

// Get all availability slots (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    const availability = await prisma.availability.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update or create availability slots (bulk update - Admin only)
router.post('/bulk', auth, async (req, res) => {
  try {
    const { slots } = req.body; // Array of { dayOfWeek, startTime, endTime, timezone }
    
    // Simplification: clear and recreate for the user
    await prisma.availability.deleteMany();
    const result = await prisma.availability.createMany({
      data: slots,
    });
    
    const updated = await prisma.availability.findMany({
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
