require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const users = []; // Memory for Users

// R E G I S T E R  R O U T E
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
});

// L O G I N  R O U T E
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(400).json({ message: "Invalid Credentials" });
});

app.listen(3000, () => {
  console.log("Sever is running on port", 3000);
});
