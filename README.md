🔐 Secure Vault - Password Manager
A modern, full-stack password manager built with Next.js 14, featuring secure authentication, password generation, and encrypted storage.
✨ Features
🔑 Authentication

Secure email and password-based authentication
JWT session management with NextAuth.js
Protected routes and API endpoints
Persistent sessions across devices

🎲 Password Generator

Customizable password length (8-32 characters)
Multiple character set options:

Uppercase letters (A-Z)
Lowercase letters (a-z)
Numbers (0-9)
Special symbols (!@#$%^&*)


Option to exclude similar characters (O/0, l/1, I/i)
One-click copy to clipboard
Auto-clear clipboard after 15 seconds for security
Direct save to vault functionality

🗄️ Secure Vault

Store unlimited passwords with metadata
Organized dashboard view with all credentials
Search and filter functionality
Quick copy password feature
Edit and delete capabilities
Secure encryption for stored passwords
User-friendly interface with dark/light theme support

🚀 Tech Stack

Framework: Next.js 14 (App Router)
Language: TypeScript
Styling: Tailwind CSS
Authentication: NextAuth.js
Database: MongoDB with Mongoose
Password Hashing: bcryptjs
UI Components: Custom components with Lucide icons
Theme: next-themes for dark/light mode

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js 18.x or higher
npm or yarn
MongoDB Atlas account (or local MongoDB instance)

🛠️ Installation

Clone the repository

bash   git clone https://github.com/srijankumar8969/assignment_Madquick.git
   cd assignment_Madquick

Install dependencies

bash   npm install
   # or
   yarn install

Set up environment variables
Create a .env.local file in the root directory:

env   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
   NEXTAUTH_URL=http://localhost:3000

   # Node Environment
   NODE_ENV=development
Generate a secure NEXTAUTH_SECRET:
bash   openssl rand -base64 32

Run the development server

bash   npm run dev
   # or
   yarn dev

Open your browser
Navigate to http://localhost:3000

📁 Project Structure
assignment_Madquick/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth API routes
│   │   │   ├── signup/              # User registration
│   │   │   └── vault/               # Vault CRUD operations
│   │   ├── passwordvault/           # Vault dashboard page
│   │   ├── generator/               # Password generator page
│   │   ├── signin/                  # Sign in page
│   │   ├── signup/                  # Sign up page
│   │   └── layout.tsx               # Root layout
│   ├── components/
│   │   ├── Navbar.tsx               # Navigation component
│   │   └── ThemeToggle.tsx          # Theme switcher
│   ├── models/
│   │   ├── User.ts                  # User schema
│   │   └── Vault.ts                 # Vault item schema
│   └── utils/
│       └── db.ts                    # Database connection
├── public/                          # Static assets
├── .env.local                       # Environment variables
└── package.json
🎯 Usage
Creating an Account

Navigate to the Sign Up page
Enter your email and password
Click "Sign Up" - you'll be automatically logged in
Redirected to your secure vault

Generating a Password

Go to the Password Generator page
Adjust the length slider (8-32 characters)
Select character types (uppercase, lowercase, numbers, symbols)
Optionally exclude similar characters
Click Generate to create a password
Click Copy to copy to clipboard (auto-clears after 15s)
Click Save to Vault to store it securely

Managing Your Vault

Access your vault from the dashboard
View all stored passwords
Use the search bar to find specific entries
Click the copy icon to copy passwords
Edit or delete entries as needed

🔒 Security Features

Password Hashing: All passwords are hashed using bcryptjs before storage
JWT Sessions: Secure token-based authentication
HTTP-Only Cookies: Session tokens stored in secure, HTTP-only cookies
Auto-Clear Clipboard: Copied passwords automatically cleared after 15 seconds
Protected Routes: Unauthorized users redirected to sign-in page
Environment Variables: Sensitive data stored in environment variables

🌐 Deployment
Deploy to Vercel

Push your code to GitHub
Import to Vercel

Go to vercel.com
Click "Import Project"
Select your repository


Configure Environment Variables
Add the following in Vercel Dashboard → Settings → Environment Variables:

   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   NODE_ENV=production

Deploy

Click "Deploy"
Your app will be live in minutes!



🐛 Troubleshooting
Redirect Issues After Login

Ensure NEXTAUTH_URL matches your production URL exactly
Check that cookies are enabled in your browser
Verify MongoDB connection is active

Database Connection Errors

Confirm MONGODB_URI is correct
Check your MongoDB Atlas IP whitelist (add 0.0.0.0/0 for development)
Ensure database user has read/write permissions

Build Errors

Run npm run build locally to catch issues
Check TypeScript errors with npm run type-check
Verify all environment variables are set

🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
👤 Author
Srijan Kumar

GitHub: @srijankumar8969
Email: your.email@example.com

🙏 Acknowledgments

Next.js Documentation
NextAuth.js
Tailwind CSS
MongoDB Atlas
Lucide Icons
