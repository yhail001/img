const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS configuration

const allowedOrigins = [
    'http://localhost:3000',
    'https://yohanneshaile.com',
    'https://www.yohanneshaile.com',
    'https://img-delta-ebon.vercel.app',
    'http://192.168.1.78:3000'
];

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Main route for contact form submissions
app.post('/js/contactForm.js', async (req, res) => {
    try {
        // Extract and validate form data
        const { name, email, message } = req.body;
        
        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields.'
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address.'
            });
        }
        
        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Store in environment variable
                pass: process.env.EMAIL_PASS  // Store in environment variable
            }
        });
        
        // Configure email options
        const mailOptions = {
            from: email,
            to: 'yh.yohannes@gmail.com',
            subject: 'My Website - Contact Form Submission',
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `,
            replyTo: email
        };
        
        // Send email
        await transporter.sendMail(mailOptions);
        
        // Success response
        return res.status(200).json({
            success: true,
            message: 'Message has been sent'
        });
        
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Message could not be sent. Please try again later.'
        });
    }
});

// Health check route
app.get('/', (req, res) => {
    res.status(200).send('Contact form service is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

