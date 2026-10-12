const products = [
  {id:1,title:"ভেক্টর — সম্পূর্ণ অধ্যায় নোট",category:"HSC Physics",level:"HSC পদার্থবিজ্ঞান ১ম পত্র",price:120,oldPrice:180,tag:"জনপ্রিয়",description:"সংজ্ঞা, সূত্র, উদাহরণ, বোর্ড প্রশ্ন ও অধ্যায়ভিত্তিক অনুশীলনী।",a:"#0c9a70",b:"#075744"},
  {id:2,title:"গতি ও গতির সমীকরণ",category:"SSC Physics",level:"নবম–দশম শ্রেণি",price:80,oldPrice:120,tag:"নতুন",description:"গুরুত্বপূর্ণ সূত্র, সমাধানসহ গাণিতিক সমস্যা ও অনুশীলন।",a:"#477ed8",b:"#243e83"},
  {id:3,title:"HSC Physics MCQ প্রশ্নব্যাংক",category:"প্রশ্নব্যাংক",level:"HSC পরীক্ষা প্রস্তুতি",price:150,oldPrice:200,tag:"প্র্যাকটিস",description:"অধ্যায়ভিত্তিক বহুনির্বাচনি প্রশ্নের অনুশীলনের জন্য নমুনা প্যাক।",a:"#e49a42",b:"#a74b25"},
  {id:4,title:"নিউটনীয় বলবিদ্যা — শর্ট নোট",category:"HSC Physics",level:"HSC পদার্থবিজ্ঞান ১ম পত্র",price:100,oldPrice:150,tag:"নোট",description:"ধারণা, প্রয়োজনীয় সূত্র এবং নির্বাচিত গাণিতিক সমস্যার সারাংশ।",a:"#7b68c7",b:"#433177"}
];
const money = n => "৳" + new Intl.NumberFormat("bn-BD").format(n);
const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const cart = [];
let activeFilter = "সব";

function renderProducts(){
  const query = searchInput.value.trim().toLocaleLowerCase("bn");
  const filtered = products.filter(p => (activeFilter === "সব" || p.category === activeFilter) &&
    (p.title+" "+p.category+" "+p.level+" "+p.description).toLocaleLowerCase("bn").includes(query));
  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <div class="product-cover" style="--cover-a:${p.a};--cover-b:${p.b}">
        <span class="product-tag">${p.tag}</span>
        <div class="cover-art">LAVLU<br>ACADEMY<small>${p.category.toUpperCase()}</small></div>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3>${p.title}</h3>
        <p>${p.level}</p>
        <div class="product-bottom"><span class="price">${money(p.price)} <del>${money(p.oldPrice)}</del></span>
        <button class="small-button" data-details="${p.id}">বিস্তারিত</button></div>
      </div>
    </article>`).join("");
  emptyState.hidden = filtered.length !== 0;
}
function openProduct(id){
  const p = products.find(item => item.id === Number(id));
  if(!p) return;
  document.getElementById("dialogContent").innerHTML = `
    <span class="eyebrow">${p.category}</span><h2>${p.title}</h2>
    <p class="dialog-description">${p.description}</p><p class="dialog-description">${p.level}</p>
    <p class="dialog-price">${money(p.price)} <del style="font-size:14px;color:#93a19b">${money(p.oldPrice)}</del></p>
    <button class="primary-button" id="addToCart" type="button">কার্টে যোগ করুন <span>+</span></button>
    <p class="demo-note">নমুনা পণ্য। এই পর্যায়ে পেমেন্ট বা PDF সরবরাহ চালু নেই।</p>`;
  document.getElementById("productDialog").showModal();
  document.getElementById("addToCart").addEventListener("click",()=>{cart.push(p.id);renderCartCount();document.getElementById("productDialog").close();});
}
function renderCartCount(){document.getElementById("cartCount").textContent = new Intl.NumberFormat("bn-BD").format(cart.length);}
function openCart(){
  const counts = cart.reduce((acc,id)=>{acc[id]=(acc[id]||0)+1;return acc;},{});
  const items = Object.entries(counts);
  document.getElementById("cartItems").innerHTML = items.length ? items.map(([id,count])=>{
    const p=products.find(x=>x.id===Number(id));return `<div class="cart-row"><span>${p.title} × ${count}</span><strong>${money(p.price*count)}</strong></div>`;
  }).join("") : '<p class="cart-empty">আপনার কার্ট এখনো খালি।</p>';
  document.getElementById("cartTotal").textContent = money(cart.reduce((sum,id)=>sum+products.find(p=>p.id===id).price,0));
  document.getElementById("cartDialog").showModal();
}
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
  button.classList.add("active");activeFilter=button.dataset.filter;renderProducts();
}));
searchInput.addEventListener("input",renderProducts);
grid.addEventListener("click",event=>{const button=event.target.closest("[data-details]");if(button)openProduct(button.dataset.details);});
document.getElementById("cartButton").addEventListener("click",openCart);
document.getElementById("dialogClose").addEventListener("click",()=>document.getElementById("productDialog").close());
document.getElementById("cartClose").addEventListener("click",()=>document.getElementById("cartDialog").close());
document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
