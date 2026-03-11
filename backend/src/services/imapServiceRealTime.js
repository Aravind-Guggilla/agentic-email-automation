const Imap = require('node-imap')
const {simpleParser} = require('mailparser')
const {getDB} = require('../config/database')

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

// Track last processed UID to fetch only new emails
let lastUID = 0

// Create IMAP connection
const imap = new Imap({
  user: "aravindguggilla11@gmail.com",
  password: "aefewghryj",
  host: 'imap.gmail.com',
  port: 993,
  tls: true,
  keepalive: true,
})


// Open INBOX folder
const openInbox = cb => {
  imap.openBox('INBOX', false, cb)
}


// Store email in database (duplicates avoided using UID UNIQUE constraint)
const saveEmail = async (uid, sender, subject, body, date) => {
  try {
    const db = getDB()

    const insertQuery = `
      INSERT OR IGNORE INTO emails
      (uid, account, sender, subject, body, folder, email_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    // using placeholders to prevent SQL injection and below values are passed as an array to match the placeholders
    await db.run(insertQuery, [
      uid,
      EMAIL_USER,
      sender,
      subject,
      body,
      'INBOX',
      date,
    ])
  } catch (err) {
    console.log('DB insert error:', err.message)
  }
}


// Fetch emails using UID range
const fetchEmails = range => {
  const fetch = imap.fetch(range, {
    bodies: '',
    struct: true,
  })

  fetch.on('message', msg => {
    let uid = null

    // Get UID of email
    msg.once('attributes', attrs => {
      uid = attrs.uid

      if (uid > lastUID) {
        lastUID = uid
      }
    })

    // Parse email body
    msg.on('body', stream => {
      simpleParser(stream, async (err, parsed) => {
        if (err) {
          console.log('Parse error:', err)
          return
        }

        const sender = parsed.from?.text || ''
        const subject = parsed.subject || ''
        const body = parsed.text || ''
        const date = parsed.date || ''

        await saveEmail(uid, sender, subject, body, date)

        console.log('Email stored:', subject)
      })
    })
  })

  fetch.once('error', err => {
    console.log('Fetch error:', err)
  })
}



// Fetch emails from last 30 days
const fetchLast30DaysEmails = () => {

  const date = new Date()
  date.setDate(date.getDate() - 30)

  // IMAP date format example: 01-Jan-2026
  const sinceDate = date.toISOString().split('T')[0]

  imap.search(['SINCE', sinceDate], (err, results) => {
    if (err) {
      console.log('Search error:', err)
      return
    }

    if (!results || results.length === 0) {
      console.log('No emails found in last 30 days')
      return
    }

    const fetch = imap.fetch(results, {
      bodies: '',
      struct: true,
    })

    fetch.on('message', msg => {
      let uid = null

      msg.once('attributes', attrs => {
        uid = attrs.uid

        if (uid > lastUID) {
          lastUID = uid
        }
      })

      msg.on('body', stream => {
        simpleParser(stream, async (err, parsed) => {
          if (err) {
            console.log('Parse error:', err)
            return
          }

          const sender = parsed.from?.text || ''
          const subject = parsed.subject || ''
          const body = parsed.text || ''
          const date = parsed.date || ''

          await saveEmail(uid, sender, subject, body, date)

          console.log('Stored:', subject)
        })
      })
    })
  })
}


// Start IMAP sync
const startImapSync = () => {

  imap.once('ready', () => {
    console.log('IMAP Connected')

    openInbox((err, box) => {
      if (err) throw err

      console.log('Inbox opened')

      // STEP 1: Fetch only last 30 days emails
      fetchLast30DaysEmails()

      // STEP 2: Enter IDLE mode and listen for new emails
      imap.on('mail', () => {
        console.log('New email detected')

        const range = `${lastUID + 1}:*`

        fetchEmails(range)
      })
    })
  })


  // Handle connection errors
  imap.once('error', err => {
    console.log('IMAP error:', err)
  })


  // Reconnect automatically if connection ends
  imap.once('end', () => {
    console.log('IMAP connection ended. Reconnecting in 5 seconds...')

    setTimeout(() => {
      imap.connect()
    }, 5000)
  })


  imap.connect()
}

module.exports = startImapSync