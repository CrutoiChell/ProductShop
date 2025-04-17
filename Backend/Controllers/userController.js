import { pool } from "../db.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        let result = await pool.query('SELECT * FROM users_a WHERE id = $1', [req.user.userId]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let edit_profile = async (req, res) => {
    let { name, surname, email, phone_number, password, address } = req.body;
    try {
        let result = await pool.query(
            'UPDATE users_a SET name = $1, surname = $2, email = $3, phone_number = $4, password = $5, address = $6 WHERE id = $7 RETURNING *',
            [name, surname, email, phone_number, password, address, req.user.userId]
        );
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let delete_profile = async (req, res) => {
    try {
        let result = await pool.query('DELETE FROM users_a WHERE id = $1 RETURNING *', [req.user.userId]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
