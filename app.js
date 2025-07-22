require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json());

const users = []; // Memory for Users

// R E G I S T E R  R O U T E
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  //check if user already exists
  const existingUser = users.find((u) => {
    return u.username === username;
  });
  if (existingUser)
    return res.status(400).json({ message: "User already exist" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  console.log(username, hashedPassword);

  res.status(201).json({ message: "User registered" });
});

console.log(users);

// L O G I N  R O U T E
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user) return res.status(400).json({ message: "Invalid Credentials" });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

  const token = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: `Hello, ${req.user.username}! This is a protected route.`,
  });
});

app.listen(3000, () => {
  console.log("Sever is running on port", 3000);
});
