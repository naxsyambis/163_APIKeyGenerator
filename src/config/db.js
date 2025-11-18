const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Bismillah123",
    database: "api_key_db",
    port: 3309,
});

db.connect((err) => {
    if (err) {
    console.error("❌ MySQL Connection Failed:", err);
    } else {
    console.log("✅ Connected to MySQL (api_key_db)");
    }
});

module.exports = db;
