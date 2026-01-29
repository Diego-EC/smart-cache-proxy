# 🌐 Smart API Proxy Server

A robust Node.js backend solution designed to intercept, validate, and cache external API requests. This project focuses on high-performance memory management and industry-standard security protocols like SSRF protection and Domain Whitelisting.

## 🚀 Key Features

- **Intelligent Caching System**: Implements a dual-layer cleanup strategy (Active & Passive) to ensure data freshness while optimizing RAM usage.
- **Security-First Architecture**: Features a strict Domain Whitelist and SSRF (Server-Side Request Forgery) protection to prevent unauthorized access and network attacks.
- **Cache Transparency**: Utilizes industry-standard `X-Cache` headers (`HIT`/`MISS`) and a dedicated monitoring endpoint for real-time cache inspection.
- **High Legibility (DX)**: Automatic JSON pretty-printing and a detailed interactive terminal menu for a superior developer experience.
- **Global Error Handling**: Standardized HTTP responses (400, 403, 404, 500) for consistent API interaction.

## 🛠️ Tech Stack

- **Node.js**: Javascript runtime environment.
- **Express.js**: Fast, unopinionated web framework for the API structure.
- **Axios**: Promise-based HTTP client for reliable external data fetching.
- **Native Map API**: High-performance key-value storage for the caching engine.

## 🧠 Technical Decisions

- **Dual-Layer Cache Cleanup**:
    - **Passive**: Items are validated and removed upon request if they exceed the 60s TTL.
    - **Active**: A background `setInterval` process prunes stale data every minute to prevent memory leaks.
- **SSRF Protection**: Strict protocol validation (only `http:` and `https:`) ensures the server cannot be used to probe internal network services.
- **Modular Architecture**: Complete separation of concerns between the server entry point, the application logic, and the caching utility.
- **Domain Whitelisting**: Limits proxy usage to specific trusted domains (`pokeapi.co`, `api.github.com`, `rickandmortyapi.com`) to prevent open-proxy exploitation.

## 📂 Project Structure

```text
├── src/
│   ├── app.js          # Core logic: Security, CORS, and Routes
│   └── cache.js        # Caching Engine: TTL logic and Auto-cleanup
├── index.js            # Entry point: Server initialization and CLI Menu
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation and technical overview
```

## 📦 Installation and Execution

Follow these steps to get the project up and running on your local machine:

1. Clone the repository:
   ```bash
   git clone https://github.com/Diego-EC/smart-cache-proxy.git

   cd smart-cache-proxy
   ```
2. Install all dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Usage: The application will be available at http://localhost:3000. The terminal will display interactive links to test all features.
   - Valid fetches: Examples for PokeAPI, GitHub, and Rick & Morty.
   - Security blocks: Links to test 403 Forbidden and 400 Bad Request responses.
   - Monitoring: Real-time cache status available at http://localhost:3000/debug-cache-mini.
