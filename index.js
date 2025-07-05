import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import InitializeCloudinary from './cloudinary/config.js'
import connectDB from './connectdb/connect.js'
import authRouter from './routes/auth.js'
import documentRoute from './routes/document.js'
dotenv.config()

let app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'))
app.use('/auth', authRouter)
app.use('/document', documentRoute)
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.json({ error: err.message });
    }
    return res.json({ error: err.message || 'Something went wrong' });
});

app.get('/', (req, res) => {
    return res.send("Hello world")
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)

    //Connect database
    connectDB(process.env.DATABASE_URL)

    //Initilize cloudinary
    InitializeCloudinary()
})