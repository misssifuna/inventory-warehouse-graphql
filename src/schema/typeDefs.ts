const typeDefs = `#graphql
  enum AttendeeStatus {
    NOT_CHECKED_IN
    PENDING
    CHECKED_IN
  }

  type Attendee {
    id: ID!
    name: String!
    email: String!
    status: AttendeeStatus!
  }

  type CheckInResult {
    success: Boolean!
    message: String!
    attendee: Attendee!
  }

  type Query {
    attendee(id: ID!): Attendee
    attendees: [Attendee!]!
  }

  type Mutation {
    checkIn(attendeeId: ID!): CheckInResult!
  }
`;

export { typeDefs };

