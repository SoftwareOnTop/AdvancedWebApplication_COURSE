import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { Offer, IOffer } from './models/Offer.js';
import { Image } from './models/Image.js';

const app = express();
const port = 3000;


mongoose.connect('mongodb://127.0.0.1:27017/testdb')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('DB Connection Error:', err));


const uploadDir = './public/images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
    
        const nameWithoutExt = path.parse(file.originalname).name;
  
        const ext = path.extname(file.originalname);
     
        const newFilename = `${nameWithoutExt}_${uuidv4()}${ext}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

app.use(express.static('public')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/offers', async (req: Request, res: Response) => {
    try {
        const offers = await Offer.find();
        
       
        const offersWithImages = await Promise.all(offers.map(async (offer: IOffer) => {
            let imageData = null;
            if (offer.imageId) {
                imageData = await Image.findById(offer.imageId);
            }
            return {
                ...offer.toObject(),
                image: imageData
            };
        }));

        res.json(offersWithImages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

app.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    if (mongoose.connection.readyState !== 1) {
        res.status(500).json({ error: 'Database not connected. Is MongoDB running?' });
        return;
    }

    try {
        const { title, description, price } = req.body;
        let imageId = '';

    
        if (req.file) {
            const newImage = new Image({
                filename: req.file.filename,
                path: `public/images/${req.file.filename}`
            });
            const savedImage = await newImage.save();
            imageId = savedImage._id.toString();
        }

        
        const newOffer = new Offer({
            title,
            description,
            price: Number(price),
            imageId: imageId || undefined
        });

        await newOffer.save();
        res.status(201).send('Offer created');
    } catch (error) {
        console.error('Error in /upload:', error);
        res.status(500).json({ 
            message: 'Error creating offer', 
            error: error instanceof Error ? error.message : String(error) 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});