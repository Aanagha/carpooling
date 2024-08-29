import React from 'react';

const TimestampDisplay = () => {
  const isoTimestamp = "2024-08-28T00:00:00.000+00:00";

  // Convert the ISO timestamp to a Date object
  const date = new Date(isoTimestamp);

  // Add 5 hours and 30 minutes to the UTC time to get IST
  date.setHours(date.getUTCHours() + 5);
  date.setMinutes(date.getUTCMinutes() + 30);

  // Get the time in IST
  const istTime = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return <p>{istTime}</p>;
};

export default TimestampDisplay;
