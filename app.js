const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const isValid = require("date-fns/isValid");
const { format } = require("date-fns");
const addDays = require("date-fns/addDays");
const getDay = require("date-fns/getDay");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "eventsData.db");
let db = null;

const openDbAndRunServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server is running at http://localhost:3001");
    });
  } catch (e) {
    console.log(`Db error '${e.message}'`);
  }
};
openDbAndRunServer();

//get events data
app.get("/events/", async (request, response) => {
  const getEventsQuery = `SELECT * FROM events_and_scheduler;`;
  const data = await db.all(getEventsQuery);
  response.status(200);
  response.send(data);
});
//post DATA
app.post("/events/", async (request, response) => {
  const {
    id,
    eventName,
    eventDescription,
    startTime,
    endTime,
    weekDay,
  } = request.body;

  const formattedStartDate = format(new Date(), "yyyy-MM-dd-EEEE");
  let eventStartDay;
  let eventEndDay;
  if (parseInt(weekDay) === getDay(formattedStartDate)) {
    eventStartDay = formattedStartDate;
    eventEndDay = addDays(eventStartDay, 90);
  } else {
    eventStartDay = addDays(
      formattedStartDate,
      getDay(formattedStartDate) - parseInt(weekDay)
    );
    eventEndDay = addDays(eventStartDay, 90);
  }

  const postEvent = `INSERT INTO events_and_scheduler(event_id,event_name,event_description,start_date,start_time,end_time,end_date)
    VALUES ('${id}','${eventName}','${eventDescription}','${eventStartDate}','${startTime}','${endTime}','${eventEndDate}');`;
  await db.run(postEvent);
  response.send("Todo Successfully Added");
});
