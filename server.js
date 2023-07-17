const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require('cors');

dotenv.config({ path: './.env' });

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
  next();
  });

const db = process.env.DATABASE_URL;
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on Port: ${port}`);
});

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB", error);
  });
