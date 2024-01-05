console.log(new Date())
console.log(new Date(new Date() + 5.5 * 60 * 60 * 1000)) // d h m s ms

// const pastHour = new Date(currentDate.getTime() - 1 * 60 * 60 * 1000);
//   const pastDate = new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000);
//   const pastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);


// Create a Date object using the UTC date string
const dateObj = new Date();

// Calculate the IST offset in minutes (+5 hours and 30 minutes)
const istOffsetMinutes = 330;

// Adjust the date's UTC time by adding the IST offset
dateObj.setUTCMinutes(dateObj.getUTCMinutes() + istOffsetMinutes);

// Format the date in the desired format
// const formattedDate = dateObj.toISOString().replace('Z', '');

console.log(dateObj)