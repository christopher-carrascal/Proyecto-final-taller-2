document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    if (productList) {
        productList.innerHTML = '<p class="empty">Cargando productos...</p>';
    }

    fetch('../PHP/Productos.php')
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                showError(`No se pudieron cargar los productos. ${data.error || ''}`);
                return;
            }
            renderProducts(data.products);
        })
        .catch(error => {
            showError('Error al cargar el catálogo desde el servidor.');
            console.error('Error al cargar productos:', error);
        });
});

function normalizeProduct(row) {
    return {
        id: row.id ?? row.ID ?? row.producto_id ?? row.codigo ?? row.id_producto ?? row[Object.keys(row)[0]] ?? '',
        title: row.nombre ?? row.titulo ?? row.title ?? row.producto ?? row.nombre_producto ?? 'Producto',
        price: row.precio ?? row.price ?? row.costo ?? row.valor ?? 0,
        image: row.imagen ?? row.imagen_url ?? row.image ?? row.img ?? row.foto ?? '',
        description: row.descripcion ?? row.descripcion_producto ?? row.detalle ?? row.descripcion_corta ?? ''
    };
}

function formatImage(src) {
    const value = String(src || '').trim();
    if (!value) {
        return '../IMAGENES/Imagotipo.png';
    }
    if (value.startsWith('http') || value.startsWith('../') || value.startsWith('./')) {
        return value;
    }
    return `../IMAGENES/${value}`;
}

function formatPrice(value) {
    const number = Number(String(value).replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0;
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    }).format(number);
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    if (!Array.isArray(products) || products.length === 0) {
        productList.innerHTML = '<p class="empty">No hay productos disponibles en el catálogo.</p>';
        return;
    }

    productList.innerHTML = '';

    products.forEach(row => {
        const product = normalizeProduct(row);
        const card = document.createElement('article');
        card.className = 'product';
        card.dataset.id = product.id;

        card.innerHTML = `
            <img src="${formatImage(product.image)}" alt="${escapeHtml(product.title)}">
            <div class="product-info">
                <h3>${escapeHtml(product.title)}</h3>
                <p class="price">${formatPrice(product.price)}</p>
                ${product.description ? `<p class="description">${escapeHtml(product.description)}</p>` : ''}
                <button class="btn">Ver más</button>
            </div>
        `;
        productList.appendChild(card);
    });
}

function showError(message) {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = `<p class="empty">${escapeHtml(message)}</p>`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
