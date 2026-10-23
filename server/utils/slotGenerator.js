// Automatic Time Slot Generator based on Doctor working hours and break periods

function parseTimeToMinutes(timeStr) {
  // e.g. "09:30 AM", "01:00 PM", "14:00"
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3] ? match[3].toUpperCase() : null;

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function formatMinutesToTime(totalMinutes) {
  let hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const modifier = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedHours = hours < 10 ? `0${hours}` : hours;
  return `${paddedHours}:${paddedMinutes} ${modifier}`;
}

function generateTimeSlots(
  startTime = '09:00 AM',
  endTime = '05:00 PM',
  slotDuration = 30,
  breakStartTime = '01:00 PM',
  breakEndTime = '02:00 PM'
) {
  const startMin = parseTimeToMinutes(startTime);
  const endMin = parseTimeToMinutes(endTime);
  const breakStartMin = breakStartTime ? parseTimeToMinutes(breakStartTime) : null;
  const breakEndMin = breakEndTime ? parseTimeToMinutes(breakEndTime) : null;

  const slots = [];
  let currentMin = startMin;

  while (currentMin + slotDuration <= endMin) {
    const slotEndMin = currentMin + slotDuration;

    // Check if current slot falls inside doctor break time
    const isInsideBreak =
      breakStartMin !== null &&
      breakEndMin !== null &&
      currentMin >= breakStartMin &&
      currentMin < breakEndMin;

    if (!isInsideBreak) {
      slots.push({
        time: formatMinutesToTime(currentMin),
        isBooked: false,
        appointmentId: null,
      });
    }

    currentMin += slotDuration;
  }

  return slots;
}

module.exports = {
  parseTimeToMinutes,
  formatMinutesToTime,
  generateTimeSlots,
};
