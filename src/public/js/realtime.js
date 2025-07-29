const socket = io();
const productsContainer = document.getElementById('products-container');
const addForm = document.getElementById('add-product-form');
const deleteForm = document.getElementById('delete-product-form');

const renderProducts = (products) => {
    productsContainer.innerHTML = '';
    if (products.length === 0) {
        productsContainer.innerHTML = '<p>No hay productos para mostrar.</p>';
        return;
    }
    const ul = document.createElement('ul');
    ul.className = 'product-list';
    products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-item';
        li.innerHTML = `
            <div>
                <strong>${product.title} (ID: ${product.id})</strong>
                <p>${product.description}</p>
                <p>Código: ${product.code} | Stock: ${product.stock} | Categoría: ${product.category}</p>
                <p>Precio: $${product.price}</p>
            </div>
        `;
        ul.appendChild(li);
    });
    productsContainer.appendChild(ul);
};

socket.on('updateProducts', (products) => {
    renderProducts(products);
});

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const thumbnailsInput = document.getElementById('thumbnails').value;
    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: thumbnailsInput ? thumbnailsInput.split(',').map(url => url.trim()) : []
    };

    if (!newProduct.title || !newProduct.description || !newProduct.code || isNaN(newProduct.price) || isNaN(newProduct.stock) || !newProduct.category) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, completá todos los campos obligatorios.',
        });
        return;
    }

    socket.emit('newProduct', newProduct);

    Swal.fire({
        icon: 'success',
        title: '¡Producto agregado!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
    });

    addForm.reset();
});

const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const productIdInput = document.getElementById('productId');
const filterNonNumericInput = (event) => { event.target.value = event.target.value.replace(/[^0-9]/g, ''); };
priceInput.addEventListener('input', filterNonNumericInput);
stockInput.addEventListener('input', filterNonNumericInput);
productIdInput.addEventListener('input', filterNonNumericInput);

deleteForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const productId = productIdInput.value;
    if (!productId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Por favor, ingresá el ID de un producto.' });
        return;
    }
    socket.emit('deleteProduct', productId);
    Swal.fire({ icon: 'info', title: 'Producto eliminado', text: `Solicitud enviada para eliminar ID ${productId}.`, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    deleteForm.reset();
});