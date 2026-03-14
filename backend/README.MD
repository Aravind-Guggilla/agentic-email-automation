backend
│
├── src
│   │
│   ├── config
│   │   └── database.js          # SQLite connection & DB initialization
│   │
│   ├── controllers
│   │   └── emailController.js   # Handles API requests related to emails
│   │
│   ├── routes
│   │   └── emailRoutes.js       # Express routes for email APIs
│   │
│   ├── services
│   │   ├── imapService.js       # IMAP connection, fetch & sync emails
│   │   └── emailService.js      # DB queries related to emails
│   │
│   ├── utils
│   │   └── emailParser.js       # helper functions for parsing emails
│   │
│   ├── models
│   │   └── emailSchema.js       # DB schema creation for emails table
│   │
│   └── index.js                 # Express server entry point
│
├── emails.db                    # SQLite database file
│
├── .env                         # environment variables
│
├── package.json
│
└── README.md

# AI Onebox Email Assistant

An AI-powered backend system that automatically syncs emails, categorizes them, suggests replies using LLMs, and schedules meetings directly into Google Calendar.

This project demonstrates modern backend engineering patterns including:

- IMAP email synchronization
- email parsing and storage
- AI categorization
- automation workflows
- LLM-based reply generation
- automatic calendar scheduling

The system behaves like a **basic AI email assistant backend**.

---

# Architecture Overview

            Gmail
              │
              ▼
         IMAP Sync
        (node-imap)
              │
              ▼
         Email Parser
         (mailparser)
              │
              ▼
          SQLite DB
              │
    ┌─────────┴─────────┐
    ▼                   ▼

AI Categorization Reply Generation
(Node AI) (Gemini + Flask)
│ │
▼ ▼
Automation Layer Suggested Reply
│
▼
Calendar Scheduling
│
▼
Google Calendar API


---

# Tech Stack

## Backend
- Node.js
- Express.js
- SQLite
- node-imap
- mailparser
- chrono-node
- googleapis
- axios

## AI Service
- Python
- Flask
- Gemini LLM

---

# Project Structure


backend
│
├── src
│ ├── config
│ │ ├── database.js
│ │ └── credentials.json
│ │
│ ├── controllers
│ │ └── emailController.js
│ │
│ ├── routes
│ │ └── emailRoutes.js
│ │
│ ├── services
│ │ ├── imapService.js
│ │ ├── aiService.js
│ │ ├── aiReplyService.js
│ │ └── calendarService.js
│ │
│ └── index.js
│
├── oneBoxEmails.db
└── package.json

ai-service
│
├── app.py
└── requirements.txt


---

# Features

## 1. Email Synchronization

Emails are synced from Gmail using IMAP.

Capabilities:

- Connect to Gmail inbox
- Fetch emails from last 30 days
- Parse subject, sender, body
- Store emails in database
- Prevent duplicate storage using UID

Libraries used:


node-imap
mailparser


---

## 2. Email Storage

Emails are stored in SQLite.

Database schema:

```sql
CREATE TABLE emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  uid INTEGER UNIQUE,
  account TEXT,
  sender TEXT,
  subject TEXT,
  body TEXT,
  folder TEXT,
  email_date TEXT,
  category TEXT
);
3. Email APIs

The backend exposes APIs to retrieve emails.

Get all emails
GET /emails
Search emails
GET /emails/search?q=keyword
Paginated emails
GET /emails?page=1&limit=20
Get email by ID
GET /emails/:id
Generate AI reply
GET /emails/:id/reply
4. AI Email Categorization

Emails are automatically categorized.

Categories include:

Interested
Meeting Booked
Not Interested
Spam
Out of Office
General

Example:

Subject: Product Demo Request
Category: Interested
5. AI Reply Suggestions (RAG)

The system can generate suggested replies using Gemini.

Architecture:

Node Backend
      │
      ▼
Flask AI Service
      │
      ▼
Gemini LLM
      │
      ▼
Suggested Reply

Example API response:

{
  "reply": "Thank you for reaching out. I would be happy to schedule a meeting."
}
6. Interview Detection

Emails categorized as Meeting Booked are analyzed to detect meeting or interview times.

Date extraction uses:

chrono-node

Example email:

Your interview is scheduled on March 20 at 3 PM

Detected time:

2026-03-20T15:00:00
7. Automatic Calendar Scheduling

If a meeting or interview is detected, the system automatically creates a Google Calendar event.

Workflow:

Email arrives
   ↓
AI categorization
   ↓
Meeting detected
   ↓
Date extracted
   ↓
Google Calendar event created

Example event:

Title: Interview Invitation
Time: March 20, 3:00 PM
Duration: 1 hour
Setup Instructions
1. Clone Repository
git clone <repository-url>
cd backend
2. Install Dependencies
npm install

Installed packages include:

express
sqlite
sqlite3
node-imap
mailparser
chrono-node
googleapis
axios
cors
dotenv
3. Environment Variables

Create a .env file inside the backend folder.

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
AI_SERVICE_URL=http://localhost:5001
PORT=3000
4. Run Backend
npm run dev

Backend runs at:

http://localhost:3000
AI Service Setup

Navigate to the AI service folder:

cd ai-service

Install dependencies:

pip install flask google-generativeai

Run the AI service:

python app.py

AI service runs on:

http://localhost:5001
Google Calendar Integration
1. Create Google Cloud Project

Open:

https://console.cloud.google.com

Create a new project.

2. Enable Google Calendar API

Navigate to:

APIs & Services → Library

Search for:

Google Calendar API

Click Enable.

3. Create Service Account

Navigate to:

APIs & Services → Credentials

Create:

Service Account

Example name:

calendar-bot
4. Generate Credentials

Open the service account.

Go to:

Keys → Add Key → JSON

Download the file.

Rename it:

credentials.json

Place it inside:

backend/src/config/
5. Share Calendar With Service Account

Open Google Calendar:

https://calendar.google.com

Under Share with specific people, add:

calendar-bot@project-id.iam.gserviceaccount.com

Permission:

Make changes to events
Testing

Send an email like:

Subject: Interview Invitation

Hi,
Your interview is scheduled on March 20 at 3 PM.

Expected backend output:

Interview detected at: 2026-03-20T09:30:00
Calendar event created
Stored: Interview Invitation | Category: Meeting Booked

A new event will appear in Google Calendar.

Example Workflow
Email arrives
     ↓
IMAP sync
     ↓
Email stored in DB
     ↓
AI categorization
     ↓
Meeting detected
     ↓
Calendar event created
     ↓
User can request AI reply suggestion

Project Status
Feature	Status
IMAP Email Sync	Complete
Database Storage	Complete
Search APIs	Complete
Pagination	Complete
AI Categorization	Complete
AI Reply Suggestions	Complete
Interview Detection	Complete
Google Calendar Automation	Complete

Backend Completion: 100%