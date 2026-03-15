const chrono = require('chrono-node')
const { google } = require('googleapis')

const credentials = require('../config/credentials.json')

const authClient = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/calendar'],
})

const calendar = google.calendar({
  version: 'v3',
  auth: authClient
})


const scheduleInterview = async (subject, body) => {

  try {

    const text = (subject + " " + body).toLowerCase()
    // Check for interview-related keywords in the email content
    const interviewKeywords = [  // Add more keywords as needed 
      "interview",
      "meeting",
      "discussion",
      "zoom",
      "teams",
      "google meet"
    ]

    const isInterview = interviewKeywords.some(word =>
      text.includes(word)
    )

    if (!isInterview) {
      console.log("Not an interview event")
      return
    }

    const parsedDate = chrono.parseDate(text)

    if (!parsedDate) {
      console.log("No date detected")
      return
    }

    console.log("Interview detected at:", parsedDate)

    const event = {
      summary: subject || "Interview Event",
      description: body,
      start: {
        dateTime: parsedDate.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(parsedDate.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: "Asia/Kolkata",
      },
    }

    await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    })

    console.log("Calendar event created")

  } catch (error) {

    console.log("Calendar scheduling error:", error.message)

  }

}

module.exports = scheduleInterview 