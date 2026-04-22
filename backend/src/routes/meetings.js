const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const auth = require("../middleware/auth");
const {
  startOfDay,
  endOfDay,
  addMinutes,
  format,
  parseISO,
  isWithinInterval,
  isBefore,
} = require("date-fns");

// Get meetings (upcoming or past) - Admin only
router.get("/", auth, async (req, res) => {
  try {
    const {type} = req.query; // 'upcoming' or 'past'
    const now = new Date();

    let where = {};
    if (type === "upcoming") {
      where = {startTime: {gte: now}, status: "confirmed"};
    } else if (type === "past") {
      where = {startTime: {lt: now}};
    }

    const meetings = await prisma.meeting.findMany({
      where,
      include: {eventType: true},
      orderBy: {startTime: "asc"},
    });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Cancel a meeting
router.patch("/:id/cancel", async (req, res) => {
  try {
    const {id} = req.params;
    const meeting = await prisma.meeting.update({
      where: {id},
      data: {status: "cancelled"},
    });
    res.json(meeting);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// Book a meeting
router.post("/", async (req, res) => {
  try {
    const {inviteeName, inviteeEmail, inviteePhone, startTime, eventTypeId} =
      req.body;

    const eventType = await prisma.eventType.findUnique({
      where: {id: eventTypeId},
    });
    if (!eventType)
      return res.status(404).json({error: "Event type not found"});

    const start = parseISO(startTime);
    const end = addMinutes(start, eventType.duration);

    // Double booking check
    const existing = await prisma.meeting.findFirst({
      where: {
        status: "confirmed",
        OR: [
          {
            startTime: {lt: end},
            endTime: {gt: start},
          },
        ],
      },
    });

    if (existing) {
      return res.status(409).json({error: "This time slot is already booked."});
    }

    const meeting = await prisma.meeting.create({
      data: {
        inviteeName,
        inviteeEmail,
        inviteePhone,
        startTime: start,
        endTime: end,
        eventTypeId,
        status: "confirmed",
      },
      include: {eventType: true},
    });

    res.status(201).json(meeting);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// Get available slots for a date
router.get("/slots", async (req, res) => {
  try {
    const {date, eventTypeSlug} = req.query; // date format: YYYY-MM-DD
    if (!date || !eventTypeSlug)
      return res.status(400).json({error: "Missing date or eventTypeSlug"});

    const eventType = await prisma.eventType.findUnique({
      where: {slug: eventTypeSlug},
    });
    if (!eventType)
      return res.status(404).json({error: "Event type not found"});

    const selectedDate = parseISO(date);
    const dayOfWeek = selectedDate.getDay();

    // 1. Get availability for this day
    const availability = await prisma.availability.findFirst({
      where: {dayOfWeek},
    });

    if (!availability) return res.json([]); // No availability = no slots

    // 2. Get existing meetings for this day to exclude
    const startOfSelectedDay = startOfDay(selectedDate);
    const endOfSelectedDay = endOfDay(selectedDate);

    const meetings = await prisma.meeting.findMany({
      where: {
        status: "confirmed",
        startTime: {gte: startOfSelectedDay, lte: endOfSelectedDay},
      },
    });

    // 3. Generate slots
    const slots = [];
    const [startHour, startMin] = availability.startTime.split(":").map(Number);
    const [endHour, endMin] = availability.endTime.split(":").map(Number);

    let currentSlot = new Date(selectedDate);
    currentSlot.setHours(startHour, startMin, 0, 0);

    const endTime = new Date(selectedDate);
    endTime.setHours(endHour, endMin, 0, 0);

    const now = new Date();

    while (addMinutes(currentSlot, eventType.duration) <= endTime) {
      const slotEnd = addMinutes(currentSlot, eventType.duration);

      // Check if slot is in the past
      if (isBefore(currentSlot, now)) {
        currentSlot = addMinutes(currentSlot, eventType.duration);
        continue;
      }

      // Check if slot overlaps with any meeting
      const isBooked = meetings.some((meeting) => {
        return currentSlot < meeting.endTime && slotEnd > meeting.startTime;
      });

      if (!isBooked) {
        slots.push(format(currentSlot, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"));
      }

      currentSlot = addMinutes(currentSlot, eventType.duration);
    }

    res.json(slots);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;
