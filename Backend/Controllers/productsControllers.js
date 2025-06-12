import { pool } from "../db.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let __filename = fileURLToPath(import.meta.url);
let __dirname = path.dirname(__filename);

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
            fs.unlinkSync(req.file.path); 
        }
        return res.status(400).json({ error: "Не заполнены обязательные поля" });
    }

    try {
        let result = await pool.query(
            `INSERT INTO products_a (title, description, img_url, price, count, category, brand, discount, composition) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                title, 
                description, 
                img_url, 
                parseFloat(price), 
                parseInt(count), 
                category, 
                brand, 
                discount ? parseFloat(discount) : null,
                composition
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let delete_products = async (req, res) => {
    let { id } = req.params;
    try {
        let productResult = await pool.query('SELECT img_url FROM products_a WHERE id = $1', [id]);
        let product = productResult.rows[0];
        
        if (!product) {
            return res.status(404).json({ error: "Товар не найден" });
        }

        let result = await pool.query('DELETE FROM products_a WHERE id = $1 RETURNING *', [id]);
        
        if (product.img_url) {
            let imagePath = path.join(__dirname, '../public', product.img_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json(result.rows[0] || null);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

export let edit_products = async (req, res) => {
  let { id } = req.params;
  let {
    title,
    description,
    price,
    count,
    category,
    brand,
    discount,
    composition,
  } = req.body;

  let priceFloat = parseFloat(price);
  if (isNaN(priceFloat)) {
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'Поле price должно быть числом' });
  }

  let countInt = parseInt(count, 10);
  if (isNaN(countInt)) countInt = 0;

  let discountFloat = parseFloat(discount);
  if (isNaN(discountFloat)) discountFloat = 0;

  try {
    let current = await pool.query(
      'SELECT img_url FROM products_a WHERE id = $1',
      [id]
    );
    if (current.rows.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Товар не найден' });
    }

    let oldImgUrl = current.rows[0].img_url;
    let newImgUrl = req.file 
      ? '/uploads/' + req.file.filename 
      : oldImgUrl;

    let result = await pool.query(
      `UPDATE products_a
         SET title       = $1,
             description = $2,
             img_url     = $3,
             price       = $4,
             count       = $5,
             category    = $6,
             brand       = $7,
             discount    = $8,
             composition = $9
       WHERE id = $10
       RETURNING *;`,
      [
        title,
        description,
        newImgUrl,
        priceFloat,
        countInt,
        category,
        brand,
        discountFloat,
        composition,
        id,
      ]
    );

    if (req.file && oldImgUrl) {
      let oldPath = path.join(__dirname, '../public', oldImgUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    let prod = result.rows[0];
    let responseProduct = {
      ...prod,
      price:  prod.price.toString(),
      count:  prod.count.toString(),
      discount: prod.discount != null 
                  ? prod.discount.toString() 
                  : '0',
    };

    return res.status(200).json(responseProduct);
  } catch (err) {
    console.error('Error in edit_products:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }
};