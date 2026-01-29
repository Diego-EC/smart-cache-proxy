import app from './src/app.js';

const PORT = 3000;

app.listen(PORT, () => {
  console.log('\n' + '='.repeat(55));
  console.log(`🚀 PROXY SERVER RUNNING AT http://localhost:${PORT}`);
  console.log('='.repeat(55) + '\n');

  console.log('✅ VALID EXAMPLES (CACHE & NETWORK):');
  console.log(`   🔹 PokeAPI:      http://localhost:${PORT}/fetch?url=https://pokeapi.co/api/v2/pokemon/ditto`);
  console.log(`   🔹 GitHub API:   http://localhost:${PORT}/fetch?url=https://api.github.com/users/Diego-EC`);
  console.log(`   🔹 Rick & Morty: http://localhost:${PORT}/fetch?url=https://rickandmortyapi.com/api/character/1`);

  console.log('\n🛡️  SECURITY & ERROR TESTS:');
  console.log(`   🚫 Whitelist (403): http://localhost:${PORT}/fetch?url=https://google.com`);
  console.log(`   ⚠️  SSRF/Prot. (400): http://localhost:${PORT}/fetch?url=ftp://server-test`);
  console.log(`   ❓ Missing URL (400): http://localhost:${PORT}/fetch?url=`);
  console.log(`   🔍 API Not Found (404): http://localhost:${PORT}/fetch?url=https://pokeapi.co/api/v2/pokemon/foo`);

  console.log('\n📊 MONITORING & DEBUG:');
  console.log(`   ⚙️  Cache Status: http://localhost:${PORT}/debug-cache-mini`);
  console.log('\n' + '-'.repeat(55));
});