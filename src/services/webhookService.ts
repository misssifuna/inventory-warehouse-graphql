import { getAttendee } from "../data/attendees";

export interface PrintWebhookEvent {
  jobId: string;
  attendeeId: string;
  status: "PRINTED" | "FAILED";
}

export function processPrintWebhook(event: PrintWebhookEvent) {
  const attendee = getAttendee(event.attendeeId);

  if (!attendee) {
    throw new Error(`Attendee ${event.attendeeId} not found.`);
  }

  // Ignore late or duplicate confirmations.
  if (attendee.status === "CHECKED_IN") {
    return {
      success: false,
      message: "Attendee is already checked in. Webhook ignored.",
      attendee,
    };
  }

  if (event.status === "FAILED") {
    return {
      success: false,
      message: "Badge printing failed.",
      attendee,
    };
  }

  attendee.status = "CHECKED_IN";

  return {
    success: true,
    message: "Badge printed successfully. Attendee checked in.",
    attendee,
  };
}

