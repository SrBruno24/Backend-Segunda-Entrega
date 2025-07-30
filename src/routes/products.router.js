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
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = (await productManager.getProducts()).find(p => p.id === parseInt(pid));
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            return res.status(400).json({ error: 'El precio y el stock deben ser valores numéricos.' });
        }

        const newProduct = { title, description, code, price, stock, category };
        await productManager.addProduct(newProduct);
        
        req.io.emit('updateProducts', await productManager.getProducts());
        res.status(201).json({ message: 'Producto agregado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(parseInt(pid));
        req.io.emit('updateProducts', await productManager.getProducts());
        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;