const sql = require('mssql');

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

async function testAndCreateDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log('Successfully connected to database');
        
        // Check if table exists
        const tableCheck = await pool.request().query(`
            SELECT * 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_NAME = 'users'
        `);
        
        if (tableCheck.recordset.length === 0) {
            console.log('\nTable does not exist. Creating users table...');
            
            // Create the table
            await pool.request().query(`
                CREATE TABLE users (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    fullName NVARCHAR(255),
                    email NVARCHAR(255),
                    dateOfBirth DATE,
                    stateOfResidence NVARCHAR(100),
                    mobile NVARCHAR(20),
                    nomineeName NVARCHAR(255),
                    nomineeRelationship NVARCHAR(100),
                    aadharNumber NVARCHAR(20),
                    nomineeAadharNumber NVARCHAR(20),
                    address NVARCHAR(MAX),
                    city NVARCHAR(100),
                    state NVARCHAR(100),
                    pincode NVARCHAR(10),
                    password NVARCHAR(255),
                    documentUrl NVARCHAR(MAX),
                    created_at DATETIME DEFAULT GETDATE()
                )
            `);
            console.log('Users table created successfully!');
        } else {
            console.log('\nUsers table already exists');
        }

        // Insert test data
        console.log('\nInserting test record...');
        const testResult = await pool.request()
            .input('fullName', sql.NVarChar, 'Test User')
            .input('email', sql.NVarChar, 'test@example.com')
            .input('dateOfBirth', sql.Date, new Date('1990-01-01'))
            .input('stateOfResidence', sql.NVarChar, 'Test State')
            .input('mobile', sql.NVarChar, '1234567890')
            .input('password', sql.NVarChar, 'testpass123')
            .query(`
                INSERT INTO users (
                    fullName, email, dateOfBirth, stateOfResidence, 
                    mobile, password
                )
                VALUES (
                    @fullName, @email, @dateOfBirth, @stateOfResidence,
                    @mobile, @password
                );
                SELECT SCOPE_IDENTITY() AS id;
            `);
        console.log('Test record inserted with ID:', testResult.recordset[0].id);

        // Verify the data
        const verifyResult = await pool.request().query('SELECT * FROM users');
        console.log('\nCurrent records in users table:', verifyResult.recordset);

    } catch (err) {
        console.error('Database operation error:', err);
        console.error('Error details:', err.message);
    } finally {
        await sql.close();
    }
}

testAndCreateDatabase(); 