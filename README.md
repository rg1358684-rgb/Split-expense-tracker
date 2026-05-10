# 💰 SplitEase — Smart Expense Splitting App

> A full-stack web application to track group expenses, split bills, manage notes, and switch between multiple profiles seamlessly.

---

## 🚀 Live Features

- 🔐 **User Authentication** — Secure Register & Login with bcryptjs password hashing
- 👥 **Group Management** — Create groups, add members, manage currencies
- 💸 **Expense Tracking** — Add, edit, delete expenses with split-among tracking
- 🔀 **Multi-Profile Support** — Switch between profiles with isolated data per profile
- 📝 **Smart Notes** — Personal & group-specific notes saved per profile
- 💱 **Multi-Currency** — INR, USD, EUR, GBP support
- 📱 **Responsive UI** — Clean, modern design for all screen sizes

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React.js | 18+ | UI Framework |
| Vite | Latest | Build Tool |
| React Router DOM | 6+ | Client-side Routing |
| Lucide React | ^1.14.0 | Icon Library |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | Runtime Environment |
| Express.js | ^5.2.1 | Web Framework |
| MongoDB | Latest | NoSQL Database |
| Mongoose | ^9.6.1 | MongoDB ODM |
| bcryptjs | ^3.0.3 | Password Hashing |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| dotenv | ^17.4.2 | Environment Variables |
| nodemon | ^3.1.14 | Development Auto-reload |

---

## 📁 Project Structure

```
split-expense-tracker/
│
├── 📂 controllers/
│   ├── authController.js       # Register & Login logic
│   ├── expenseController.js    # Expense CRUD operations
│   ├── groupController.js      # Group CRUD operations
│   ├── noteController.js       # Notes CRUD operations
│   └── profileController.js   # Profile management
│
├── 📂 models/
│   ├── User.js                 # User schema
│   ├── Group.js                # Group schema with profileId
│   ├── Expense.js              # Expense schema
│   ├── Note.js                 # Note schema with profileId
│   └── Profile.js              # Profile schema
│
├── 📂 routes/
│   ├── authRoutes.js
│   ├── expenseRoutes.js
│   ├── groupRoutes.js
│   ├── noteRoutes.js
│   └── profileRoutes.js
│
├── 📂 frontend/
│   └── src/
│       ├── 📂 components/
│       │   ├── GroupCard.jsx
│       │   ├── Navbar.jsx
│       │   ├── NotesPanel.jsx
│       │   ├── ProfileMenu.jsx
│       │   └── ProtectedRoute.jsx
│       ├── 📂 pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── CreateGroup.jsx
│       │   ├── AddExpense.jsx
│       │   └── AllExpenses.jsx
│       ├── App.jsx
│       └── main.jsx
│
├── server.js
├── .env
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (Local or Atlas)
- Git

### 1️⃣ Clone the repository
```bash
git clone https://github.com/rg1358684-rgb/Split-expense-tracker.git
cd Split-expense-tracker
```

### 2️⃣ Backend Setup
```bash
npm install
```

Create `.env` file in root directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start backend server:
```bash
node server.js
```

### 3️⃣ Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Open in browser
```
http://localhost:5173
```

---

## 🔗 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user + create default profile |
| POST | `/api/auth/login` | Login user + fetch all profiles |

### 👥 Groups
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/groups?userId=&profileId=` | Get groups filtered by profile |
| POST | `/api/groups` | Create new group |
| GET | `/api/groups/:id` | Get group by ID |
| PUT | `/api/groups/:id/notes` | Update group notes |

### 💸 Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/expenses/group/:id` | Get expenses by group |
| POST | `/api/expenses` | Add new expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |

### 📝 Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes?userId=&profileId=` | Get notes filtered by profile |
| POST | `/api/notes` | Create or update note |
| DELETE | `/api/notes/:id` | Delete note |

### 👤 Profiles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profiles?userId=` | Get all profiles of user |
| POST | `/api/profiles` | Create new profile |
| PUT | `/api/profiles/:id` | Update profile |
| DELETE | `/api/profiles/:id` | Delete profile |

---

## 🔒 Security Features

- ✅ Password hashing with **bcryptjs** (salt rounds: 10)
- ✅ CORS protection with **cors** middleware
- ✅ Environment variables with **dotenv**
- ✅ MongoDB ObjectId validation on all routes
- ✅ Protected routes on frontend

---

## 💡 Key Highlights

- **Profile Isolation** — Each profile has completely separate groups, expenses, and notes stored in MongoDB
- **Persistent Data** — All data saved in MongoDB, safe even after logout
- **Auto Profile Setup** — Default profile created automatically on registration
- **Profile-wise Filtering** — Groups and notes filtered by profileId on every API call

---

## 👩‍💻 Developer

**Roshani Gupta**
[![GitHub](https://img.shields.io/badge/GitHub-rg1358684--rgb-181717?style=for-the-badge&logo=github)](https://github.com/rg1358684-rgb)
[![Email](https://img.shields.io/badge/Email-rg1358684@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:rg1358684@gmail.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you like this project, please give it a star on GitHub!**
