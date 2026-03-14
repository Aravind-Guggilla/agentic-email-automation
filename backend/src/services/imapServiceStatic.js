const Imap = require('node-imap')
const { simpleParser } = require('mailparser')
const { htmlToText } = require('html-to-text')
const { getDB } = require('../config/database')
const scheduleInterview = require('./calendarService')

// NEW: AI categorizer
const categorizeEmail = require('./aiService')

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS


// Create IMAP connection
const imap = new Imap({
  user: EMAIL_USER,
  password: EMAIL_PASS,
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  connTimeout: 30000,
  authTimeout: 30000,
  keepalive: {
    interval: 10000,
    idleInterval: 300000,
    forceNoop: true
  }
})


// Open inbox
const openInbox = cb => {
  imap.openBox('INBOX', false, cb)
}


// Save email to database
const saveEmail = async (uid, sender, subject, body, date, category) => {
  try {
    const db = getDB()

    const insertQuery = `
      INSERT OR IGNORE INTO emails
      (uid, account, sender, subject, body, folder, email_date, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `

    await db.run(insertQuery, [
      uid,
      EMAIL_USER,
      sender,
      subject,
      body,
      'INBOX',
      date,
      category  
    ])

  } catch (err) {
    console.log('DB insert error:', err.message)
  }
}


// Fetch emails from last 30 days
const fetchLast30DaysEmails = () => {

  const date = new Date()
  date.setDate(date.getDate() - 30)

  const day = date.getDate()
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  const sinceDate = `${day}-${month}-${year}`

  console.log("Fetching emails since:", sinceDate)

  imap.search([['SINCE', sinceDate]], (err, results) => {

    if (err) {
      console.log('Search error:', err)
      imap.end()
      return
    }

    if (!results || results.length === 0) {
      console.log('No emails found in last 30 days')
      imap.end()
      return
    }

    const fetch = imap.fetch(results, { bodies: '' })

    fetch.on('message', msg => {

      let uid = null

      msg.once('attributes', attrs => {
        uid = attrs.uid
      })

      msg.on('body', stream => {

        simpleParser(stream, async (err, parsed) => {

          if (err) {
            console.log('Parse error:', err)
            return
          }

          const sender = parsed.from?.text || ''
          const subject = parsed.subject || '(No Subject)'

          let body = ''

          // Prefer HTML conversion (most emails are HTML)
          if (parsed.html) {
            body = htmlToText(parsed.html, {
              wordwrap: 130,
              selectors: [
                { selector: 'img', format: 'skip' },
                { selector: 'a', options: { ignoreHref: true } }
              ]
            })
          } else if (parsed.text) {
            body = parsed.text
          }

          // Remove common footer sections
          body = body.replace(/unsubscribe[\s\S]*/gi, '')
          body = body.replace(/this is a system generated email[\s\S]*/gi, '')
          body = body.replace(/you are receiving this email[\s\S]*/gi, '')

          // Clean whitespace
          body = body.replace(/\s+/g, ' ').trim()

          // Limit size
          body = body.substring(0, 1500)

          const emailDate = parsed.date ? parsed.date.toISOString() : ''
          // NEW: categorize email

          const category = categorizeEmail(subject, body)

          await saveEmail(uid, sender, subject, body, emailDate, category)

          // NEW: if it's a meeting booking, schedule it
          if (category === "Meeting Booked") {

              await scheduleInterview(subject, body)

          }

          console.log('Stored:', subject, '| Category:', category)

          // await saveEmail(uid, sender, subject, body, emailDate)

          // console.log('Stored:', subject)

        })
      })
    })

    fetch.once('error', err => {
      console.log('Fetch error:', err)
      imap.end()
    })

    fetch.once('end', () => {
      console.log('Finished fetching emails')
      imap.end()
    })

  })
}


// Start IMAP sync
const startImapSync = () => {

  imap.once('ready', () => {

    console.log('IMAP connected')

    openInbox(err => {

      if (err) {
        console.log('Inbox error:', err)
        imap.end()
        return
      }

      console.log('Inbox opened')

      fetchLast30DaysEmails()

    })
  })


  imap.once('error', err => {
    console.log('IMAP error:', err)
  })


  imap.once('end', () => {
    console.log('IMAP connection closed')
  })


  console.log('IMAP sync started')

  imap.connect()
}


module.exports = startImapSync