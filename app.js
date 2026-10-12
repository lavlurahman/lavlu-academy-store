const products = [
  {
    id: 1,
    title: "ভেক্টর — সম্পূর্ণ অধ্যায় নোট",
    category: "HSC Physics",
    level: "HSC পদার্থবিজ্ঞান ১ম পত্র",
    price: 50,
    oldPrice: 50,
    tag: "জনপ্রিয়",
    description: "ভেক্টর অধ্যায়ের বোর্ড প্রশ্ন ও CQ সমাধান। ২১ পৃষ্ঠার PDF। কিছু অংশ আপডেট করা বাকি; পরবর্তী সংস্করণে সংশোধন করা হবে।",
    a: "#0c9a70",
    b: "#075744",
    pages: 21,
    format: "PDF"
},
  {
    id: 2,
    title: "গতি ও গতির সমীকরণ",
    category: "SSC Physics",
    level: "নবম–দশম শ্রেণি",
    price: 80,
    oldPrice: 120,
    tag: "নতুন",
    description: "গুরুত্বপূর্ণ সূত্র, সমাধানসহ গাণিতিক সমস্যা ও অনুশীলন।",
    a: "#477ed8",
    b: "#243e83"
  },
  {
    id: 3,
    title: "HSC Physics MCQ প্রশ্নব্যাংক",
    category: "প্রশ্নব্যাংক",
    level: "HSC পরীক্ষা প্রস্তুতি",
    price: 150,
    oldPrice: 200,
    tag: "প্র্যাকটিস",
    description: "অধ্যায়ভিত্তিক বহুনির্বাচনি প্রশ্নের অনুশীলনের জন্য নমুনা প্যাক।",
    a: "#e49a42",
    b: "#a74b25"
  },
  {
    id: 4,
    title: "নিউটনীয় বলবিদ্যা — শর্ট নোট",
    category: "HSC Physics",
    level: "HSC পদার্থবিজ্ঞান ১ম পত্র",
    price: 100,
    oldPrice: 150,
    tag: "নোট",
    description: "ধারণা, প্রয়োজনীয় সূত্র এবং নির্বাচিত গাণিতিক সমস্যার সারাংশ।",
    a: "#7b68c7",
    b: "#433177"
  }
];

const CART_STORAGE_KEY = "lavluAcademyDemoCart";

const money = n =>
  "৳" + new Intl.NumberFormat("bn-BD").format(n);

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

let cart = loadCart();
let activeFilter = "সব";

// আগের কার্ট সংরক্ষিত থাকলে সেটি লোড করবে
function loadCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_STORAGE_KEY) || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved
      .filter(id => products.some(p => p.id === Number(id)))
      .map(Number);
  } catch (error) {
    return [];
  }
}

// কার্ট ব্রাউজারে সংরক্ষণ করবে
function saveCart() {
  try {
    localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(cart)
    );
  } catch (error) {
    console.warn("কার্ট সংরক্ষণ করা যায়নি।", error);
  }
}

// নোটের তালিকা দেখাবে
function renderProducts() {
  const query = searchInput.value
    .trim()
    .toLocaleLowerCase("bn");

  const filtered = products.filter(p => {
    const categoryMatch =
      activeFilter === "সব" ||
      p.category === activeFilter;

    const text = [
      p.title,
      p.category,
      p.level,
      p.description
    ].join(" ").toLocaleLowerCase("bn");

    return categoryMatch && text.includes(query);
  });

  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div
        class="product-cover"
        style="--cover-a:${p.a};--cover-b:${p.b}"
      >
        <span class="product-tag">${p.tag}</span>
        <div class="cover-art">
          LAVLU<br>ACADEMY
          <small>${p.category.toUpperCase()}</small>
        </div>
      </div>

      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.title}</h3>
        <p>${p.level}</p>

        <div class="product-bottom">
          <span class="price">
            ${money(p.price)}
            <del>${money(p.oldPrice)}</del>
          </span>

          <button
            class="small-button"
            data-details="${p.id}"
            type="button"
          >বিস্তারিত</button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = filtered.length !== 0;
}

