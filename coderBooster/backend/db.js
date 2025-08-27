// backend/db.js
import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: '34.123.42.113',
  user: 'root',
  port: 3306,
  password: 'Superdev123456?',
  database: 'superdev',
});

export default db;
