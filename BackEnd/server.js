require('dotenv').config()
const app = require("./src/app.js")
const connectToDB = require("./src/config/database.js")
if(connectToDB()){
app.listen(3000,()=>{
    console.log("server is running on port 3000")
})
}