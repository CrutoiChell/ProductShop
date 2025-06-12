import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import { pool } from "../db.js";


export function authenticateToken(req, res, next) {
    let authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Недействительный токен' });
        }

        req.user = user;
        next();
    });
}

export async function rootCheck(req, res, next) {
    if (!req.user || !req.user.userId) {
        return res.status(401).json({ error: 'Токен отсутствует или недействителен' });
    }

    try {
        let data = await pool.query('SELECT * FROM users_a WHERE id = $1 AND role = $2', [req.user.userId, 'admin']);

        if (!data.rows.length) {
            return res.status(403).json({ error: 'Нет доступа. Требуются права администратора' });
        }

        next();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Ошибка сервера' });
    }
}
