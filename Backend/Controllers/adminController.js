import { pool } from "../db.js";
import bcrypt from 'bcrypt';

export let getAllUsers = async (req, res) => {
    try {
        let result = await pool.query('SELECT * FROM users_a');
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};

export let getOneUser = async (req, res) => {
    let { id } = req.params;

    try {
        let result = await pool.query('SELECT * FROM users_a WHERE id = $1', [id]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};

export let createNewUser = async (req, res) => {
    let { name, surname, email, phone_number, password, address, role } = req.body;
    let hash = await bcrypt.hash(password, 10);

    try {
        await pool.query(
            'INSERT INTO users_a (name, surname, email, phone_number, password, address, role) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [name, surname, email, phone_number, hash, address, role]
        );
        res.status(201).json(true);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};

export let deleteUser = async (req, res) => {
    let { id } = req.params;

    try {
        let result = await pool.query('DELETE FROM users_a WHERE id = $1', [id]);
        res.status(200).json(result.rowCount > 0);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};

export let editUser = async (req, res) => {
    let { id } = req.params;
    let { name, surname, email, phone_number, password, address, role } = req.body;
    let hash = await bcrypt.hash(password, 10);
    try {
        let result = await pool.query(
            'UPDATE users_a SET name = $1, surname = $2, email = $3, phone_number = $4, password = $5, address = $6, role = $7 WHERE id = $8',
            [name, surname, email, phone_number, hash, address, role, id]
        );
        res.status(200).json(result.rowCount > 0);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};
