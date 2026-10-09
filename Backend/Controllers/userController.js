import { pool } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const profileColumns = 'id, name, surname, email, phone_number, address, role';
const editableProfileFields = new Set(['name', 'surname', 'email', 'phone_number', 'password', 'address']);

export let signUp = async (req, res) => {
    let { name, surname, email, phone_number, password, address } = req.body;
    let hash = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            `INSERT INTO users_a (name, surname, email, phone_number, password, address, role) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [name, surname, email, phone_number, hash, address, 'user']
        );
        res.status(201).json({ name, surname, email, phone_number, address, role: 'user' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let signIn = async (req, res) => {
    let { email, password } = req.body;
    try {
        let result = await pool.query('SELECT * FROM users_a WHERE email = $1', [email]);
        let user = result.rows[0];
        if (!user) return res.status(200).json(null);

        let match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(200).json(null);

        let token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({ token, userId: user.id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let fetch_profile_data = async (req, res) => {
    try {
        let result = await pool.query(`SELECT ${profileColumns} FROM users_a WHERE id = $1`, [req.user.userId]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let edit_profile = async (req, res) => {
    const userId = req.user.userId;
    const updates = req.body;

    try {
        if (!updates || typeof updates !== 'object' || Array.isArray(updates) ||
            Object.keys(updates).some(key => !editableProfileFields.has(key))) {
            return res.status(400).json({ error: "Недопустимые поля профиля" });
        }

        if (updates.name === null || updates.name === undefined ||
            updates.email === null || updates.email === undefined) {
            return res.status(400).json({ error: "Имя и email обязательны" });
        }

        let queryParts = [];
        let values = [];
        let counter = 1;

        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                if (key === "password") {
                    const hashed = await bcrypt.hash(value, 10);
                    queryParts.push(`password = $${counter}`);
                    values.push(hashed);
                } else {
                    queryParts.push(`${key} = $${counter}`);
                    values.push(value);
                }
                counter++;
            }
        }

        if (queryParts.length === 0) {
            return res.status(400).json({ error: "Нет данных для обновления" });
        }

        values.push(userId);
        const queryText = `
            UPDATE users_a 
            SET ${queryParts.join(", ")} 
            WHERE id = $${counter}
            RETURNING ${profileColumns}
        `;

        let result = await pool.query(queryText, values);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let delete_profile = async (req, res) => {
    try {
        let result = await pool.query(`DELETE FROM users_a WHERE id = $1 RETURNING ${profileColumns}`, [req.user.userId]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
