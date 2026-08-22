import { getAttendee, Attendee } from "../data/attendees";
import { publishPrintRequest } from "./printQueue";

export type CheckInResult =
  | {
      success: true;
      attendee: Attendee;
      message: string;
    }
  | {
      success: false;
      attendee: Attendee;
      message: string;
    };

export function requestCheckIn(attendeeId: string): CheckInResult {
  const attendee = getAttendee(attendeeId);

  if (!attendee) {
    throw new Error(`Attendee ${attendeeId} not found.`);
  }

  // Duplicate protection.
  if (attendee.status === "CHECKED_IN") {
    return {
      success: false,
      attendee,
      message: "Attendee is already checked in.",
    };
  }

  // Prevent another print request while one is already pending.
  if (attendee.status === "PENDING") {
    return {
      success: false,
      attendee,
      message: "Badge printing is already pending.",
    };
  }

  // The attendee is NOT checked in yet.
  // The printer must confirm successful printing first.
  attendee.status = "PENDING";

  publishPrintRequest(attendee.id);

  return {
    success: true,
    attendee,
    message: "Check-in accepted. Badge printing is pending.",
  };
}

