const db = require('../../database/connection');

function getAllUsers() {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    return stmt.all();
}

function createUser(name, email) {
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const info = stmt.run(name, email);
    return { id: info.lastInsertRowid, name, email };
}

module.exports = {
    getAllUsers,
    createUser
};
