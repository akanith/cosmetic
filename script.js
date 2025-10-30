/* ==========================================================
   Glow & Mint — Unified JS for All Pages
   Handles:
   - Product listing & details
   - Cart management
   - Wishlist management
   - Checkout flow
   ========================================================== */

// =====================
// GLOBAL PRODUCT DATA
// =====================
window.appProducts = [
  {
    id: 'SK001',
    title: 'HydraGlow Face Cream',
    price: 899,
    rating: 4.6,
    img: 'https://via.placeholder.com/380?text=HydraGlow',
    short: 'Intense hydration and glowing skin',
    specs: { Size: '50ml', Skin: 'All types', 'Cruelty-free': 'Yes' },
    desc: 'Use twice daily for radiant, smooth, and hydrated skin.'
  },
  {
    id: 'SK002',
    title: 'Radiant Serum',
    price: 1299,
    rating: 4.8,
    img: 'https://via.placeholder.com/380?text=Radiant+Serum',
    short: 'Vitamin C & Hyaluronic blend',
    specs: { Size: '30ml', Benefits: 'Brightening', Ingredients: 'Vitamin C' },
    desc: 'Apply morning and evening for luminous, healthy skin.'
  },
  {
    id: 'SK003',
    title: 'Mint Cleanser',
    price: 499,
    rating: 4.4,
    img: 'https://via.placeholder.com/380?text=Mint+Cleanser',
    short: 'Gentle foaming cleanser with mint extract',
    specs: { Size: '100ml', Type: 'Gel', Scent: 'Fresh Mint' },
    desc: 'Removes impurities without drying the skin.'
  },
  {
    id: 'SK004',
    title: 'Aloe Moist Gel',
    price: 699,
    rating: 4.7,
    img: 'https://via.placeholder.com/380?text=Aloe+Moist+Gel',
    short: 'Soothing aloe-based daily moisturizer',
    specs: { Size: '100ml', Type: 'Gel', Key: 'Aloe Vera' },
    desc: 'Lightweight and non-sticky hydration for all skin types.'
  }
];

// =====================
// STORAGE HELPERS
// =====================
function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function getWishlist() {
  return JSON.parse(localStorage.getItem('wishlist')) || [];
}

function saveWishlist(list) {
  localStorage.setItem('wishlist', JSON.stringify(list));
}

// =====================
// CART MANAGEMENT
// =====================
function addToCart(product) {
  let cart = getCart();
  const existing = cart.find(item => item.id === product.id);

  if (existing) existing.qty += 1;
  else cart.push({ ...product, qty: 1 });

  saveCart(cart);
  showToast(`${product.title} added to cart 🛍️`);
}

function removeFromCart(index) {
  let cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('[id^="cartCount"]').forEach(el => el.textContent = count);
}

// =====================
// WISHLIST MANAGEMENT
// =====================
function toggleWishlist(product) {
  let list = getWishlist();
  const exists = list.find(p => p.id === product.id);
  if (exists) {
    list = list.filter(p => p.id !== product.id);
    showToast(`${product.title} removed from wishlist 💔`);
  } else {
    list.push(product);
    showToast(`${product.title} added to wishlist ❤️`);
  }
  saveWishlist(list);
  renderWishlist();
}

// =====================
// TOAST ANIMATION
// =====================
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '25px';
  toast.style.right = '25px';
  toast.style.background = '#ff7eb3';
  toast.style.color = '#fff';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '10px';
  toast.style.fontSize = '14px';
  toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  toast.style.transition = 'all 0.4s ease';
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 500);
  }, 1200);
}

// =====================
// RENDER PRODUCTS
// =====================
function renderProducts(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  window.appProducts.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="price">₹${p.price}</p>
      <p class="rating">★ ${p.rating}</p>
      <div class="actions">
        <button class="btn small primary view-btn">View</button>
        <button class="btn small accent add-cart">Add to Cart</button>
        <button class="btn small outline wish-btn">♡</button>
      </div>
    `;
    card.querySelector('.add-cart').addEventListener('click', () => addToCart(p));
    card.querySelector('.wish-btn').addEventListener('click', () => toggleWishlist(p));
    card.querySelector('.view-btn').addEventListener('click', () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });
    container.appendChild(card);
  });
}

// =====================
// RENDER CART PAGE
// =====================
function renderCart() {
  const container = document.getElementById('cartContainer');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-msg">Your cart is empty 💔</p>';
    return;
  }

  let total = 0;
  let html = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th>
        </tr>
      </thead>
      <tbody>
  `;

  cart.forEach((item, i) => {
    const subtotal = item.price * item.qty;
    total += subtotal;
    html += `
      <tr>
        <td><img src="${item.img}" alt="${item.title}" class="thumb"> ${item.title}</td>
        <td>₹${item.price}</td>
        <td><input type="number" value="${item.qty}" min="1" data-index="${i}" class="qty-input"></td>
        <td>₹${subtotal}</td>
        <td><button class="remove-btn" data-index="${i}">✖</button></td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <div class="cart-footer">
      <h3>Total: ₹${total}</h3>
      <button id="clearCart" class="btn outline">Clear Cart</button>
      <a href="checkout.html" class="btn primary">Checkout →</a>
    </div>
  `;

  container.innerHTML = html;

  // Event listeners for qty change & remove
  container.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', e => {
      const idx = e.target.dataset.index;
      const cart = getCart();
      cart[idx].qty = parseInt(e.target.value);
      saveCart(cart);
      renderCart();
    });
  });

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      removeFromCart(e.target.dataset.index);
    });
  });

  const clearBtn = document.getElementById('clearCart');
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('cart');
    updateCartCount();
    renderCart();
  });
}

// =====================
// RENDER WISHLIST
// =====================
function renderWishlist() {
  const container = document.getElementById('wishlistContainer');
  if (!container) return;

  const list = getWishlist();
  if (list.length === 0) {
    container.innerHTML = '<p class="empty-msg">Your wishlist is empty 💔</p>';
    return;
  }

  container.innerHTML = '';
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'wishlist-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="price">₹${p.price}</p>
      <div class="actions">
        <button class="btn small primary add">Add to Cart</button>
        <button class="btn small outline remove">Remove</button>
      </div>
    `;
    card.querySelector('.add').addEventListener('click', () => addToCart(p));
    card.querySelector('.remove').addEventListener('click', () => {
      const updated = list.filter(item => item.id !== p.id);
      saveWishlist(updated);
      renderWishlist();
    });
    container.appendChild(card);
  });
}

// =====================
// CHECKOUT PAGE
// =====================
function renderCheckout() {
  const container = document.getElementById('checkoutSummary');
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = '<p>No items to checkout.</p>';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  container.innerHTML = `
    <h3>Order Summary</h3>
    <ul>${cart.map(i => `<li>${i.title} x ${i.qty}</li>`).join('')}</ul>
    <p><strong>Total:</strong> ₹${total}</p>
    <button id="confirmOrder" class="btn accent">Confirm Order</button>
  `;

  document.getElementById('confirmOrder').addEventListener('click', () => {
    alert('🎉 Order placed successfully!');
    localStorage.removeItem('cart');
    updateCartCount();
    window.location.href = 'index.html';
  });
}

// =====================
// INITIALIZE
// =====================
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderProducts('productContainer');
  renderCart();
  renderWishlist();
  renderCheckout();
});
