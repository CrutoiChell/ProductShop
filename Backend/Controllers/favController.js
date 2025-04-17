import { pool } from "../db.js";

// export let addFav = async (req, res) => {
//     let { product_id } = req.body;

//     try {

//         let result = await pool.query(
//             'SELECT * FROM favourites_a WHERE user_id = $1 AND product_id = $2',
//             [req.user.userId, product_id]
//         );

//         if (result.rows.length > 0) {
//             return res.status(400).json({ message: "Этот продукт уже добавлен в избранное" });
//         }

//         await pool.query(
//             'INSERT INTO favourites_a (user_id, product_id) VALUES ($1, $2)',
//             [req.user.userId, product_id]
//         );

//         res.status(200).json(true);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(null);
//     }
// };

// export let deleteFav = async (req, res) => {
//     let { id } = req.params;

//     try {
//         let result = await pool.query(
//             'DELETE FROM favourites_a WHERE product_id = $1 AND user_id = $2',
//             [id, req.user.userId]
//         );

//         res.status(200).json(result.rowCount > 0);
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(null);
//     }
// };


export let AddOrDeleteFav = async (req, res) => {
    let { product_id, isFav } = req.body
    
    try {
        if (!isFav) {
            await pool.query(
                'INSERT INTO favourites_a (user_id, product_id) VALUES ($1, $2)',
                [req.user.userId, product_id]
            );

            res.status(200).json(true);
        } else {
            await pool.query(
                'DELETE FROM favourites_a WHERE product_id = $1 AND user_id = $2',
                [product_id, req.user.userId]
            );

            res.status(200).json(true);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
}

export let checkProd = async (req, res) => {
    let { id } = req.params;
    
    try {
        let result = await pool.query('SELECT * FROM favourites_a WHERE user_id = $1 AND product_id = $2', [req.user.userId, id])
        res.json(result.rows.length > 0 ? true : false)
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
}

export let getUserFavs = async (req, res) => {
    try {
        let favId = await pool.query('SELECT * FROM favourites_a WHERE user_id = $1', [req.user.userId]);
        let result = {}

        for (let product of favId.rows) {
            result[product.product_id] = {
                product_id: product.product_id,
            };
        }

        let finalResult = [];
        for (let productId in result) {
            let productData = await pool.query('SELECT * FROM products_a WHERE id = $1', [productId]);
            finalResult.push({
                ...productData.rows[0],
            });
        }
        res.status(200).json(finalResult);
    } catch (err) {
        console.log(err);
        res.status(500).json(null);
    }
};
