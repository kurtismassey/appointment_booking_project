function doGet(e) {
  return HtmlService.createHtmlOutputFromFile("WebApp")
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag("viewport", "width=device-width, initial-scale=1");
}

function CheckSlots(appointmentDay) {
  const startingTime = [
    "09:00",
    "09:40",
    "11:00",
    "13:00",
    "13:50",
    "15:00",
    "15:40",
    "16:20",
  ];
  const endingTime = [
    "09:30",
    "10:10",
    "11:30",
    "13:30",
    "14:20",
    "15:30",
    "16:10",
    "16:50",
  ];
  const notAvailable = [];
  const slotsAvailable = [];
  startingTime.forEach((start, index) => {
    const end = endingTime[index];
    let startTime = `${appointmentDay} ${start}`;
    let endTime = `${appointmentDay} ${end}`;
    startTime = new Date(startTime);
    endTime = new Date(endTime);
    function padTo2Digits(num) {
      return String(num).padStart(2, "0");
    }
    const id = "REPLACE WITH GOOGLE CALENDAR ID";
    const calendar = CalendarApp.getCalendarById(id);
    let eventsList = calendar.getEvents(startTime, endTime);
    let slotTimeHourMinutes =
      padTo2Digits(startTime.getHours()) +
      ":" +
      padTo2Digits(startTime.getMinutes());
    if (!eventsList.length == false) {
      notAvailable.push(slotTimeHourMinutes);
    } else {
      slotsAvailable.push(slotTimeHourMinutes);
      return slotsAvailable;
    }
  });
  return slotsAvailable;
}

function AddAppointment(
  fullname,
  startTime,
  address,
  postcode,
  contact,
  doubleSlot
) {
  const id = "REPLACE WITH GOOGLE CALENDAR ID";
  const calendar = CalendarApp.getCalendarById(id);
  let title = `Appointment - ${fullname}`;
  startTime = new Date(startTime);
  let startTimeTemp = startTime;
  Date.prototype.addMinutes = function (minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
  };
  let endTime = new Date(startTime);
  endTime.addMinutes(30);
  if (doubleSlot === true) {
    doubleSlot = "Yes";
  } else {
    doubleSlot = "No";
  }
  if (doubleSlot == "Yes") {
    endTime.addMinutes(30);
  }
  calendar.createEvent(title, startTime, endTime, {
    description:
      "Full Name: " +
      fullname +
      "\n" +
      "Address: " +
      address +
      "\n" +
      "Postcode: " +
      postcode +
      "\n" +
      "Contact Number: " +
      contact,
  });
}
