import { pool } from "../db.js";
export let getAllProducts = async (req, res) => {
    try {
        let result = await pool.query('SELECT * FROM products_a ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let getOneProduct = async (req, res) => {
    let { id } = req.params;
    
    try {
        let result = await pool.query('SELECT * FROM products_a WHERE id = $1', [id]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let create_products = async (req, res) => {
    let { title, description, price, count, category, brand, discount, composition } = req.body;
    let img_url = req.file ? '/uploads/' + req.file.filename : null;

    if (!title || !price || !count) {
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../', req.file.path));
        }
        return res.status(400).json({ error: "Не заполнены обязательные поля" });
    }

    try {
        let result = await pool.query(
            `INSERT INTO products_a (title, description, img_url, price, count, category, brand, discount, composition) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [title, description, img_url, price, count, category, brand, discount, composition]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        if (req.file) {
            fs.unlinkSync(path.join(__dirname, '../', req.file.path));
        }
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let delete_products = async (req, res) => {
    let { id } = req.params;
    try {
        let result = await pool.query('DELETE FROM products_a WHERE id = $1 RETURNING *', [id]);
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let edit_products = async (req, res) => {
    let { id } = req.params;
    let { title, description, img_url, price, count, category, brand, discount, composition } = req.body;
    try {
        let result = await pool.query(
            `UPDATE products_a SET title=$1, description=$2, img_url=$3, price=$4, count=$5, category=$6, brand=$7, discount=$8, composition=$9 WHERE id=$10 RETURNING *`,
            [title, description, img_url, price, count, category, brand, discount, composition, id]
        );
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
