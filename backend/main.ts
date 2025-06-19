import express from 'express';
import dotenv from 'dotenv';
import cros from 'cors';

dotenv.config();

const app = express();
const PORT = 8000;

const origin = [
    'http://localhost:3000',
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cros({
    origin,
    credentials: true
}));


app.get('/', async (req, res) => {
    res.status(200).json({
        message: 'Welcome to Padh Ecommerce API',
        status: 'success'
    });
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});