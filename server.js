const app = require("./app")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cors = require('cors');


dotenv.config({ path: './.env' })

app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
  })
);


const db = process.env.DATABASE_URL

const port = process.env.PORT

app.listen(port, () => {
  console.log(`App running on Port: ${port}`)
})


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


