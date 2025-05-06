// Data storage
let cart = [];
let orders = [];
let purchases = [];
let userName = "Guest";

// Sample products
const products = [
  {
    id: 1,
    name: "Samsung Galaxy S21",
    price: 799,
    brand: "Samsung",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1611162617212-4a9d7f0f6b3f?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1611162617220-6e1e3d7b4b7f?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 2,
    name: "Infinix Zero 5G",
    price: 349,
    brand: "Infinix",
    images: [
      "https://images.unsplash.com/photo-1612831455544-8f4d2d0a8b0c?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1612831455544-8f4d2d0a8b0c?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1612831455544-8f4d2d0a8b0c?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 3,
    name: "Oppo Find X3",
    price: 699,
    brand: "Oppo",
    images: [
      "https://images.unsplash.com/photo-1590080877777-7f3f9d7c1d3e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1590080877777-7f3f9d7c1d3e?auto=format&fit=crop&w=300&q=80",
      "https://images.unsplash.com/photo-1590080877777-7f3f9d7c1d3e?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 4,
    name: "iPhone 13",
    price: 999,
    brand: "Apple",
    images: [
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=300&q=80"
    ]
  },
  {
    id: 5,
    name: "Tecno Phantom X",
    price: 499,
    brand: "Tecno",
    images: [
      "https://images.unsplash.com/photo-1606813909347-7d9e0f8d2f3b?auto=format&fit=crop&w=300&q=80"
    ]
  }
];

// Tab Navigation
const tabs = ["home", "products", "payment", "account"];
document.querySelectorAll('.tab-btn, .cta-btn').forEach(btn => {
  btn.onclick = function() {
    showTab(this.getAttribute('data-tab'));
  };
});
function showTab(tab) {
  tabs.forEach(t => {
    document.getElementById(t).classList.toggle("active", t === tab);
    document.getElementById(t).style.display = (t === tab) ? "block" : "none";
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tab);
    });
  });
  if(tab === "products") renderProducts(products);
  if(tab === "account") renderAccount();
  if(tab === "home") renderFeatured();
}
showTab("home");

// Render Featured Products (Home)
function renderFeatured() {
  const featured = products.slice(0,3);
  document.getElementById('featuredProducts').innerHTML = featured.map(p => `
    <div class="product-preview" onclick="showTab('products')">
      <img src="${p.images[0]}" alt="${p.name}" />
      <h4>${p.name}</h4>
      <p>$${p.price}</p>
    </div>
  `).join('');
}
renderFeatured();

// Render Products (with search filter)
function renderProducts(list) {
  const container = document.getElementById('productsList');
  if(list.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#888;font-size:1.1rem;">No products found.</p>`;
    return;
  }
  container.innerHTML = list.map(p => `
    <div class="product-card">
      ${p.images.length > 1 ? `
        <div class="slideshow-container" data-id="${p.id}">
          ${p.images.map((img,i) => `<img src="${img}" class="slide${i===0?' active':''}" alt="${p.name} image${i+1}" />`).join('')}
          <button class="prev">&#10094;</button>
          <button class="next">&#10095;</button>
        </div>
      ` : `<img src="${p.images[0]}" alt="${p.name}" />`}
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <button class="add-cart-btn" data-id="${p.id}">Add to Cart</button>
        <button class="pay-now-btn" data-id="${p.id}">Pay Now</button>
      </div>
    </div>
  `).join('');
  setupSlideshows();
  setupProductButtons();
}
renderProducts(products);

// Slideshows
function setupSlideshows() {
  document.querySelectorAll('.slideshow-container').forEach(container => {
    const slides = container.querySelectorAll('.slide');
    const prev = container.querySelector('.prev');
    const next = container.querySelector('.next');
    let idx = 0;
    function show(i) {
      slides.forEach((s, j) => s.classList.toggle('active', j === i));
    }
    prev.onclick = () => { idx = (idx-1+slides.length)%slides.length; show(idx); };
    next.onclick = () => { idx = (idx+1)%slides.length; show(idx); };
    show(idx);
  });
}

// Add product to cart and orders
function addProductToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Add to cart
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Add order with current date
  const purchaseDate = new Date().toISOString();
  orders.push({
    id: orders.length + 1,
    productName: product.name,
    date: purchaseDate,
    status: "Pending"
  });

  updateAccountDisplay();
  alert(`${product.name} added to cart and orders.`);
}

// Update account section display
function updateAccountDisplay() {
  // Update total orders count
  document.getElementById("totalOrders").textContent = orders.length;

  // Update pending orders count
  const pendingCount = orders.filter(o => o.status === "Pending").length;
  document.getElementById("pendingOrders").textContent = pendingCount;

  // Update last order date
  if (orders.length > 0) {
    const lastDate = new Date(
      orders.reduce((max, o) => (new Date(o.date) > new Date(max) ? o.date : max), orders[0].date)
    );
    document.getElementById("lastOrderDate").textContent = lastDate.toLocaleDateString();
  } else {
    document.getElementById("lastOrderDate").textContent = "-";
  }

  // Update orders table
  const tbody = document.getElementById("ordersTableBody");
  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No orders yet.</td></tr>`;
  } else {
    tbody.innerHTML = orders.map((order, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${order.productName}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
        <td><button class="btn view-btn" onclick="alert('Viewing order #${order.id}')">View</button></td>
      </tr>
    `).join("");
  }

  // Update total cart amount
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartTotalAmount").textContent = `$${totalAmount.toFixed(2)}`;
}

// Handle Pay Total button click
document.getElementById("payTotalBtn").addEventListener("click", () => {
  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalAmount === 0) {
    alert("Your cart is empty. Please add products before paying.");
    return;
  }
  showTab("payment");
  alert(`Proceed to payment. Total amount: $${totalAmount.toFixed(2)}`);
});

// Setup product buttons
function setupProductButtons() {
  document.querySelectorAll(".add-cart-btn").forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute("data-id"));
      addProductToCart(id);
    };
  });
  document.querySelectorAll(".pay-now-btn").forEach(btn => {
    btn.onclick = () => {
      const id = parseInt(btn.getAttribute("data-id"));
      addProductToCart(id);
      showTab("payment");
    };
  });
}
