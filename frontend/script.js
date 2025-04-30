const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn"),
  addEventInvite = document.querySelector(".event-invite-email");
  invitedEmails = new Set();

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Time utility functions
function convertTime(time) {
  let timeArr = time.split(":");
  let timeHour = parseInt(timeArr[0]);
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  return timeHour + ":" + timeMin + " " + timeFormat;
}

function parseEventTime(timeStr, event) {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours);
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return new Date(event.year, event.month - 1, event.day, hours, parseInt(minutes));
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${hours}:${minutes} ${period}`;
}

// Initialize empty events array and load events
const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day after month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  if (!getUserEmail()) return; // Check if user is logged in
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
      if (
          date === event.day &&
          month + 1 === event.month &&
          year === event.year
      ) {
          event.events.forEach((evt) => {
              const userEmail = getUserEmail();
              const isCreator = evt.creator === userEmail;
              const isInvited = evt.invited && evt.invited.includes(userEmail);

              events += `
                  <div class="event" data-id="${evt.id}">
                      <div class="title">
                          <i class="fas fa-circle"></i>
                          <h3 class="event-title">${evt.title}</h3>
                      </div>
                      <div class="event-time">
                          ${evt.time}
                          ${isCreator ? 
                              '<span class="creator-badge">Creator</span>' : 
                              (isInvited ? '<span class="invited-badge">Invited</span>' : '')
                          }
                      </div>
                      ${isCreator && evt.invited && evt.invited.length > 0 ? `
                          <div class="event-invitees">
                              Invited: ${evt.invited.join(', ')}
                          </div>
                      ` : ''}
                  </div>`;
          });
      }
  });
  
  if (events === "") {
      events = `
          <div class="no-event">
              <h3>No Events</h3>
          </div>`;
  }
  eventsContainer.innerHTML = events;
}

//function to add event
addEventBtn.addEventListener("click", () => {
  if (!getUserEmail()) return; // Check if user is logged in
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  addEventInvite.value = "";
  invitedEmails.clear();
  const inviteList = document.querySelector('.invite-list');
  if (inviteList) {
    inviteList.innerHTML = '';
  }
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML =
    "A Project By Infinite Loopers";
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", async () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  const userEmail = getUserEmail();

  if (!userEmail) {
      alert("Please login first");
      return;
  }

  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
      alert("Please fill all the fields");
      return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
  ) {
      alert("Invalid Time Format");
      return;
  }

  // Create date objects for the event times
  const startTime = new Date(year, month, activeDay);
  startTime.setHours(parseInt(timeFromArr[0]), parseInt(timeFromArr[1]));

  const endTime = new Date(year, month, activeDay);
  endTime.setHours(parseInt(timeToArr[0]), parseInt(timeToArr[1]));

  // Prepare invited emails array
  const invitedEmailsArray = Array.from(invitedEmails);

  try {
      console.log('Sending event data:', {
          Title: eventTitle,
          email: userEmail,
          StartTime: startTime.toISOString(),
          EndTime: endTime.toISOString(),
          Invited: invitedEmailsArray
      });

      const response = await fetch(`${config.apiUrl}/api/schedule/add`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              Title: eventTitle,
              email: userEmail,
              StartTime: startTime.toISOString(),
              EndTime: endTime.toISOString(),
              Invited: invitedEmailsArray
          })
      });

      const data = await response.json();
      console.log('Server response:', data);

      if (data.success) {
          // Clear form and UI
          addEventWrapper.classList.remove("active");
          addEventTitle.value = "";
          addEventFrom.value = "";
          addEventTo.value = "";
          addEventInvite.value = "";
          invitedEmails.clear();
          updateInviteList();

          // Refresh events
          await getEvents();
          updateEvents(activeDay);

          // Update UI
          const activeDayEl = document.querySelector(".day.active");
          if (!activeDayEl.classList.contains("event")) {
              activeDayEl.classList.add("event");
          }
      } else {
          alert(data.message || "Failed to add event");
      }
  } catch (error) {
      console.error('Error adding event:', error);
      alert("Failed to add event. Please try again.");
  }
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

function createInviteList() {
  const container = document.createElement('div');
  container.className = 'invite-list';
  addEventInvite.parentNode.appendChild(container);
  return container;
}

// Add email validation function
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Add invite handling
addEventSubmit.addEventListener("click", async () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  const userEmail = getUserEmail();

  if (!userEmail) {
      alert("Please login first");
      return;
  }

  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
      alert("Please fill all the fields");
      return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
      timeFromArr.length !== 2 ||
      timeToArr.length !== 2 ||
      timeFromArr[0] > 23 ||
      timeFromArr[1] > 59 ||
      timeToArr[0] > 23 ||
      timeToArr[1] > 59
  ) {
      alert("Invalid Time Format");
      return;
  }

  // Create date objects for the event times
  const startTime = new Date(year, month, activeDay);
  startTime.setHours(parseInt(timeFromArr[0]), parseInt(timeFromArr[1]));

  const endTime = new Date(year, month, activeDay);
  endTime.setHours(parseInt(timeToArr[0]), parseInt(timeToArr[1]));

  // Prepare invited emails array
  const invitedEmailsArray = Array.from(invitedEmails);

  try {
      const response = await fetch(`${config.apiUrl}/api/schedule/add`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              Title: eventTitle,
              email: userEmail,
              Description: "", // You can add a description field if needed
              StartTime: startTime.toISOString(),
              EndTime: endTime.toISOString(),
              Invited: invitedEmailsArray
          })
      });

      const data = await response.json();

      if (data.success) {
          // Clear form
          addEventWrapper.classList.remove("active");
          addEventTitle.value = "";
          addEventFrom.value = "";
          addEventTo.value = "";
          addEventInvite.value = "";
          invitedEmails.clear();
          
          // Clear invite list
          const inviteList = document.querySelector('.invite-list');
          if (inviteList) {
              inviteList.innerHTML = '';
          }

          // Refresh events
          await getEvents();
          updateEvents(activeDay);

          // Update UI
          const activeDayEl = document.querySelector(".day.active");
          if (!activeDayEl.classList.contains("event")) {
              activeDayEl.classList.add("event");
          }
      } else {
          alert(data.message || "Failed to add event");
      }
  } catch (error) {
      console.error('Error adding event:', error);
      alert("Failed to add event. Please try again.");
  }
});

// Handle invite email input
addEventInvite.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
      const email = e.target.value.trim();
      if (email && isValidEmail(email)) {
          invitedEmails.add(email);
          e.target.value = '';
          updateInviteList();
      } else {
          alert('Please enter a valid email address');
      }
  }
});

// Function to update the invite list display
function updateInviteList() {
  const inviteList = document.querySelector('.invite-list');
  inviteList.innerHTML = '';
  invitedEmails.forEach(email => {
      const chip = document.createElement('div');
      chip.className = 'invite-chip';
      chip.innerHTML = `
          ${email}
          <span class="remove" onclick="removeInvite('${email}')">&times;</span>
      `;
      inviteList.appendChild(chip);
  });
}

// Function to remove an invite
function removeInvite(email) {
  invitedEmails.delete(email);
  updateInviteList();
}

// Add email validation function if not already present
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

//function to save events in local storage
async function getEvents() {
  const email = getUserEmail();
  if (!email) {
      console.error('No user email found');
      return;
  }

  try {
      const response = await fetch(`${config.apiUrl}/api/schedule/all`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch events');
      }

      const data = await response.json();
      if (data.success && data.schedules) {
          // Clear existing events
          eventsArr.length = 0;
          
          // Create a map to store events by date
          const eventsByDate = new Map();
          
          // Convert backend format to frontend format and group by date
          data.schedules.forEach(schedule => {
              const startDate = new Date(schedule.StartTime);
              const endDate = new Date(schedule.EndTime);
              
              const dateKey = `${startDate.getDate()}-${startDate.getMonth()}-${startDate.getFullYear()}`;
              
              if (!eventsByDate.has(dateKey)) {
                  eventsByDate.set(dateKey, {
                      day: startDate.getDate(),
                      month: startDate.getMonth() + 1,
                      year: startDate.getFullYear(),
                      events: []
                  });
              }
              
              eventsByDate.get(dateKey).events.push({
                  id: schedule._id,
                  title: schedule.Title,
                  time: `${formatTime(startDate)} - ${formatTime(endDate)}`,
                  description: schedule.Description,
                  creator: schedule.Creator.email,
                  invited: schedule.Invited,
                  isCreator: schedule.isCreator,
                  isInvited: schedule.isInvited
              });
          });
          
          // Convert map values to array
          eventsArr.push(...eventsByDate.values());
          
          initCalendar(); // Refresh calendar display
      }
  } catch (err) {
      console.error('Error fetching events:', err);
      alert('Error loading events. Please try again.');
  }
}

// Update getEvents function to properly format received events
async function getEvents() {
  const email = getUserEmail();
  if (!email) {
      console.error('No user email found');
      return;
  }

  try {
      const response = await fetch(`${config.apiUrl}/api/schedule/all`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch events');
      }

      const data = await response.json();
      if (data.success && data.schedules) {
          // Clear existing events
          eventsArr.length = 0;
          
          // Create a map to store events by date
          const eventsByDate = new Map();
          
          // Convert backend format to frontend format and group by date
          data.schedules.forEach(schedule => {
              const startDate = new Date(schedule.StartTime);
              const endDate = new Date(schedule.EndTime);
              
              const dateKey = `${startDate.getDate()}-${startDate.getMonth()}-${startDate.getFullYear()}`;
              
              if (!eventsByDate.has(dateKey)) {
                  eventsByDate.set(dateKey, {
                      day: startDate.getDate(),
                      month: startDate.getMonth() + 1,
                      year: startDate.getFullYear(),
                      events: []
                  });
              }
              
              eventsByDate.get(dateKey).events.push({
                  title: schedule.Title,
                  time: `${formatTime(startDate)} - ${formatTime(endDate)}`
              });
          });
          
          // Convert map values to array
          eventsArr.push(...eventsByDate.values());
          
          initCalendar(); // Refresh calendar display
      }
  } catch (err) {
      console.error('Error fetching events:', err);
      alert('Error loading events. Please try again.');
  }
}

window.onload = () => {
    if (!getUserEmail()) {
        return; // This will redirect to login if not logged in
    }
    initCalendar();
};
