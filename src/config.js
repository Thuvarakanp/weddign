// Single source of truth for the event's date/time and external links.
// Venue is on Canada/US Eastern time. Oct 25 2026 falls before DST ends
// (first Sunday of November), so the venue is on EDT = UTC-4.
// 6:30 PM EDT == 22:30 UTC — stored as a fixed UTC instant so every guest's
// countdown reaches zero at the same real moment, regardless of their own
// device timezone.
export const EVENT_START_UTC = Date.UTC(2026, 9, 25, 22, 30, 0);
export const EVENT_END_UTC = Date.UTC(2026, 9, 26, 2, 30, 0); // +4h estimated duration

export const VENUE_NAME = "J & J Swagat Convention Center";
export const HALL_NAME = "Prince Hall";
export const VENUE_ADDRESS = "415 Hood Road, Markham, Ontario, L3R 3W2";
export const RSVP_CONTACT = "Nirosan";
export const RSVP_PHONE = "+16478016462";
export const RSVP_DISPLAY_PHONE = "+1 (647) 801-6462";
export const MAP_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(`${VENUE_NAME} ${VENUE_ADDRESS}`)}&output=embed`;


export const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${VENUE_NAME} ${VENUE_ADDRESS}`
)}`;

function toGCalStamp(ms) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export const ADD_TO_CALENDAR_URL =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent("Nirosan & Sajitha's Engagement")}` +
  `&dates=${toGCalStamp(EVENT_START_UTC)}/${toGCalStamp(EVENT_END_UTC)}` +
  `&details=${encodeURIComponent("We would be honoured to have you with us as we celebrate our engagement.")}` +
  `&location=${encodeURIComponent(`${HALL_NAME}, ${VENUE_NAME}, ${VENUE_ADDRESS}`)}`;
