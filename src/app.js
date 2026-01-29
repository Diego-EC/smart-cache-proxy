import express from 'express';
import axios from 'axios';
import { getCachedData, setCacheData, CACHE_TTL, cache } from './cache.js';

const app = express();

app.set('json spaces', 2); // enables pretty-printing for json responses with 2-space indentation

// --- configuration ---
// whitelist
const ALLOWED_DOMAINS = ['pokeapi.co', 'api.github.com', 'rickandmortyapi.com'];

// 1. CORS middleware: allows any origin to access this proxy
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

app.get('/fetch', async (req, res) => {
  const { url } = req.query;

  // 2. validation: check if url is provided
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    // 3. SSRF protection and format validation
    const targetUrl = new URL(url); 
    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
      return res.status(400).json({ error: 'only http/https protocols are allowed' });
    }

    // 4. whitelist validation: check if domain is trusted
    if (!ALLOWED_DOMAINS.includes(targetUrl.hostname)) {
      return res.status(403).json({ 
        error: 'forbidden', 
        message: `the domain ${targetUrl.hostname} is not in the whitelist.` 
      });
    }

    // 5. cache management: check for existing data
    const cachedItem = getCachedData(url);

    if (cachedItem) {
      // Calculamos el tiempo usando cachedItem que acabamos de recibir
      const remainingTime = Math.round((CACHE_TTL - (Date.now() - cachedItem.timestamp)) / 1000);
      
      console.log(`Cache HIT for: ${url}`);
      // industry standard header for cache status
      res.setHeader('X-Cache', 'HIT'); 
      
      return res.json({
        source: 'cache',
        expiresIn: `${remainingTime}s`,
        data: cachedItem.data,
      });
    }

    // 6. external fetch: Cache MISS
    console.log(`Cache MISS for: ${url}. Fetching from external source...`);
    res.setHeader('X-Cache', 'MISS'); 
    
    const response = await axios.get(url);

    // 7. store fresh data in cache
    setCacheData(url, response.data);

    res.json({
      source: 'network',
      data: response.data,
    });
  } catch (error) {
    // 8. global error handling: structured response
    const statusCode = error.response?.status || (error.code === 'ERR_INVALID_URL' ? 400 : 500);
    const message = error.response?.data?.message || error.message;

    res.status(statusCode).json({
      error: 'proxy error',
      status: statusCode,
      message: message
    });
  }
});

// debug routes
app.get('/debug-cache', (req, res) => {
  res.json({
    size: cache.size,
    items: Object.fromEntries(cache)
  });
});

app.get('/debug-cache-mini', (req, res) => {
  const now = Date.now();
  const cacheSummary = Array.from(cache.entries()).map(([url, item]) => {
    const remainingMs = CACHE_TTL - (now - item.timestamp);
    return {
      url: url,
      storedAt: new Date(item.timestamp).toLocaleTimeString(),
      expiresIn: `${Math.round(remainingMs / 1000)}s`,
      status: remainingMs > 0 ? 'active' : 'expired'
    };
  });

  res.json({
    totalItems: cache.size,
    cacheTTL: `${CACHE_TTL / 1000}s`,
    items: cacheSummary
  });
});

export default app;
