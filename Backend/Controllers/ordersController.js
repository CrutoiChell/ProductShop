import { pool } from "../db.js";

export let getAllOrders = async (req, res) => {
    try {
        let result = await pool.query('SELECT * FROM orders_a WHERE user_id = $1', [req.user.userId]);
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let getOneOrder = async (req, res) => {
    let { id } = req.params;

    try {
        let orderRes = await pool.query(
            'SELECT * FROM orders_a WHERE user_id = $1 AND id = $2',
            [req.user.userId, id]
        );

        if (orderRes.rowCount === 0) {
            return res.status(200).json(null); 
        }

        let products_id = await pool.query(
            'SELECT product_id, count FROM order_item_a WHERE order_id = $1',
            [id]
        );

        let productMap = {};

        for (let { product_id, count } of products_id.rows) {
            if (!productMap[product_id]) {
                let result = await pool.query(
                    'SELECT * FROM products_a WHERE id = $1',
                    [product_id]
                );

                if (result.rows.length > 0) {
                    productMap[product_id] = {
                        ...result.rows[0],
                        count
                    };
                }
            } else {
                productMap[product_id].count += count;
            }
        }

        let products = Object.values(productMap);

        let totalRes = await pool.query(
            `SELECT SUM(p.price::numeric * oi.count) AS total
             FROM order_item_a oi
             JOIN products_a p ON oi.product_id = p.id
             WHERE oi.order_id = $1`,
            [id]
        );

        let order = orderRes.rows[0];
        let total = totalRes.rows[0].total || 0;

        res.status(200).json({
            ...order,
            total: Number(total),
            products
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера >w<" });
    }
};


export let createOrder = async (req, res) => {
    let { payments, type, delivery_date } = req.body;
    try {
        let cart = await pool.query('SELECT * FROM cart_a WHERE user_id = $1', [req.user.userId]);
        if (cart.rowCount === 0) return res.status(200).json(null);

        let order = await pool.query(
            `INSERT INTO orders_a (user_id, payments, type, delivery_date, status) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.user.userId, payments, type, delivery_date, 'pending']
        );

        await Promise.all(cart.rows.map(item => pool.query(
            'INSERT INTO order_item_a (order_id, product_id, count) VALUES ($1, $2, $3)',
            [order.rows[0].id, item.product_id, item.count_of_products]
        )));

        await pool.query('DELETE FROM cart_a WHERE user_id = $1', [req.user.userId]);
        res.status(200).json(order.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let editOrder = async (req, res) => {
    let { id } = req.params;
    let { payments, type, delivery_date, status, user_id } = req.body;
    console.log(req.body);

    try {
        let result = await pool.query(
            'UPDATE orders_a SET payments = $1, type = $2, delivery_date = $3, status = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
            [payments, type, delivery_date, status, id, user_id]
        );
        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let getAllOrdersAdmin = async (req, res) => {
    try {
        let result = await pool.query('SELECT * FROM orders_a');
        res.status(200).json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};