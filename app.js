const express = require("express")
const {open} = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const bcrypt = require("bcrypt")

const DBpath = path.join(__dirname, "database.db")
let db 
const app = express();
app.use(express.json())
app.use(cors());

const initDB = async ()=>{
    try{
        db = await open({
        filename : DBpath,
        driver : sqlite3.Database
    },

    app.listen(3000, ()=>{
        console.log("server started and running at port 3000");
    })
    

    )}catch(e){
        console.log(e)
    }
}

initDB()


// Register API 

app.post("/register", async (req, res)=>{
    const {username, password} = req.body
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const registerQuery = `
    INSERT INTO users (username, password) 
    VALUES ("${username}", "${hashedPassword}");
    `
    await db.run(registerQuery)
    
    res.send("Account Created Successfully")
})

//Login API 

app.post("/login", async (req, res)=>{
    const {username, password} = req.body
    
    const selectQuery = `
    SELECT * FROM users WHERE username = "${username}";
    `
    const dbData = await db.get(selectQuery)
   
    
    
    if(dbData === undefined){
        res.status(400)
        res.send("Invalid Username")
    }else{
        const isValidPassword = await bcrypt.compare(password, dbData.password); 
        if(isValidPassword){
            const payload = {
                username : `${username}`
            }
            const token = jwt.sign(payload, "SECRET_KEY")
            res.send({token})

        }else{
            res.status(400)
            res.send("Invalid Password")
        }
    }
    
})



app.get("/", async (req, res)=>{
    
    res.send("hello world")
})