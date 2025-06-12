import { pool } from "../db.js";

export let addProduct = async (req, res) => {
    let { product_id, count_of_products } = req.body;

    try {
        await pool.query(
            'INSERT INTO cart_a (user_id, product_id, count_of_products) VALUES ($1, $2, $3)',
            [req.user.userId, product_id, count_of_products]
        );
        res.status(200).json(true);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};

export let deleteProductInCart = async (req, res) => {
    let { id } = req.params;

    try {
        let result = await pool.query(
            'DELETE FROM cart_a WHERE product_id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        res.status(200).json(result.rowCount > 0);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};


export let getUserCart = async (req, res) => {
    try {
        let data = await pool.query('SELECT * FROM cart_a WHERE user_id = $1', [req.user.userId]);

        let result = {};
        for (let product of data.rows) {
            result[product.product_id] = { 
                product_id: product.product_id, 
                quantity: product.count_of_products 
            };
        }

        let finalResult = [];
        for (let productId in result) {
            let productData = await pool.query('SELECT * FROM products_a WHERE id = $1', [productId]);
            finalResult.push({
                ...productData.rows[0],   
                quantity: result[productId].quantity  
            });
        }

        res.status(200).json(finalResult);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};

export let editCart = async (req, res) => {
    let { product_id, count_of_products } = req.body;
    
    try {
        let result = await pool.query(
            'UPDATE cart_a SET count_of_products = $1 WHERE product_id = $2 AND user_id = $3',
            [count_of_products, product_id, req.user.userId]
        );

        res.status(200).json(result.rowCount > 0);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};
