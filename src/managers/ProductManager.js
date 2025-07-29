import { promises as fs } from 'fs';

export class ProductManager {
    constructor(path) {
        this.path = path;
    }

    // Método para leer los productos del archivo
    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Si el archivo no existe, devolvemos un array vacío
            return [];
        }
    }

    // Método para agregar un producto
    async addProduct(product) {
        const products = await this.getProducts();
        
        // Asignamos el ID y el status por defecto
        const newProductWithId = {
            ...product,
            id: Date.now(), // ID único basado en el timestamp
            status: true,
        };
        
        products.push(newProductWithId);
        
        // Escribimos el array actualizado de vuelta al archivo
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        
        return newProductWithId;
    }

    // Método para eliminar un producto
    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        
        products = products.filter(p => p.id !== id);

        if (products.length === initialLength) {
            console.log(`No se encontró el producto con id ${id}`);
            return false; // Indicamos que no se eliminó nada
        }

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return true; // Indicamos que la eliminación fue exitosa
    }
}