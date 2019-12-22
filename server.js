const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const config = require("config");

require("dotenv").config();

const app = express();

//MIDDLEWARE
app.use(cors());
app.use(express.json());

//MONGO URI
// const uri = process.env.ATLAS_URI;
//or
//DB CONFIG
const uri = config.get("mongoURI");

//MONGODB Connection
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .catch(err => console.log(err));

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

//USE ROUTES
app.use("/api/items", require("./routes/api/items"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));

//SERVE static assets if in production
if (process.env.NODE_ENV === "production") {
  //SET a static folder
  app.use(express.static("client/build"));

  app.get("*", function(req, res) {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
