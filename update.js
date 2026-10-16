const fs = require('fs');
const path = require('path');

const [,, product, version, shotsDir] = process.argv;

if (!product || !version) {
  console.error('用法: node update.js <miniapp|app> <version> [shotsDir]');
  process.exit(1);
}

const file = path.join(__dirname, '../products.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

if (!data[product]) {
  console.error(`products.json 里没有 ${product}`);
  process.exit(1);
}

data[product].version = version;
data[product].releaseDate = new Date().toISOString().slice(0, 10);

if (shotsDir && fs.existsSync(shotsDir)) {
  const files = fs.readdirSync(shotsDir).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  data[product].screenshots = files.map(f => `/shots/${product}/${version}/${f}`);
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`已更新 ${product} 到 ${version}`);