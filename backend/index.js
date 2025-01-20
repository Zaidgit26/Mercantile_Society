const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Azure SQL configuration
const config = {
    user: 'mercansocietyadmin',
    password: 'admin@ms2025',
    server: 'mercansocietyserver.database.windows.net',
    database: 'mercansocietydb',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Connect to Azure SQL
let pool;
sql.connect(config).then(p => {
    console.log('Connected to Azure SQL');
    pool = p;
}).catch(err => {
    console.error('Database connection failed:', err);
});

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 3 * 1024 * 1024 } // 3MB limit
});

// Add this at the top of your file to ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Registration endpoint with file upload
app.post('/api/register', upload.single('document'), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Uploaded file:', req.file);
        const {
            name, email, dateOfBirth, stateOfResidence, mobile,
            nomineeName, nomineeRelationship, aadharNumber,
            nomineeAadharNumber, address, city, state, pincode,
            password
        } = req.body;

        // Get file path if uploaded
        const documentUrl = req.file ? req.file.path : null;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Debug log
        console.log('Received registration data:', {
            ...req.body,
            documentUrl,
            hashedPassword
        });

        const result = await pool.request()
            .input('fullName', sql.NVarChar, name)
            .input('email', sql.NVarChar, email)
            .input('dateOfBirth', sql.Date, new Date(dateOfBirth))
            .input('stateOfResidence', sql.NVarChar, stateOfResidence)
            .input('mobile', sql.NVarChar, mobile)
            .input('nomineeName', sql.NVarChar, nomineeName)
            .input('nomineeRelationship', sql.NVarChar, nomineeRelationship)
            .input('aadharNumber', sql.NVarChar, aadharNumber)
            .input('nomineeAadharNumber', sql.NVarChar, nomineeAadharNumber)
            .input('address', sql.NVarChar, address)
            .input('city', sql.NVarChar, city)
            .input('state', sql.NVarChar, state)
            .input('pincode', sql.NVarChar, pincode)
            .input('password', sql.NVarChar, hashedPassword)
            .input('documentUrl', sql.NVarChar, documentUrl)
            .query(`
                INSERT INTO users (
                    fullName, email, dateOfBirth, stateOfResidence, mobile,
                    nomineeName, nomineeRelationship, aadharNumber,
                    nomineeAadharNumber, address, city, state, pincode, 
                    password, documentUrl
                )
                VALUES (
                    @fullName, @email, @dateOfBirth, @stateOfResidence, @mobile,
                    @nomineeName, @nomineeRelationship, @aadharNumber,
                    @nomineeAadharNumber, @address, @city, @state, @pincode,
                    @password, @documentUrl
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);

        console.log('Database insert result:', result);
        res.json({ 
            success: true, 
            message: 'Registration successful',
            userId: result.recordset[0].id
        });
    } catch (err) {
        console.error('Full error details:', {
            message: err.message,
            stack: err.stack,
            code: err.code
        });
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: err.message
        });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.request()
            .input('email', sql.NVarChar, email)
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const user = result.recordset[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Remove sensitive data before sending
        delete user.password;
        res.json({ success: true, user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// OTP generation endpoint (for development)
app.post('/api/send-otp', (req, res) => {
    const { mobile } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(`OTP for ${mobile}: ${otp}`); // Development only
    res.json({ success: true, otp });
});

// Add this after your routes
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
