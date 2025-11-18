const express = require("express");
const path = require("path");
const app = express();

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(express.json());
app.use(express.static("public"));
app.use("/admin", express.static("admin"));

// ROUTES
app.use("/api", require("./routes/apiRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/admin-panel", require("./routes/adminRoutes"));

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
