<div align="center">

<img src="frontend/public/chatbot.jpg" alt="Prince Care Logo" width="120" style="border-radius:24px"/>

# 🌸 Prince Care — Menstrual Health & Hygiene Platform

> **India's #1 AI-powered menstrual wellness platform.**  
> Empowering women through smart IoT monitoring, AI cycle insights, telemedicine, and sustainable hygiene care.

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=for-the-badge&logo=react)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169e1?style=for-the-badge&logo=postgresql)](https://postgresql.org)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-Proprietary-ff2d95?style=for-the-badge)](#-license)

---

### 🔗 Quick Links

| Resource             | Link                                                                                                                              |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 **Live Demo**     | [prince-care.vercel.app](https://github.com/PriyanshuMohanty2611/MENSTRUAL_HEALTH_-_HYGIENE)                                      |
| 📦 **Repository**    | [github.com/PriyanshuMohanty2611/MENSTRUAL*HEALTH*-\_HYGIENE](https://github.com/PriyanshuMohanty2611/MENSTRUAL_HEALTH_-_HYGIENE) |
| 🐞 **Report Issues** | [Open an Issue](https://github.com/PriyanshuMohanty2611/MENSTRUAL_HEALTH_-_HYGIENE/issues)                                        |
| 📬 **Contact**       | [priyanshu@princecarehealth.in](mailto:priyanshu@princecarehealth.in)                                                             |

</div>

---

## 📸 Preview

| Dashboard      | Cycle Insights | Washroom IoT   |
| -------------- | -------------- | -------------- |
| _(screenshot)_ | _(screenshot)_ | _(screenshot)_ |

| Wellness Notifications | AI Chatbot     | Prince Shop    |
| ---------------------- | -------------- | -------------- |
| _(screenshot)_         | _(screenshot)_ | _(screenshot)_ |

---

## ✨ Features

### 🌙 Neural Cycle Intelligence (AI-Powered)

- **AI Cycle Coach** — Google Gemini 2.0 Flash powered personalized menstrual insights
- **Orbital Cycle Wheel** — Visual 28-day lunar phase map with real-time day tracking
- **Hormone Wave Chart** — Interactive estrogen, progesterone, LH, FSH visualization
- **Symptom Constellation Mapper** — Log & track symptoms; AI personalizes to your signals
- **Fertility & Ovulation Window** — Precise predictions with countdown timers
- **28-Day Calendar Strip** — Phase-color-coded interactive calendar

### 🚿 Smart Washroom IoT Monitoring

- **9 Live Sensors** — CO₂, CO, NO₂, Moisture, Temperature, Humidity, Load Cell, Stagnant Water, Water Fallen
- **Real-time Dashboard** — Live sparklines, radial gauges, alert banners
- **Danger/Warning Alerting** — Automated threshold detection with maintenance dispatch
- **Raw Data Table** — Live streaming sensor feed with trend arrows
- **ESP32 Firmware** — Provided Arduino firmware for IoT node deployment

### 💊 Telemedicine & Consultation Hub

- **Gynaecology Specialists** — Book Dr. Jayshree Shinde & Dr. Surya Prakash instantly
- **Video Consultations** — Integrated booking with slot management
- **Medical History** — Secure patient profile management

### 🛍️ Prince Shop (E-Commerce)

- **Sustainable Products** — Eco-friendly menstrual hygiene products
- **AI Product Advisor** — Gemini-powered shopping assistant
- **Golden Voucher System** — Reward program with redeem-on-checkout
- **Order Management** — Real-time status tracking

### 🔔 Wellness Notifications Hub

- **Step Counter** — Live pedometer with weekly bar chart
- **Hydration Tracker** — Interactive 8-glass water logger with wave animation
- **Sleep Analysis** — REM, deep sleep, and quality scoring
- **Screen Time Monitor** — App-by-app usage breakdown
- **Food Intake Timeline** — Caloric log with macro breakdown rings

### 🤖 AI Medical Chatbot

- **Princess Neural** — Empathetic AI health assistant (Gemini 2.0 Flash)
- **Context-Aware** — Responds to menstrual health, wellness, nutrition queries
- **Multi-turn Conversation** — Full dialogue history support

### 📊 Admin & Producer Dashboards

- **Admin Console** — User management, analytics, system health
- **Producer Dashboard** — Inventory, sales, and fulfillment management
- **Smart Search** — Global keyword navigation with natural language aliases

---

## 🛠️ Tech Stack

| Layer          | Technology                                                             |
| -------------- | ---------------------------------------------------------------------- |
| **Frontend**   | React 18, Tailwind CSS, Three.js (R3F), Lucide Icons                   |
| **Backend**    | Node.js, Express.js                                                    |
| **Database**   | PostgreSQL 15                                                          |
| **AI/ML**      | Google Gemini 2.0 Flash API                                            |
| **IoT**        | ESP32 (Arduino), MQ-135, MQ-7, MQ-131, DHT-22, HC-SR04, HX711, YF-S201 |
| **Auth**       | JWT + bcrypt                                                           |
| **UI Effects** | CSS Glassmorphism, SVG animations, GSAP micro-transitions              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- PostgreSQL ≥ 15
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/PriyanshuMohanty2611/MENSTRUAL_HEALTH_-_HYGIENE.git
cd MENSTRUAL_HEALTH_-_HYGIENE
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Fill in your PostgreSQL credentials and Gemini API key
```

Edit `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=prince_care
DB_USER=your_postgres_user
DB_PASSWORD=your_password
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
```

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create environment file
echo "REACT_APP_GEMINI_API_KEY=your_gemini_api_key" > .env
echo "REACT_APP_API_URL=http://localhost:5000" >> .env

npm start
```

### 4. Database Setup

```bash
cd backend
npm run db:migrate    # Run migrations
npm run db:seed       # Seed sample data
```

The app will be available at **http://localhost:3000**

---

## 🔌 IoT Node Setup (Optional)

Flash the ESP32 firmware for Smart Washroom monitoring:

1. Open `PrinceCare_ESP32_Washroom/PrinceCare_ESP32_Washroom.ino` in Arduino IDE
2. Select board: **ESP32 Dev Module**
3. Set baud rate: **115200**
4. Upload → Open Serial Monitor

> The firmware works **without physical sensors** — it generates authentic simulated data for demo purposes.

---

## 🔑 Environment Variables

| Variable                   | Description                  | Required |
| -------------------------- | ---------------------------- | -------- |
| `REACT_APP_GEMINI_API_KEY` | Google Generative AI API key | ✅       |
| `REACT_APP_API_URL`        | Backend API base URL         | ✅       |
| `DB_HOST`                  | PostgreSQL host              | ✅       |
| `DB_NAME`                  | Database name                | ✅       |
| `DB_USER`                  | Database user                | ✅       |
| `DB_PASSWORD`              | Database password            | ✅       |
| `JWT_SECRET`               | JWT signing secret           | ✅       |

---

## 📁 Project Structure

```
MENSTRUAL_HEALTH_-_HYGIENE/
├── frontend/                    # React 18 SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomerDashboard.jsx    # Main user dashboard
│   │   │   ├── CycleInsights.jsx        # AI cycle intelligence
│   │   │   ├── WashroomDashboard.jsx    # IoT sensor dashboard
│   │   │   ├── WellnessNotifications.jsx # Health tracking
│   │   │   ├── PrinceShop.jsx           # E-commerce
│   │   │   ├── MedicalChatbot.jsx       # AI chatbot
│   │   │   ├── AdminDashboard.jsx       # Admin console
│   │   │   └── Login.jsx                # Auth pages
│   │   └── App.js                       # Root with routing
│   └── public/
├── backend/                     # Node.js + Express API
│   ├── routes/                  # API route handlers
│   ├── middleware/              # Auth, validation
│   └── server.js               # Entry point
├── PrinceCare_ESP32_Washroom/  # Arduino ESP32 firmware
│   └── PrinceCare_ESP32_Washroom.ino
└── PrinceCare_SmartWashroom/   # Arduino Uno firmware
    └── PrinceCare_SmartWashroom.ino
```

---

## 📜 License

**Proprietary — All Rights Reserved.**  
© 2026 Priyanshu Mohanty & Prince Care Health Technologies.

This repository is **private**. Access is granted **only by explicit invitation** from the repository owner.  
Unauthorized copying, distribution, or modification of this software is strictly prohibited.

> To request access or collaboration: contact [priyanshu@princecarehealth.in](mailto:priyanshu@princecarehealth.in)

---

## 🤝 Contributing

This is a **private project**. Contributions are by invitation only.

If you have been granted collaborator access:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "feat: add your feature"`
3. Push and open a Pull Request — **do not push directly to `main`**

---

<div align="center">

Made with 💖 for women's health & dignity  
**Prince Care** · IIT Hackathon 2026

</div>
