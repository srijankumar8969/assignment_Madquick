# 🔐 Secure Vault - Password Manager

A modern, full-stack password manager built with Next.js 14, featuring secure authentication, password generation, and encrypted storage.

## ✨ Features

### 🔑 Authentication
- Secure email and password-based authentication
- JWT session management with NextAuth.js
- Protected routes and API endpoints
- Persistent sessions across devices

### 🎲 Password Generator
- Customizable password length (8-32 characters)
- Multiple character set options:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special symbols (!@#$%^&*)
- Option to exclude similar characters (O/0, l/1, I/i)
- One-click copy to clipboard
- Auto-clear clipboard after 15 seconds for security
- Direct save to vault functionality

### 🗄️ Secure Vault
- Store unlimited passwords with metadata
- Organized dashboard view with all credentials
- Search and filter functionality
- Quick copy password feature
- Edit and delete capabilities
- Secure encryption for stored passwords
- User-friendly interface with dark/light theme support

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **Cryptography:**
  - **bcryptjs** - User password hashing (one-way)
  - **crypto-js** - Vault password encryption (AES-256, two-way)
- **UI Components:** Custom components with Lucide icons
- **Theme:** next-themes for dark/light mode

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/srijankumar8969/assignment_Madquick.git
   cd assignment_Madquick
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

   # NextAuth Configuration
   NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
   NEXTAUTH_URL=http://localhost:3000

   # Node Environment
   NODE_ENV=development
   ```

   **Generate a secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
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
```

## 🎯 Usage

### Creating an Account
1. Navigate to the **Sign Up** page
2. Enter your email and password
3. Click "Sign Up" - you'll be automatically logged in
4. Redirected to your secure vault

### Generating a Password
1. Go to the **Password Generator** page
2. Adjust the length slider (8-32 characters)
3. Select character types (uppercase, lowercase, numbers, symbols)
4. Optionally exclude similar characters
5. Click **Generate** to create a password
6. Click **Copy** to copy to clipboard (auto-clears after 15s)
7. Click **Save to Vault** to store it securely

### Managing Your Vault
1. Access your vault from the dashboard
2. View all stored passwords
3. Use the search bar to find specific entries
4. Click the **copy icon** to copy passwords
5. Edit or delete entries as needed

## 🔒 Security Features

### Password Encryption & Hashing
- **bcryptjs for User Authentication:** User account passwords are hashed using bcryptjs with salt rounds, making them irreversible and secure against rainbow table attacks
- **Crypto-JS for Vault Encryption:** Stored vault passwords are encrypted using AES-256 encryption via crypto-js, ensuring that even if the database is compromised, passwords remain unreadable
- **JWT Sessions:** Secure token-based authentication with NextAuth.js
- **HTTP-Only Cookies:** Session tokens stored in secure, HTTP-only cookies
- **Auto-Clear Clipboard:** Copied passwords automatically cleared after 15 seconds
- **Protected Routes:** Unauthorized users redirected to sign-in page
- **Environment Variables:** Sensitive data stored in environment variables

### Why Two Different Cryptographic Libraries?

#### bcryptjs for User Passwords (Hashing)
**Purpose:** One-way authentication  
**Use Case:** User login credentials

- **One-way function:** Cannot be decrypted, only verified
- **Slow by design:** Intentionally computationally expensive to prevent brute-force attacks
- **Built-in salting:** Each password gets a unique salt, preventing identical passwords from having the same hash
- **Adaptive cost:** Can increase complexity as hardware improves
- **Perfect for authentication:** We never need to retrieve the original password, only verify if the entered password matches

```typescript
// Hashing on signup
const hashedPassword = await bcrypt.hash(password, 10);

// Verification on login
const isValid = await bcrypt.compare(enteredPassword, hashedPassword);
```

#### Crypto-JS for Vault Passwords (Encryption)
**Purpose:** Two-way secure storage  
**Use Case:** Storing user's saved passwords in the vault

- **Reversible encryption:** Can decrypt to retrieve the original password
- **AES-256 encryption:** Industry-standard symmetric encryption
- **Fast operations:** Efficient for frequent encryption/decryption
- **User needs access:** Unlike authentication, users need to view their stored passwords
- **Secure storage:** Encrypted in database, decrypted only when user requests

```typescript
// Encrypting before storage
const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

// Decrypting when displaying
const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY).toString(CryptoJS.enc.Utf8);
```

#### Key Differences

| Feature | bcryptjs (User Auth) | Crypto-JS (Vault Storage) |
|---------|---------------------|---------------------------|
| **Type** | One-way hash | Two-way encryption |
| **Reversible** | ❌ No | ✅ Yes |
| **Speed** | Slow (intentional) | Fast |
| **Use Case** | Authentication | Data storage |
| **Output** | Fixed-length hash | Variable-length ciphertext |
| **Purpose** | Verify credentials | Protect stored data |

This dual-approach security model ensures:
1. User accounts are protected with battle-tested authentication hashing
2. Stored passwords remain accessible to legitimate users while encrypted at rest
3. Each layer uses the most appropriate cryptographic method for its specific purpose

## 🌐 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Configure Environment Variables**
   
   Add the following in Vercel Dashboard → Settings → Environment Variables:
   ```
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be live in minutes!

## 🐛 Troubleshooting

### Redirect Issues After Login
- Ensure `NEXTAUTH_URL` matches your production URL exactly
- Check that cookies are enabled in your browser
- Verify MongoDB connection is active

### Database Connection Errors
- Confirm `MONGODB_URI` is correct
- Check your MongoDB Atlas IP whitelist (add `0.0.0.0/0` for development)
- Ensure database user has read/write permissions

### Build Errors
- Run `npm run build` locally to catch issues
- Check TypeScript errors with `npm run type-check`
- Verify all environment variables are set

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Srijan Kumar**
- GitHub: [@srijankumar8969](https://github.com/srijankumar8969)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Lucide Icons](https://lucide.dev/)

---

⭐ If you found this project helpful, please give it a star!

**Built with ❤️ for MadQuick Assignment**
