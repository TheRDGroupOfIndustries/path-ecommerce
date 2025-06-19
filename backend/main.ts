import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// ROUTES
import userRoute from "./routes/user.route.js"
import marketPlace from "./routes/marketplace.route.js"
import productRoute from "./routes/property.route.js";

// 

dotenv.config();

const app = express();
const PORT = 8000;

const origin = [
    'http://localhost:3000',
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin,
    credentials: true
}));


app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Welcome to Padh Ecommerce API',
        status: 'success'
    });
})

app.use("/api/users", userRoute)
app.use("/api/marketplace", marketPlace)
app.use("/api/property", productRoute)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});