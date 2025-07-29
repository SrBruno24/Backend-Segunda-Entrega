import { promises as fs } from 'fs';

export class CartManager {
    constructor(path) {
        this.path = path;
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getCartById(id) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === id);
        return cart;
    }

    async createCart() {
        const carts = await this.getCarts();
        const newCart = {
            id: Date.now(),
            products: []
        };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            return null; // Carrito no encontrado
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            // Si el producto ya existe, incrementamos la cantidad
            cart.products[productIndex].quantity += 1;
        } else {
            // Si no existe, lo agregamos
            cart.products.push({ product: productId, quantity: 1 });
        }
        
        carts[cartIndex] = cart;
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}