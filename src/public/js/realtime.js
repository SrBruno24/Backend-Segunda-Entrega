const socket = io();
const productsContainer = document.getElementById('products-container');
const addForm = document.getElementById('add-product-form');

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
            <button class="delete-btn" data-id="${product.id}">Eliminar</button>
        `;
        ul.appendChild(li);
    });
    productsContainer.appendChild(ul);
};

socket.on('updateProducts', (products) => {
    renderProducts(products);
});

productsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const productId = event.target.dataset.id;
        socket.emit('deleteProduct', productId);
        
        Swal.fire({
            icon: 'info',
            title: 'Producto eliminado',
            text: `Se envió la solicitud para eliminar el producto con ID ${productId}.`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
        });
    }
});

addForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newProduct = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
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
const filterNonNumericInput = (event) => { event.target.value = event.target.value.replace(/[^0-9]/g, ''); };
priceInput.addEventListener('input', filterNonNumericInput);
stockInput.addEventListener('input', filterNonNumericInput);