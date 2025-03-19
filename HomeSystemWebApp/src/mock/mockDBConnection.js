module.exports = {
    query: jest.fn((query, values, callback) => {
        if (query.includes('SELECT * FROM userdetails WHERE email = ?')) {
            // Simulating a successful user lookup
            callback(null, [{ 
                UserID: 1, 
                FirstName: "John", 
                Surname: "Doe", 
                Email: "johndoe@example.com", 
                Password: "$2b$10$hashedpassword", // Mocked bcrypt hash
                Admin: "N" 
            }]);
        } else if (query.includes('INSERT INTO userdetails')) {
            // Simulating successful user registration
            callback(null, { insertId: 2 }); 
        } else if (query.includes('SELECT * FROM userdetails')) {
            // Simulating fetching all users
            callback(null, [
                { UserID: 1, FirstName: "John", Surname: "Doe", Email: "johndoe@example.com", Admin: "N" },
                { UserID: 2, FirstName: "Jane", Surname: "Smith", Email: "janesmith@example.com", Admin: "Y" }
            ]);
        } else {
            // Default case: return empty results
            callback(null, []);
        }
    })
};