// নোটের বিস্তারিত পপ-আপ
function openProduct(id) {
  const p = products.find(
    item => item.id === Number(id)
  );

  if (!p) return;

  document.getElementById("dialogContent").innerHTML = `
    <span class="eyebrow">${p.category}</span>
    <h2>${p.title}</h2>

    <p class="dialog-description">${p.description}</p>
    <p class="dialog-description">${p.level}</p>
    <p class="dialog-description">
  📄 ফরম্যাট: ${p.format || "PDF"} |
  📑 পৃষ্ঠা: ${p.pages || "তথ্য যোগ হয়নি"}
</p>

    <p class="dialog-price">
      ${money(p.price)}
      <del style="font-size:14px;color:#93a19b">
        ${money(p.oldPrice)}
      </del>
    </p>

    <button
      class="primary-button"
      id="addToCart"
      type="button"
    >
      কার্টে যোগ করুন <span>+</span>
    </button>
    
  <div class="preview-section">
  <p><strong>PDF-এর নমুনা দেখে নিন</strong></p>
  <a
    class="preview-button"
    href="./Lavlu_Academy_Vector_Preview_3_Pages.pdf"
    target="_blank"
    rel="noopener noreferrer"
  >
    ৩ পৃষ্ঠার প্রিভিউ দেখুন
  </a>
  </div>

    <p class="demo-note">
      নমুনা পণ্য। বাস্তব পেমেন্ট বা PDF সরবরাহ চালু নেই।
    </p>
  `;

  document.getElementById("productDialog").showModal();

  document.getElementById("addToCart").addEventListener(
    "click",
    () => {
      cart.push(p.id);
      saveCart();
      renderCartCount();

      document.getElementById("productDialog").close();
    }
  );
}

// কার্টে মোট পণ্যের সংখ্যা
function renderCartCount() {
  document.getElementById("cartCount").textContent =
    new Intl.NumberFormat("bn-BD").format(cart.length);
}

// কার্টের পণ্য ও পরিমাণ দেখাবে
function renderCart() {
  const counts = cart.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const items = Object.entries(counts);
  const cartItems = document.getElementById("cartItems");

  if (items.length === 0) {
    cartItems.innerHTML = `
      <p class="cart-empty">আপনার কার্ট এখনো খালি।</p>
    `;
  } else {
    cartItems.innerHTML = items.map(([id, count]) => {
      const p = products.find(
        item => item.id === Number(id)
      );

      return `
        <div class="cart-row">
          <div class="cart-product">
            <span>
              ${p.title} ×
              ${new Intl.NumberFormat("bn-BD").format(count)}
            </span>

            <div class="cart-actions">
              <button
                type="button"
                data-cart-action="decrease"
                data-product-id="${p.id}"
                aria-label="একটি কমান"
              >−</button>

              <button
                type="button"
                data-cart-action="increase"
                data-product-id="${p.id}"
                aria-label="একটি বাড়ান"
              >+</button>

              <button
                type="button"
                data-cart-action="remove"
                data-product-id="${p.id}"
              >বাদ দিন</button>
            </div>
          </div>

          <strong>${money(p.price * count)}</strong>
        </div>
      `;
    }).join("");
  }

  const total = cart.reduce((sum, id) => {
    const p = products.find(item => item.id === id);
    return sum + (p ? p.price : 0);
  }, 0);

  document.getElementById("cartTotal").textContent =
    money(total);
}

// কার্ট খোলা
function openCart() {
  renderCart();
  document.getElementById("cartDialog").showModal();
}

// ক্যাটাগরি ফিল্টার
document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => {
      b.classList.remove("active");
    });

    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderProducts();
  });
});

// সার্চ
searchInput.addEventListener("input", renderProducts);

// পণ্যের বিস্তারিত বোতাম
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");

  if (button) {
    openProduct(button.dataset.details);
  }
});

// কার্টের +, − এবং বাদ দিন বোতাম
document.getElementById("cartItems").addEventListener(
  "click",
  event => {
    const button = event.target.closest("[data-cart-action]");

    if (!button) return;

    const id = Number(button.dataset.productId);
    const action = button.dataset.cartAction;

    if (action === "increase") {
      cart.push(id);
    }

    if (action === "decrease") {
      const index = cart.indexOf(id);

      if (index !== -1) {
        cart.splice(index, 1);
      }
    }

    if (action === "remove") {
      cart = cart.filter(itemId => itemId !== id);
    }

    saveCart();
    renderCartCount();
    renderCart();
  }
);

// পপ-আপ খোলা ও বন্ধ
document.getElementById("cartButton").addEventListener(
  "click",
  openCart
);

document.getElementById("dialogClose").addEventListener(
  "click",
  () => document.getElementById("productDialog").close()
);

document.getElementById("cartClose").addEventListener(
  "click",
  () => document.getElementById("cartDialog").close()
);

// ফুটারে বর্তমান বছর
document.getElementById("year").textContent =
  new Date().getFullYear();

// প্রথমবার পৃষ্ঠা খোলার সময়
renderProducts();
renderCartCount();
