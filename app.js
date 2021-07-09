const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000; // Heroku will need the PORT environment variable

app.enable("trust proxy");

app.use(function (request, response, next) {
  if (process.env.NODE_ENV !== "development" && !request.secure) {
    return response.redirect("https://" + request.headers.host + request.url);
  }

  next();
});

app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});

app.listen(port, () => console.log(`App is live on port ${port}!`));
