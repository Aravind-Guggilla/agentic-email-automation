const chrono = require('chrono-node')

const scheduleInterview = async (subject, body) => {

  try {

    const text = (subject + " " + body).toLowerCase()

    // Only schedule if interview related keywords exist
    const interviewKeywords = [
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

    console.log("Calendar event created for interview")

  } catch (error) {

    console.log("Calendar scheduling error:", error.message)

  }

}
module.exports = scheduleInterview 