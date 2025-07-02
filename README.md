<h1>📈 Stock Broking App - React Native (SDE Intern Assignment)</h1>

<p>This is a stock market Android application built with <strong>React Native</strong> for the SDE Intern assignment. It allows users to explore top market gainers/losers, view detailed stock information with a price graph, and manage a personalized watchlist. It also features news sentiment analysis, light/dark theme toggle, and market status indicator.</p>

<hr>

<h2>🔧 Tech Stack</h2>
<ul>
  <li><strong>React Native (CLI + Expo)</strong></li>
  <li><strong>Alpha Vantage API</strong> for:
    <ul>
      <li>Top Gainers & Losers</li>
      <li>Company Overview</li>
      <li>Intraday Chart Data</li>
      <li>Symbol Search</li>
      <li>News Sentiment</li>
      <li>Market Status</li>
    </ul>
  </li>
  <li><strong>AsyncStorage</strong> for caching & local watchlist management</li>
  <li><strong>react-native-chart-kit</strong> for graph display</li>
  <li><strong>React Navigation</strong> for screen transitions</li>
  <li><strong>Custom Light/Dark Theme Switcher</strong></li>
</ul>

<hr>

<h2>📱 Features</h2>

<h3>🔍 Explore Screen</h3>
<ul>
  <li>Displays <strong>Top Gainers</strong> and <strong>Top Losers</strong> in a grid layout.</li>
  <li>Each card shows stock symbol, current price, and % change.</li>
  <li>"View All" opens a paginated list of all gainers or losers.</li>
</ul>

<h3>🌟 Product Screen</h3>
<ul>
  <li>Shows detailed company overview.</li>
  <li>Displays <strong>intraday price chart</strong> using a line graph.</li>
  <li><strong>Add/Remove from watchlist</strong> with real-time toggle icon.</li>
  <li>Shows <strong>news sentiment</strong> for the stock.</li>
</ul>

<h3>📂 Watchlist</h3>
<ul>
  <li>Displays all saved watchlist folders and the stocks inside them.</li>
  <li>Persistent using AsyncStorage.</li>
  <li>Empty state is shown if no folders/stocks exist.</li>
</ul>

<h3>➕ Add to Watchlist Modal</h3>
<ul>
  <li>Modal with option to <strong>select existing</strong> or <strong>create new</strong> watchlist folders.</li>
  <li>Adds selected stock to one or more folders.</li>
</ul>

<h3>🌗 Light/Dark Theme</h3>
<ul>
  <li>Toggle between light and dark mode dynamically.</li>
  <li>Colors and styles update across all screens.</li>
</ul>

<h3>📈 Market Status</h3>
<ul>
  <li>Real-time <strong>market open/closed status</strong> (Equity market).</li>
  <li>Displayed on the home screen.</li>
</ul>

<hr>

<h2>🗂 Folder Structure</h2>

<pre>
├── api/             # Alpha Vantage API logic and caching
├── components/      # Reusable UI components (Modals, Snackbar)
├── constants/       # Colors and theme configs
├── context/         # Theme context and provider
├── screens/         # All screen components (Home, Product, Watchlist, etc.)
├── storage/         # AsyncStorage logic for watchlist management
├── App.js           # Root component
└── ...
</pre>

<hr>

<h2>⚙️ Setup & Run Locally</h2>

<h4>Clone the repository:</h4>
<pre><code>git clone https://github.com/Adityakk9031/stock-app.git
cd stock-app
</code></pre>

<h4>Install dependencies:</h4>
<pre><code>npm install
# or
yarn
</code></pre>

<h4>Setup .env (Optional):</h4>
<p>If you're using a <code>.env</code> file to store your Alpha Vantage API keys.</p>

<h4>Run the app:</h4>
<pre><code>npx expo start
</code></pre>

<hr>

<h2>🚀 APK & Demo</h2>
<ul>
  <li>🔗 <a href="https://your-apk-link.com" target="_blank"><strong>APK Download (Drive link)</strong></a></li>
  <li>📸 Add screenshots or inline GIF/demo recording here</li>
</ul>

<hr>

<h2>📌 API Notes</h2>
<ul>
  <li>All API calls are cached using <code>AsyncStorage</code> for performance.</li>
  <li>Respect Alpha Vantage <strong>5 requests/min</strong> and <strong>500 requests/day</strong> limit.</li>
  <li>News sentiment and top movers are refreshed every <strong>30 mins</strong>.</li>
</ul>

<hr>

<h2>✅ Completed Assignment Checklist</h2>

<ul>
  <li>✅ Explore screen with top gainers/losers</li>
  <li>✅ Product screen with graph + overview + watchlist toggle</li>
  <li>✅ Watchlist screen with folders and empty state</li>
  <li>✅ Add to Watchlist modal</li>
  <li>✅ Pagination on "View All" screen</li>
  <li>✅ News sentiment integration</li>
  <li>✅ Light/Dark theme switch</li>
  <li>✅ Market status integration</li>
  <li>✅ API caching</li>
  <li>✅ Error/loading/empty handling</li>
  <li>✅ APK + GitHub submission ready</li>
</ul>

<hr>

<h2>📩 Contact</h2>
<p>Made with ❤️ by <strong>Aditya Kumar Singh</strong></p>
<p>📧 <a href="mailto:adityakumarsingh9031@gmail.com">adityakumarsingh9031@gmail.com</a></p>
