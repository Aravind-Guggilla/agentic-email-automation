const categorizeEmail = (subject, body) => {

  const text = (subject + " " + body).toLowerCase()

  if (text.includes("interested") || text.includes("tell me more")) {
    return "Interested"
  }

  if (text.includes("meeting") || text.includes("schedule") || text.includes("demo")) {
    return "Meeting Booked"
  }

  if (text.includes("not interested") || text.includes("remove me")) {
    return "Not Interested"
  }

  if (text.includes("out of office") || text.includes("ooo")) {
    return "Out of Office"
  }

  if (text.includes("lottery") || text.includes("prize") || text.includes("winner")) {
    return "Spam"
  }

  return "General"
}

module.exports = categorizeEmail