DROP TABLE IF EXISTS users;

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
); 