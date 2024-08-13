const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const USERS = [
  { name: "srinivasan-ad", password: "12345" },
  { name: "ManojaD2004", password: "1234" },
  { name: "Vilas-cp", password: "123" }
];

const jwtpass = "123456";

function userExists(username, pass) {
  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].name === username && USERS[i].password === pass) {
      return true;
    }
  }
  return false;
}

app.post("/user", (req, res) => {
  const { username, password } = req.body;

  if (!userExists(username, password)) {
    return res.status(404).json({
      message: "User does not exist"
    });
  }

  let token = jwt.sign({ username: username }, jwtpass);
  return res.json({ token });
});

app.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtpass);
    const user = USERS.find((u) => u.name === decoded.username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    res.status(401).json({
      message: "Invalid token"
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
