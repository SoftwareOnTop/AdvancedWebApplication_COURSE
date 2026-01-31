import dotenv from 'dotenv'
import express, { Express, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
const { validationResult } = require('express-validator')
import User from './src/models/User'
import Topic from './src/models/Topic'
import { registerValidation, loginValidation } from './src/validators/inputValidation'
import { validateToken, validateAdmin, AuthRequest } from './src/middleware/validateToken'

dotenv.config()

const app: Express = express()
const port: number = 3000

app.use(cors())
app.use(express.static('.'))
app.use(express.json())

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/testdb'

const ensureCollectionsExist = async (): Promise<void> => {
    await User.createCollection()
    await Topic.createCollection()
}

app.post("/api/user/register", registerValidation, async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }

    const { email, password, username, isAdmin } = req.body
    
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(403).json({ message: 'Email already in use' })
            return
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = new User({
            email,
            password: hashedPassword,
            username,
            isAdmin: isAdmin || false
        })
        
        await newUser.save()
        
        res.status(200).json(newUser)
    } catch (error: any) {
        console.error('Registration error:', error?.message || error)
        res.status(500).json({ message: 'Server error' })
    }
})

app.post("/api/user/login", loginValidation, async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
        return
    }

    const { email, password } = req.body
    
    try {
        const user = await User.findOne({ email })
        if (!user) {
            res.status(404).json({ message: 'User not found' })
            return
        }
        
        if (!user.password) {
            res.status(500).json({ message: 'Server error' })
            return
        }
        
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            res.status(401).json({ message: 'Invalid password' })
            return
        }
        
        const token = jwt.sign(
            { 
                _id: user._id, 
                username: user.username, 
                isAdmin: user.isAdmin 
            }, 
            process.env.SECRET as string, 
            { expiresIn: '1h' }
        )
        
        res.json({ token })
    } catch (error: any) {
        console.error('Login error:', error.message)
        res.status(500).json({ message: 'Server error' })
    }
})

app.get("/api/topics", async (req: Request, res: Response): Promise<void> => {
    try {
        const topics = await Topic.find().sort({ createdAt: -1 })
        res.json(topics)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

app.post("/api/topic", validateToken, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body
        
        const newTopic = new Topic({
            title,
            content,
            username: req.user.username,
            createdAt: new Date()
        })
        
        await newTopic.save()
        
        res.status(200).json(newTopic)
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

app.delete("/api/topic/:id", validateAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params
        
        await Topic.findByIdAndDelete(id)
        
        res.json({ message: 'Topic deleted successfully.' })
    } catch (error) {
        res.status(500).json({ message: 'Server error' })
    }
})

const startServer = async () => {
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            connectTimeoutMS: 5000
        })
        console.log('Connected to MongoDB')
        await ensureCollectionsExist()
    } catch (err: any) {
        console.error('MongoDB connection error:', err?.message || err)
        console.log('Starting server without MongoDB connection (for development)')
    }
};

mongoose.connection.removeAllListeners();

startServer();

export default app
