// === Data ===
const PLANTS = [
  { id: 'p1', name: 'Aloe Vera', price: 12.99, category: 'Succulents', img: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=60' },
  { id: 'p2', name: 'Haworthia', price: 9.50, category: 'Succulents', img: 'https://images.unsplash.com/photo-1544551763-1b2ac1c377cc?auto=format&fit=crop&w=800&q=60' },
  { id: 'p3', name: 'Snake Plant', price: 15.49, category: 'Air Purifiers', img: 'https://images.unsplash.com/photo-1587502536263-6b0b47a94d2d?auto=format&fit=crop&w=800&q=60' },
  { id: 'p4', name: 'Monstera Deliciosa', price: 22.50, category: 'Air Purifiers', img: 'https://images.unsplash.com/photo-1622202228870-2ab6a3bcd299?auto=format&fit=crop&w=800&q=60' },
  { id: 'p5', name: 'Peace Lily', price: 18.00, category: 'Flowering', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=60' },
  { id: 'p6', name: 'ZZ Plant', price: 19.75, category: 'Flowering', img: 'https://images.unsplash.com/photo-1560184897-6b9a9de0a4cc?auto=format&fit=crop&w=800&q=60' }
];

// === Elements ===
const ROOT = document.getElementById('appRoot');
const HEADER = document.getElementById('appHeader');

// === Routing ===
window.addEventListener('hashchange', renderRoute);
renderRoute();

// === Header ===
store.subscribe(renderHeaderCartCount);
function renderHeaderCartCount() {
  const total = Object.values(store.getState().cart).reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCountHeader').textContent = total;
}

// === Navigation ===
function navigateTo(hash) {
  location.hash = hash;
  renderRoute();
}

// === Page Renderers ===
function renderRoute() {
  const hash = location.hash || '#/';
  HEADER.style.display = (hash === '#/' ? 'none' : 'flex');
  if (hash === '#/' || hash === '') renderLanding();
  else if (hash.startsWith('#/products')) renderProducts();
  else if (hash.startsWith('#/cart')) renderCart();
}

function renderLanding() {
  ROOT.innerHTML = `
  <section class="landing">
    <div class="left">
      <div class="company-name">GreenLeaf</div>
      <p class="company-desc">GreenLeaf brings easy-care, premium houseplants to your home. From succulents to air-purifying favorites, we help you grow happiness indoors.</p>
      <a href="#/products" class="btn" onclick="navigateTo('#/products')">Get Started →</a>
    </div>
    <div class="right"><img src="https://images.unsplash.com/photo-1524594154904-5a2c6c44e2b2?auto=format&fit=crop&w=600&q=60" width="220" style="border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,0.12);"></div>
  </section>`;
}

function renderProducts() {
  const state = store.getState();
  const groups = {};
  PLANTS.forEach(p => { if (!groups[p.category]) groups[p.category] = []; groups[p.category].push(p); });
  let html = `<h1>Shop Plants</h1>`;
  for (const [cat, list] of Object.entries(groups)) {
    html += `<div class="category"><h2>${cat}</h2><div class="products-grid">`;
    list.forEach(p => {
      const disabled = state.disabled[p.id];
      html += `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h3>${p.name}</h3>
        <div class="meta">${p.category}</div>
        <div class="price">$${p.price.toFixed(2)}</div>
        <div class="actions">
          <button class="btn-outline" onclick="viewDetails('${p.id}')">Details</button>
          <button class="btn ${disabled ? 'disabled' : ''}" onclick="addItem('${p.id}')" ${disabled ? 'disabled' : ''}>${disabled ? 'Added' : 'Add to Cart'}</button>
        </div>
      </div>`;
    });
    html += `</div></div>`;
  }
  ROOT.innerHTML = html;
}

function renderCart() {
  const { cart } = store.getState();
  const items = Object.values(cart);
  if (items.length === 0) {
    ROOT.innerHTML = `<div style="padding:20px;background:white;border-radius:8px;">Your cart is empty. <a href="#/products">Continue shopping</a>.</div>`;
    return;
  }
  const totalCount = items.reduce((a,b)=>a+b.qty,0);
  const totalPrice = items.reduce((a,b)=>a+b.qty*b.item.price,0);
  let html = `<h1>Your Cart</h1>`;
  items.forEach(i=>{
    html += `
    <div class="cart-row">
      <img src="${i.item.img}" class="cart-thumb">
      <div class="cart-info">
        <div><strong>${i.item.name}</strong><br><span class="meta">$${i.item.price.toFixed(2)} each</span></div>
        <div class="qty-controls">
          <button class="icon-btn" onclick="dec('${i.id}')">−</button>
          <div>${i.qty}</div>
          <button class="icon-btn" onclick="inc('${i.id}')">+</button>
        </div>
      </div>
      <button class="btn-outline" onclick="del('${i.id}')">Delete</button>
    </div>`;
  });
  html += `<div class="summary"><div class="summary-row"><div>Total items</div><div>${totalCount}</div></div>
  <div class="summary-row"><div>Total cost</div><div>$${totalPrice.toFixed(2)}</div></div>
  <button class="btn" onclick="alert('Checkout Coming Soon!')">Checkout</button>
  <button class="btn-outline" onclick="navigateTo('#/products')">Continue Shopping</button></div>`;
  ROOT.innerHTML = html;
}

// === Actions ===
function addItem(id){ const plant = PLANTS.find(p=>p.id===id); store.dispatch(addToCartAction(plant)); renderProducts(); }
function inc(id){ store.dispatch(incrementItemAction(id)); renderCart(); }
function dec(id){ store.dispatch(decrementItemAction(id)); renderCart(); }
function del(id){ store.dispatch(deleteItemAction(id)); renderCart(); }
function viewDetails(id){ const p = PLANTS.find(x=>x.id===id); alert(`${p.name} — $${p.price.toFixed(2)}\n\n${p.category}`); }
