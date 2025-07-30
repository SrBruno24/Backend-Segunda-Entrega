import { promises as fs } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        
        const newProductWithId = {
            ...product,
            id: Date.now(),
            status: true,
        };
        
        products.push(newProductWithId);
        
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        
        return newProductWithId;
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        
        products = products.filter(p => p.id !== id);

        if (products.length === initialLength) {
            console.log(`No se encontró el producto con id ${id}`);
            return false;
        }

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return true;
    }
}