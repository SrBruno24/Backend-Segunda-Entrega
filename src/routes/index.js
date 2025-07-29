import { Router } from 'express';
import productsRouter from './products.router.js';
import cartsRouter from './carts.router.js';
import viewsRouter from './views.router.js';

const router = Router();

// Definimos las rutas base para cada router
router.use('/api/products', productsRouter);
router.use('/api/carts', cartsRouter);
router.use('/', viewsRouter); // Las vistas se sirven desde la raíz

export default router;