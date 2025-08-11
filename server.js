const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Allow only Vercel frontend
app.use(
  cors({
    origin: "https://dep-web-phi.vercel.app", // <-- Vercel frontend URL
    methods: ["POST", "GET", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/form", formRoutes);

app.get("/", (req, res) => {
  res.send("Google Form API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
