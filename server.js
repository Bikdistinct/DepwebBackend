const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const formRoutes = require("./routes/formRoutes");
const authRoutes =require("./routes/authRoutes")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔐 Allow only Vercel frontend
// app.use(
//   cors({
//     origin: "https://dep-web-phi.vercel.app", // <-- Vercel frontend URL
//     methods: ["POST", "GET", "OPTIONS"],
//     credentials: true,
//   })
// );

const session = require("express-session");

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set true if using HTTPS in production
}));

const allowedOrigins = [
  "https://dep-web-phi.vercel.app", // deployed frontend
  "http://localhost:5173"           // local Vite frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());

// Routes
app.use("/api/form", formRoutes);
app.use("/api/auth",authRoutes)

app.get("/", (req, res) => {
  res.send("Google Form API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
