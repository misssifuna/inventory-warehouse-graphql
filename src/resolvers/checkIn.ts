import { getAttendee, getAttendees } from "../data/attendees";
import { requestCheckIn } from "../services/checkInService";

const resolvers = {
  Query: {
    attendee: (_: unknown, args: { id: string }) => {
      return getAttendee(args.id);
    },

    attendees: () => {
      return getAttendees();
    },
  },

  Mutation: {
    checkIn: (_: unknown, args: { attendeeId: string }) => {
      return requestCheckIn(args.attendeeId);
    },
  },
};

export { resolvers };

