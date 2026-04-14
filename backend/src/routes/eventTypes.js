const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all event types
router.get('/', async (req, res) => {
  try {
    const eventTypes = await prisma.eventType.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single event type by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const eventType = await prisma.eventType.findUnique({
      where: { slug },
    });
    if (!eventType) return res.status(404).json({ error: 'Event type not found' });
    res.json(eventType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create event type
router.post('/', async (req, res) => {
  try {
    const { name, slug, duration, description, color } = req.body;
    const eventType = await prisma.eventType.create({
      data: { name, slug, duration, description, color },
    });
    res.status(201).json(eventType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update event type
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, duration, description, color } = req.body;
    const eventType = await prisma.eventType.update({
      where: { id },
      data: { name, slug, duration, description, color },
    });
    res.json(eventType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete event type
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.eventType.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
