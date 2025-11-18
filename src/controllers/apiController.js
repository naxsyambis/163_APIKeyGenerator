const db = require("../config/db");
const crypto = require("crypto");

// 1. Generate dan Save API Key
exports.createApiKey = (req, res) => {
    // Generate random string
    const apiKey = crypto.randomBytes(16).toString("hex");

    // Insert ke tabel api_keys
    // Kolom status akan default ke 'active' sesuai setting database
    const query = "INSERT INTO api_keys (api_key) VALUES (?)";
    
    db.query(query, [apiKey], (err, result) => {
        if (err) {
            console.error("Error generating key:", err);
            return res.status(500).json({ success: false, message: "Gagal membuat API Key" });
        }
        
        // Mengembalikan ID dan Key ke frontend untuk step selanjutnya
        res.json({ 
            success: true, 
            message: "API Key berhasil dibuat!",
            data: {
                id: result.insertId, // Ini ID dari tabel api_keys
                apiKey: apiKey
            }
        });
    });
};