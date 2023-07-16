const express = require("express")
const morgan = require("morgan")
const userRouter = require("./routes/userRoutes")
const restaurantsRouter = require("./routes/restaurantRoutes")
const menuRouter = require("./routes/menuRoutes")

const app = express()
app.use(morgan("dev"))
app.use(express.json())

app.use("/api/menu", menuRouter)
app.use("/api/restaurants", restaurantsRouter)
app.use("/api/users", userRouter)


module.exports = app