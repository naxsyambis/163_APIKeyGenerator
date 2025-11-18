const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// --- AUTH ADMIN ---

exports.register = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Data tidak lengkap" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.query("INSERT INTO admin (email, password) VALUES (?, ?)", [email, hashed], (err) => {
      if (err) return res.status(500).json({ success: false, message: "Email admin sudah ada" });
      res.json({ success: true, message: "Admin registered!" });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  db.query("SELECT * FROM admin WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ success: false, message: "Email tidak ditemukan" });

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);
    
    if (!match) return res.status(401).json({ success: false, message: "Password salah" });

    const token = jwt.sign({ id: admin.id }, "SECRET", { expiresIn: "1d" });
    res.json({ success: true, token });
  });
};

// --- DASHBOARD & CRUD ---

exports.getDashboardData = (req, res) => {
    // PERUBAHAN: Join menggunakan 'apikey_id' bukan 'api_key_id'
    const query = `
        SELECT 
            users.id as user_id, users.firstname, users.lastname, users.email, 
            api_keys.id as key_id, api_keys.api_key, api_keys.created_at, api_keys.status as db_status
        FROM users 
        RIGHT JOIN api_keys ON users.apikey_id = api_keys.id
    `;

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        const currentDate = new Date();

        const processedData = results.map(row => {
            // Logika Status Tanggal: > 1 Bulan = OFF, <= 1 Bulan = ON
            const createdDate = new Date(row.created_at);
            const diffTime = Math.abs(currentDate - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let computedStatus = "ON"; 
            if (diffDays > 30) {
                computedStatus = "OFF"; // Out of date
            }

            // Opsional: Jika di database statusnya 'inactive' (manual ban), kita bisa override
            if (row.db_status === 'inactive') {
                computedStatus = "OFF (Banned)";
            }

            return {
                ...row,
                status: computedStatus // Status untuk ditampilkan di frontend
            };
        });

        res.json({ success: true, data: processedData });
    });
};

exports.deleteData = (req, res) => {
    const { id } = req.params; // id ini adalah ID dari tabel api_keys
    
    // Hapus user dulu berdasarkan apikey_id
    db.query("DELETE FROM users WHERE apikey_id = ?", [id], (err) => {
        if(err) console.log("Error delete user:", err);
        
        // Lalu hapus api key-nya
        db.query("DELETE FROM api_keys WHERE id = ?", [id], (err, result) => {
            if (err) return res.status(500).json({ success: false, message: "Gagal menghapus data" });
            res.json({ success: true, message: "Data berhasil dihapus" });
        });
    });
};