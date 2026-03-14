const Imap = require('node-imap')
const { simpleParser } = require('mailparser')
const { htmlToText } = require('html-to-text')
const { getDB } = require('../config/database')
const scheduleInterview = require('./calendarService')

// AI categorizer
const categorizeEmail = require('./aiService')

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS


// Save email to database
const saveEmail = async (uid, sender, subject, body, date, category) => {

  try {

    const db = getDB()

    const result = await db.run(
      `INSERT OR IGNORE INTO emails
      (uid, account, sender, subject, body, folder, email_date, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uid,
        EMAIL_USER,
        sender,
        subject,
        body,
        'INBOX',
        date,
        category
      ]
    )

    // return true if inserted
    return result.changes > 0

  } catch (err) {

    console.log('DB insert error:', err.message)
    return false

  }

}


// Process email message
const processEmail = (msg) => {

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

      // Prefer HTML emails
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

      // Remove common email footers
      body = body.replace(/unsubscribe[\s\S]*/gi, '')
      body = body.replace(/this is a system generated email[\s\S]*/gi, '')
      body = body.replace(/you are receiving this email[\s\S]*/gi, '')

      // Clean whitespace
      body = body.replace(/\s+/g, ' ').trim()

      // Limit body length
      body = body.substring(0, 1500)

      const emailDate = parsed.date ? parsed.date.toISOString() : ''

      // Categorize email
      const category = categorizeEmail(subject, body)

      // Save email
      const inserted = await saveEmail(uid, sender, subject, body, emailDate, category)

      // Only schedule if it's a new email
      if (inserted && category === "Meeting Booked") {

        await scheduleInterview(subject, body)

      }

      console.log('New Email Stored:', subject, '| Category:', category)

    })

  })

}


// Start IMAP sync
const startImapSync = () => {

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


  const openInbox = cb => {
    imap.openBox('INBOX', false, cb)
  }


  imap.once('ready', () => {

    console.log('IMAP connected')

    openInbox(err => {

      if (err) {

        console.log('Inbox error:', err)
        imap.end()
        return

      }

      console.log('Inbox opened and listening for new emails...')

      // Triggered when new emails arrive
        imap.on('mail', numNewMsgs => {

            console.log(`New email received (${numNewMsgs})`)

            const fetch = imap.fetch('*', {
                bodies: '',
                struct: true
            })

            fetch.on('message', processEmail)

            fetch.once('error', err => {
                console.log('Fetch error:', err)
            })

        })

    })

  })


  imap.once('error', err => {

    console.log('IMAP error:', err)

  })


  // Auto reconnect if connection drops
  imap.once('end', () => {

    console.log('IMAP connection closed. Reconnecting in 5 seconds...')

    setTimeout(startImapSync, 5000)

  })


  console.log('IMAP sync started')

  imap.connect()

}


module.exports = startImapSync