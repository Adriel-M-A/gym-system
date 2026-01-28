import db from '../../database/connection';
import { User } from '../../../shared/types/db-models';
import { RunResult } from 'better-sqlite3';

function getAllUsers(): User[] {
    const stmt = db.prepare('SELECT * FROM users ORDER BY created_at DESC');
    return stmt.all() as User[];
}

function createUser(name: string, email: string): User {
    const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
    const info: RunResult = stmt.run(name, email);

    // Devolvemos el objeto User parcial o completamos con valores por defecto/query
    // Para simplificar, asumimos que se creó bien.
    return {
        id: Number(info.lastInsertRowid),
        name,
        email,
        created_at: new Date().toISOString() // Aproximación, idealmente obtener de BD
    };
}

export default {
    getAllUsers,
    createUser
};
