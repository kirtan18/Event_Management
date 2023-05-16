CREATE SEQUENCE e_id;

CREATE TABLE events(
    "eventId" INT primary KEY default nextval('e_id'),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    "startDate" TEXT NOT NULL,
    "endDate" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT 
  );