import { Router } from 'express';
import { ProductManager } from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productManager = new ProductManager(path.join(__dirname, '..', 'data/products.json'));
const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

export default router;