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