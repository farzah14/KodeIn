/* eslint-disable */
const { Client } = require('pg');

const commonConfigs = [
  // Using user: postgres
  { user: 'postgres', password: 'admin123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'postgres123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: '12345', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: '123456', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: '12345678', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: '1234', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'root', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'root123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'farzah123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'farzah14', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'farzah', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'postgres', password: 'Farzah123', host: 'localhost', database: 'postgres', port: 5432 },

  // Using user: farzah
  { user: 'farzah', password: '', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'farzah', password: '123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'farzah', password: 'admin', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'farzah', password: 'postgres', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'farzah', password: 'farzah123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'farzah', password: 'farzah14', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'farzah', password: 'farzah', host: 'localhost', database: 'postgres', port: 5432 },

  // Using user: Farzah
  { user: 'Farzah', password: '', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'Farzah', password: '123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'Farzah', password: 'admin', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'Farzah', password: 'postgres', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'Farzah', password: 'farzah123', host: 'localhost', database: 'postgres', port: 5432 },
  { user: 'Farzah', password: 'farzah14', host: 'localhost', database: 'postgres', port: 5432 }
];

async function probe() {
  for (const config of commonConfigs) {
    console.log(`Trying connection: user=${config.user} password=${config.password} db=${config.database}`);
    const client = new Client(config);
    try {
      await client.connect();
      console.log(`SUCCESS! Connected with config:`, config);
      
      const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;');
      console.log('Databases:', res.rows.map(r => r.datname));
      
      await client.end();
      return config;
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }
  console.log("No common configuration worked.");
}

probe();
