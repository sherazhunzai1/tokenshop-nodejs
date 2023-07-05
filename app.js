require("dotenv").config();
const express = require("express");
const app = express();
const creators = require("./routes/creators");
const morgan = require("morgan");
app.use(express.static(__dirname));
let serverUrl = "/app.v1";
const PORT = process.env.PORT || 8000;

// body parser middleware cant handle form data so we used multer to do this

app.use(express.json());
app.use(morgan("dev"));

app.use(express.urlencoded({ extended: false }));
// app.use(express.static("assests/signatures"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH");

  next();
});
app.use(`${serverUrl}/api/creators`, creators);

app.get(serverUrl, (req, res) => {
  res.write("<h1>welcome</h1>");
  res.write("<h2>Main Page</h2>");
  res.end();
});

app.use((error, req, res, next) => {
  return res.status(error.code || 401).json({ message: error.message });
});
app.all("*", function (req, res) {
  res.status(404).json({ message: "Path Not Found" });
});

app.listen(PORT, console.log(`server is running at http://localhost:${PORT}`));
