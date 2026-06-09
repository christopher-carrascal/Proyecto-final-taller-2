document.addEventListener("DOMContentLoaded", () => {

    fetch('../PHP/SiHay.php')
        .then(response => response.json())
        .then(data => {
            if (data.logueado) {

                // Ocultar botones de invitado
                document.querySelectorAll('.invitado').forEach(elemento => {
                    elemento.classList.add('hidden');
                });

                // Mostrar menú de usuario
                //Ahora muestra todo lo oculto
                document.querySelectorAll('.usuario-registrado').forEach(elemento => {
                    elemento.classList.remove('hidden');
                });

                // Personalizar el texto del botón Cuenta dentro del dropdown
                const botonCuenta = document.querySelector('.usuario-registrado.dropdown');

                if (botonCuenta) {
                    const enlaceTexto = botonCuenta.querySelector('.MiCuenta');

                    if (enlaceTexto) {
                        enlaceTexto.textContent = `Cuenta (${data.usuario})`;
                    }
                }

                //Verifica si soy admin, y si lo soy, muestro el botón de admin
                if (data.rol === 'admin') {
                    const botonAdmin = document.querySelector('.opcion-admin');
                    if (botonAdmin) {
                        botonAdmin.classList.remove('hidden');
                    }
                }

                // Dropdown de cuenta
                const dropdown = document.querySelector('.dropdown');
                const dropdownContent = dropdown?.querySelector('.dropdown-content');
                const btnCuenta = dropdown?.querySelector('.MiCuenta');
                const btnCarro = dropdown?.querySelector('.MiCarro');
                const btnCerrar = document.querySelector('.btn-cerrar');

                if (btnCuenta && dropdownContent) {
                    btnCuenta.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        dropdownContent.classList.toggle('show');
                    });
                }

                document.addEventListener('click', (e) => {
                    if (!dropdown?.contains(e.target)) {
                        dropdownContent?.classList.remove('show');
                    }
                });

                if (btnCerrar) {
                    btnCerrar.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.location.href = btnCerrar.href;
                    });
                }

                if (btnCarro) {
                    btnCarro.addEventListener('click', (e) => {
                        e.stopPropagation();
                        window.location.href = btnCarro.href;
                    });
                }
            }
        })
        .catch(error => {
            console.error("Error revisando la sesión:", error);
        });
        
});

const CART_KEY = 'cart_items_v1'

function $(sel, root=document){return root.querySelector(sel)}
function $all(sel, root=document){return Array.from(root.querySelectorAll(sel))}

function parsePrice(str){return Number(String(str).replace(/[^0-9\.]+/g,''))}
function formatPrice(n){return '$'+n.toFixed(2)}

function loadCart(){
	const raw = localStorage.getItem(CART_KEY)
	return raw? JSON.parse(raw): []
}

function saveCart(cart){
	localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

function findProductElement(btn){
	return btn.closest('.product')
}

function getProductData(productEl){
	const id = productEl.dataset.id
	const title = $('h3', productEl).textContent.trim()
	const price = parsePrice($('.price', productEl).textContent)
	const img = $('img', productEl).getAttribute('src')
	return {id,title,price,img}
}

function addToCart(prod){
	const cart = loadCart()
	const existing = cart.find(i=>i.id==prod.id)
	if(existing){ existing.qty += 1 }
	else cart.push({...prod, qty:1})
	saveCart(cart)
	renderCart()
}

function removeFromCart(id){
	let cart = loadCart()
	cart = cart.filter(i=>i.id!=id)
	saveCart(cart)
	renderCart()
}

function changeQty(id, delta){
	const cart = loadCart()
	const item = cart.find(i=>i.id==id)
	if(!item) return
	item.qty = Math.max(1, item.qty + delta)
	saveCart(cart)
	renderCart()
}

function clearCart(){ localStorage.removeItem(CART_KEY); renderCart() }

function renderCart(){
	const container = $('#cart-items')
	container.innerHTML = ''
	const cart = loadCart()
	if(cart.length===0){
		container.innerHTML = '<p class="empty">El carrito está vacío.</p>'
		$('#cart-subtotal').textContent = formatPrice(0)
		return
	}

	let subtotal = 0
	cart.forEach(item=>{
		subtotal += item.price * item.qty
		const node = document.createElement('div')
		node.className = 'cart-item'
		node.innerHTML = `
			<img src="${item.img}" alt="${item.title}">
			<div class="meta">
				<h4>${item.title}</h4>
				<p>${formatPrice(item.price)}</p>
			</div>
			<div class="qty-controls">
				<button class="qty-decrease" data-id="${item.id}">-</button>
				<span class="qty">${item.qty}</span>
				<button class="qty-increase" data-id="${item.id}">+</button>
			</div>
			<div class="remove">
				<button class="btn secondary remove-item" data-id="${item.id}">Eliminar</button>
			</div>
		`
		container.appendChild(node)
	})

	$('#cart-subtotal').textContent = formatPrice(subtotal)

	// attach handlers
	$all('.qty-decrease').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.id, -1)))
	$all('.qty-increase').forEach(b=>b.addEventListener('click',()=>changeQty(b.dataset.id, 1)))
	$all('.remove-item').forEach(b=>b.addEventListener('click',()=>removeFromCart(b.dataset.id)))
}

function init(){
	// add-to-cart buttons
	$all('.add-to-cart').forEach(btn=>{
		btn.addEventListener('click', e=>{
			const prodEl = findProductElement(btn)
			if(!prodEl) return
			const data = getProductData(prodEl)
			addToCart(data)
		})
	})

	$('#clear-cart').addEventListener('click',()=>{
		if(confirm('¿Vaciar el carrito?')) clearCart()
	})

	$('#checkout').addEventListener('click',()=>{
		const cart = loadCart()
		if(cart.length===0){ alert('El carrito está vacío.'); return }
		// aquí integrarías la pasarela de pago o envío a servidor
		alert('Proceder a pagar. Total: '+$('#cart-subtotal').textContent)
	})

	renderCart()
}

document.addEventListener('DOMContentLoaded', init)

