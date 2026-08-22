export type AttendeeStatus = "NOT_CHECKED_IN" | "PENDING" | "CHECKED_IN";

export interface Attendee {
  id: string;
  name: string;
  email: string;
  status: AttendeeStatus;
}

const attendees: Attendee[] = [
  {
    id: "ATT-001",
    name: "Alice Kamau",
    email: "alice@example.com",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "ATT-002",
    name: "Brian Otieno",
    email: "brian@example.com",
    status: "NOT_CHECKED_IN",
  },
  {
    id: "ATT-003",
    name: "Carol Wanjiku",
    email: "carol@example.com",
    status: "NOT_CHECKED_IN",
  },
];

export function getAttendees(): Attendee[] {
  return attendees;
}

export function getAttendee(id: string): Attendee | undefined {
  return attendees.find((attendee) => attendee.id === id);
}

