-- Add invitee phone number to support contact details and phone-call booking flows
ALTER TABLE "Meeting"
ADD COLUMN "inviteePhone" TEXT;
