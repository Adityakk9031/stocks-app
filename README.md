# 📈 Stock Broking App - React Native (SDE Intern Assignment)

This is a stock market Android application built with **React Native** for the SDE Intern assignment. It allows users to explore top market gainers/losers, view detailed stock information with a price graph, and manage a personalized watchlist. It also features news sentiment analysis, light/dark theme toggle, and market status indicator.

---

## 🔧 Tech Stack

- **React Native (CLI + Expo)**
- **Alpha Vantage API** for:
  - Top Gainers & Losers
  - Company Overview
  - Intraday Chart Data
  - Symbol Search
  - News Sentiment
  - Market Status
- **AsyncStorage** for caching & local watchlist management
- **react-native-chart-kit** for graph display
- **React Navigation** for screen transitions
- **Custom Light/Dark Theme Switcher**

---

## 📱 Features

### 🔍 Explore Screen
- Displays **Top Gainers** and **Top Losers** in a grid layout.
- Each card shows stock symbol, current price, and % change.
- "View All" opens a paginated list of all gainers or losers.

### 🌟 Product Screen
- Shows detailed company overview.
- Displays **intraday price chart** using a line graph.
- **Add/Remove from watchlist** with real-time toggle icon.
- Shows **news sentiment** for the stock.

### 📂 Watchlist
- Displays all saved watchlist folders and the stocks inside them.
- Persistent using AsyncStorage.
- Empty state is shown if no folders/stocks exist.

### ➕ Add to Watchlist Modal
- Modal with option to **select existing** or **create new** watchlist folders.
- Adds selected stock to one or more folders.

### 🌗 Light/Dark Theme
- Toggle between light and dark mode dynamically.
- Colors and styles update across all screens.

### 📈 Market Status
- Real-time **market open/closed status** (Equity market).
- Displayed on the home screen.

---

## 🗂 Folder Structure

├── api/ # Alpha Vantage API logic and caching
├── components/ # Reusable UI components (Modals, Snackbar)
├── constants/ # Colors and theme configs
├── context/ # Theme context and provider
├── screens/ # All screen components (Home, Product, Watchlist, etc.)
├── storage/ # AsyncStorage logic for watchlist management
├── App.js # Root component
└── ...

yaml
Copy
Edit

---

## ⚙️ Setup & Run Locally

1. **Clone the repository:**

```bash
git clone https://github.com/Adityakk9031/stock-app.git
cd stock-app
Install dependencies:

bash
Copy
Edit
npm install
# or
yarn
Setup .env (Optional):

If you're using a .env to store Alpha Vantage API keys.

Run the app:

bash
Copy
Edit
npx expo start
🚀 APK & Demo
🔗 APK Download (Drive link)

📸 Screenshots or add inline GIF/demo recording

📌 API Notes
All API calls are cached using AsyncStorage for performance.

Respect Alpha Vantage 5 requests/min & 500 requests/day limit.

News sentiment and top movers are refreshed every 30 mins.

✅ Completed Assignment Checklist
 Explore screen with top gainers/losers

 Product screen with graph + overview + watchlist toggle

 Watchlist screen with folders and empty state

 Add to Watchlist modal

 Pagination on "View All" screen

 News sentiment integration

 Light/Dark theme switch

 Market status integration

 API caching

 Error/loading/empty handling

 APK + GitHub submission ready

📩 Contact
Made with ❤️ by Aditya Kumar Singh
📧 adityakumarsingh9031@gmail.com

