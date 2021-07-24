require('dotenv').config()
const express = require("express")
const sequelize = require("./db")
const models = require("/home/milamin/Tutorial/i-store/server/models/models")
const cors = require("cors")
const router = require("./routes/index")


const app = express();

app.use(cors())
app.use(express.json())
app.use("/api", router)

/*app.get("/", (req, res) => {
    res.status(200).json({massage: "Working..."})
})
*/

const Port = process.env.Port || 3000

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(Port, () => console.log("work server " + Port + "..." )); 
    } catch(e) {
        console.log(e)
    }
}

start()
