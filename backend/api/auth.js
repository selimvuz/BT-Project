const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./token.js");

const authRoutes = express();

const db = new sqlite3.Database("../database/chatbot.db");

authRoutes.use(express.json());
authRoutes.use(cors({ origin: "http://localhost:3000" }));

// Use a static secret key for signing and verifying tokens
const secretKey = "ye8zua@8294%qiwommqhfrlu0s7s)be1@-2+9$g$0+3w9i@r3f";

const generateToken = (user) => {
  const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" });
  return token;
};

authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error retrieving user" });
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({ token });
  });
});

authRoutes.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Error inserting user" });
      }

      res.status(200).json({ message: "User created" });
    }
  );
});

authRoutes.post("/validateToken", authenticateToken, (req, res) => {
  // If the middleware passes, the token is valid
  res.status(200).json({ message: "Token is valid" });
});

module.exports = {
  authRoutes,
};
