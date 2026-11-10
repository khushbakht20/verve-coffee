/* -------------------------------------------------------------
   Verve Coffee - Shared JavaScript Interactivity
   Author: Khushbakht Siknadar (Roll: 26i-3025, Sec A)
------------------------------------------------------------- */

function order() {
    const cart = getCart();
    if (cart.length === 0) {
        showToast("Your cart is empty! Add items before placing an order.");
        return;
    }
    
    window.alert("Your order has been placed!");
    console.log("Order button was clicked");
    
    localStorage.removeItem('verve_cart');
    updateCartBadge();
    if (document.getElementById('cartTableBody')) {
        renderCartPage();
    }
}

function getCart() {
    const cart = localStorage.getItem('verve_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('verve_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badges = document.querySelectorAll('#cartBadge');
    badges.forEach(badge => {
        badge.textContent = totalItems;
    });
}

function addToCart(id, name, price, img) {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price),
            img: img,
            quantity: 1
        });
    }

    saveCart(cart);
    showToast(`${name} added to cart!`);
}

function updateQuantity(id, change) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === id);

    if (index > -1) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
        renderCartPage();
    }
}

function removeItem(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    renderCartPage();
    showToast('Item removed from cart');
}

function clearCart() {
    localStorage.removeItem('verve_cart');
    saveCart([]);
    renderCartPage();
    showToast('Cart cleared');
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function renderCartPage() {
    const tableBody = document.getElementById('cartTableBody');
    const emptyMsg = document.getElementById('emptyCartMsg');
    const subtotalEl = document.getElementById('subtotalPrice');
    const taxEl = document.getElementById('taxPrice');
    const grandTotalEl = document.getElementById('grandTotalPrice');

    if (!tableBody) return;

    const cart = getCart();

    if (cart.length === 0) {
        tableBody.innerHTML = '';
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (subtotalEl) subtotalEl.textContent = '$0.00';
        if (taxEl) taxEl.textContent = '$0.00';
        if (grandTotalEl) grandTotalEl.textContent = '$0.00';
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    tableBody.innerHTML = '';

    let subtotal = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="cart-item-info">
                    <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                    <strong>${item.name}</strong>
                </div>
            </td>
            <td>$${item.price.toFixed(2)}</td>
            <td>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span style="margin: 0 8px;">${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-small btn-outline" onclick="removeItem('${item.id}')">Remove</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    const tax = subtotal * 0.10;
    const grandTotal = subtotal + tax;

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (grandTotalEl) grandTotalEl.textContent = `$${grandTotal.toFixed(2)}`;
}

function handleReservation(event) {
    event.preventDefault();
    const name = document.getElementById('resName').value;
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('resGuests').value;

    showToast(`Table reserved for ${name} (${guests} guest(s)) on ${date} at ${time}!`);
    document.getElementById('reservationForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();

    const hamburger = document.getElementById('hamburger');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navbar) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }

    const addButtons = document.querySelectorAll('.btn-add-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = btn.getAttribute('data-price');
            const img = btn.getAttribute('data-img');
            addToCart(id, name, price, img);
        });
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuCards = document.querySelectorAll('.menu-item-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            menuCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    if (document.getElementById('cartTableBody')) {
        renderCartPage();
    }
});