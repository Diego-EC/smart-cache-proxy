// Usamos un Map para almacenar: URL -> { data, timestamp }
export const cache = new Map();

// Tiempo de vida de la caché: 60 segundos (en milisegundos)
export const CACHE_TTL = 60 * 1000;

// Intenta recuperar datos de la caché.
// Si han pasado más de 60s, borra la entrada y devuelve null.
export const getCachedData = (key) => {
  const cachedItem = cache.get(key);

  if (!cachedItem) return null;

  const age = Date.now() - cachedItem.timestamp;
  if (age > CACHE_TTL) {
    cache.delete(key); // Limpieza de datos antiguos
    return null;
  }

  return cachedItem;
};

// Guarda los datos en el Map con el tiempo actual
export const setCacheData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Se ejecuta cada CACHE_TTL segundos para liberar RAM de datos que nadie ha pedido
setInterval(() => {
  const now = Date.now();
  console.log('🧹 Running auto-cleanup...');
  
  for (const [key, item] of cache.entries()) {
    if (now - item.timestamp > CACHE_TTL) {
      cache.delete(key);
      console.log(`🗑️ Auto-removed expired key: ${key}`);
    }
  }
}, CACHE_TTL);
