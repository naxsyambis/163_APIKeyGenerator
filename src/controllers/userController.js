const db = require("../config/db");

// 2. Simpan Data User (Create User)
exports.createUser = (req, res) => {
    // Frontend harus mengirim key: { firstname, lastname, email, apikey_id }
    // Pastikan di frontend nama field-nya 'apikey_id' juga, atau sesuaikan di sini
    const { firstname, lastname, email, apikey_id } = req.body;

    if (!firstname || !email || !apikey_id) {
        return res.status(400).json({ success: false, message: "Data tidak lengkap." });
    }

    // Query disesuaikan dengan kolom 'apikey_id'
    const query = "INSERT INTO users (firstname, lastname, email, apikey_id) VALUES (?, ?, ?, ?)";
    
    db.query(query, [firstname, lastname, email, apikey_id], (err, result) => {
        if (err) {
            console.error("Error saving user:", err);
            // Cek duplikat email atau apikey_id
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: "Email atau API Key sudah terdaftar." });
            }
            return res.status(500).json({ success: false, message: "Gagal menyimpan user" });
        }
        res.json({ success: true, message: "User berhasil disimpan!" });
    });
};