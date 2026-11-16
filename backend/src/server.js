const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏗️  SitePilot Construction System Backend API is active`);
  console.log(`📍  Port: http://localhost:${PORT}`);
  console.log(`🗄️  Database: MySQL construction_db`);
  console.log(`=======================================================`);
});
