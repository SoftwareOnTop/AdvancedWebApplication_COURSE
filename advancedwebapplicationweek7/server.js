require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const app = express()
const port = 3000

app.use(cors())
app.use(express.static('.'))
app.use(express.json())

const users = []

const validateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' })
    }
}

app.post("/api/user/register", async (req, res) => {
    const { email, password } = req.body
    
    const existingUser = users.find(user => user.email === email)
    if (existingUser) {
        return res.status(403).json({ message: 'Email already in use' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 6)
    
    const newUser = {
        email: email,
        password: hashedPassword
    }
    
    users.push(newUser)
    
    res.status(201).json(newUser)
})

app.get("/api/user/list", (req, res) => {
    res.json(users)
})

app.post("/api/user/login", async (req, res) => {
    const { email, password } = req.body
    
    const user = users.find(u => u.email === email)
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ email: user.email }, process.env.SECRET, { expiresIn: '1h' })
    
    res.json({ token })
})

app.get("/api/private", validateToken, (req, res) => {
    res.status(200).json({ message: "This is protected secure route!" })
})

if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    })
}

module.exports = app
