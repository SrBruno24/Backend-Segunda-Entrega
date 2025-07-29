# Estructura del Proyecto

```bash
backend_segunda_entrega/
mi-proyecto/
├── node_modules/
├── src/
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css        // Estilos de la aplicación
│   │   └── js/
│   │       └── realtime.js       // Lógica del cliente con websockets
│   ├── routes/
│   │   └── views.router.js     // Rutas para renderizar vistas
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars   // Plantilla principal
│   │   ├── home.handlebars       // Vista estática de productos
│   │   └── realTimeProducts.handlebars // Vista en tiempo real
│   ├── app.js                  // Servidor principal y lógica de sockets
│   ├── ProductManager.js       // Lógica para manejar el archivo de productos
│   └── products.json           // Archivo que almacena los productos
│
└── package.json                // Dependencias y scripts del proyecto