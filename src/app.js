import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import http from 'http';
import mainRouter from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProductManager } from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;
const httpServer = http.createServer(app);
const io = new Server(httpServer);

const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use('/', mainRouter);

io.on('connection', async (socket) => {
    console.log('Cliente conectado con Socket.IO:', socket.id);

    socket.emit('updateProducts', await productManager.getProducts());

    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product);
        io.emit('updateProducts', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProduct(parseInt(productId));
        io.emit('updateProducts', await productManager.getProducts());
    });
    
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log('Rutas de Vistas: http://localhost:8080/');
    console.log('Rutas de API de productos: http://localhost:8080/api/products');
    console.log('Rutas de API de carritos: http://localhost:8080/api/carts');
});