const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      select: {
        inviteeName: true,
        inviteeEmail: true,
        inviteePhone: true,
        startTime: true,
      },
      orderBy: {startTime: "desc"},
    });

    const now = new Date();
    const contactsMap = new Map();

    meetings.forEach((meeting) => {
      const emailKey = (meeting.inviteeEmail || "").toLowerCase();
      if (!emailKey) return;

      if (!contactsMap.has(emailKey)) {
        contactsMap.set(emailKey, {
          name: meeting.inviteeName,
          email: meeting.inviteeEmail,
          phoneNumber: meeting.inviteePhone || "",
          lastMeetingDate: null,
          nextMeetingDate: null,
          company: "",
        });
      }

      const contact = contactsMap.get(emailKey);

      if (
        (!contact.phoneNumber || contact.phoneNumber.length === 0) &&
        meeting.inviteePhone
      ) {
        contact.phoneNumber = meeting.inviteePhone;
      }

      if (meeting.startTime <= now) {
        if (
          !contact.lastMeetingDate ||
          meeting.startTime > new Date(contact.lastMeetingDate)
        ) {
          contact.lastMeetingDate = meeting.startTime;
        }
      } else if (
        !contact.nextMeetingDate ||
        meeting.startTime < new Date(contact.nextMeetingDate)
      ) {
        contact.nextMeetingDate = meeting.startTime;
      }
    });

    const contacts = Array.from(contactsMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    res.json(contacts);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

module.exports = router;
