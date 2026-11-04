(() => {
  "use strict";
  const cfg = window.EXFACTO_CONFIG || {};
  const products = cfg.products || [];
  const CART_KEY = "exfactoFragrancesCart";
  const money = value => value == null ? "PRICE TO BE CONFIRMED" : new Intl.NumberFormat(cfg.locale || "en-ZA",{style:"currency",currency:cfg.currency || "ZAR",maximumFractionDigits:2}).format(value);
  const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch { return []; } };
  const saveCart = cart => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCount(); };
  const updateCount = () => { const count = getCart().reduce((n,item)=>n+item.qty,0); document.querySelectorAll(".bag-count").forEach(el=>el.textContent=count); };
  const productById = id => products.find(p=>p.id===id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const card = p => `<article class="product-card"><div class="product-image"><img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy"><span class="product-tag">${esc(p.tag || "EXFACTO")}</span></div><div class="product-info"><h3>${esc(p.name)}</h3><p>${esc(p.size || "Size to be confirmed")} · ${esc(p.category || "Category TBC")}</p><div class="product-price">${money(p.price)}</div><div class="product-actions"><button class="mini-button" data-view="${esc(p.id)}">VIEW DETAILS</button><button class="mini-button" data-add="${esc(p.id)}" ${p.price==null?"disabled title='Price must be confirmed before ordering'":""}>${p.price==null?"PRICE TBC":"ADD TO BAG +"}</button></div></div></article>`;
  const featured = document.getElementById("featured-products");
  if (featured) featured.innerHTML = products.slice(0,4).map(card).join("");
  const shop = document.getElementById("shop-products");
  const search = document.getElementById("product-search"), filter = document.getElementById("category-filter");
  const renderShop = () => {
    if (!shop) return;
    const q=(search?.value||"").toLowerCase(), c=filter?.value||"all";
    const list=products.filter(p=>(c==="all"||p.category===c)&&(`${p.name} ${p.description} ${p.category}`).toLowerCase().includes(q));
    shop.innerHTML=list.length?list.map(card).join(""):'<p class="muted">No fragrances match your search.</p>';
    const count=document.getElementById("product-count"); if(count) count.textContent=`${list.length} catalogue placeholders`;
  };
  if(shop){renderShop();search?.addEventListener("input",renderShop);filter?.addEventListener("change",renderShop);}
  let modal;
  const closeModal=()=>{modal?.classList.remove("open");};
  const openModal=id=>{
    const p=productById(id); if(!p)return;
    if(!modal){modal=document.createElement("div");modal.className="product-modal";modal.innerHTML='<div class="modal-card"><button class="modal-close" aria-label="Close">×</button><img alt=""><div class="modal-copy"></div></div>';document.body.appendChild(modal);modal.addEventListener("click",e=>{if(e.target===modal||e.target.closest(".modal-close"))closeModal();});}
    modal.querySelector("img").src=p.image;modal.querySelector("img").alt=p.name;
    modal.querySelector(".modal-copy").innerHTML=`<p class="eyebrow">EXFACTO FRAGRANCES</p><h2>${esc(p.name)}</h2><p class="muted">${esc(p.size)} · ${esc(p.category)}</p><p>${esc(p.description)}</p><p class="product-price">${money(p.price)}</p><p class="muted">${esc(p.notes)}</p><button class="button button-dark" data-add="${esc(p.id)}" ${p.price==null?"disabled":""}>${p.price==null?"PRICE TO BE CONFIRMED":"ADD TO BAG +"}</button>`;
    modal.classList.add("open");
  };
  const toast=message=>{const t=document.createElement("div");t.className="toast";t.textContent=message;document.body.appendChild(t);setTimeout(()=>t.remove(),2600);};
  document.addEventListener("click",e=>{
    const view=e.target.closest("[data-view]");if(view){openModal(view.dataset.view);return;}
    const add=e.target.closest("[data-add]");if(add){const p=productById(add.dataset.add);if(!p)return;if(p.price==null){toast("This product's price must be confirmed before it can be ordered.");return;}const cart=getCart(),found=cart.find(x=>x.id===p.id);if(found)found.qty++;else cart.push({id:p.id,qty:1});saveCart(cart);toast("Added to your bag.");}
    const remove=e.target.closest("[data-remove]");if(remove){saveCart(getCart().filter(x=>x.id!==remove.dataset.remove));renderCart();}
    const qty=e.target.closest("[data-qty]");if(qty){const cart=getCart(),item=cart.find(x=>x.id===qty.dataset.id);if(item){item.qty+=Number(qty.dataset.qty);if(item.qty<1)saveCart(cart.filter(x=>x.id!==item.id));else saveCart(cart);}renderCart();}
  });
  const cartRoot=document.getElementById("cart-content");
  const renderCart=()=>{
    if(!cartRoot)return;const cart=getCart().filter(x=>productById(x.id));
    if(!cart.length){cartRoot.innerHTML='<div class="empty-state"><h2>Your bag is waiting.</h2><p class="muted">Explore the collection and find your next signature scent.</p><a class="button button-dark" href="shop.html">EXPLORE FRAGRANCES ↗</a></div>';return;}
    let total=0,hasUnknown=false;
    const rows=cart.map(item=>{const p=productById(item.id);if(p.price==null)hasUnknown=true;else total+=p.price*item.qty;return `<div class="cart-row"><img src="${esc(p.image)}" alt=""><div><h3>${esc(p.name)}</h3><p>${esc(p.size)} · ${money(p.price)}</p><div class="cart-qty"><button data-qty="-1" data-id="${esc(p.id)}">−</button><span>${item.qty}</span><button data-qty="1" data-id="${esc(p.id)}">+</button></div></div><strong>${p.price==null?"PRICE TBC":money(p.price*item.qty)}</strong><button class="remove-item" data-remove="${esc(p.id)}" aria-label="Remove ${esc(p.name)}">×</button></div>`;}).join("");
    cartRoot.innerHTML=`${rows}<div class="cart-total"><span>Subtotal</span><strong>${hasUnknown?"Awaiting confirmed prices":money(total)}</strong></div>${hasUnknown?'<p class="placeholder-notice">One or more product prices are unconfirmed. Checkout is unavailable until the catalogue is updated.</p>':'<a class="button button-dark" href="checkout.html">CONTINUE TO CHECKOUT ↗</a>'}`;
  };
  renderCart();
  const summary=document.getElementById("checkout-summary");
  if(summary){const cart=getCart(),items=cart.map(i=>({p:productById(i.id),qty:i.qty})).filter(x=>x.p);const unknown=items.some(x=>x.p.price==null);let total=items.reduce((s,x)=>s+(x.p.price||0)*x.qty,0);summary.innerHTML=items.length?items.map(x=>`<div class="summary-line"><span>${esc(x.p.name)} × ${x.qty}</span><span>${x.p.price==null?"PRICE TBC":money(x.p.price*x.qty)}</span></div>`).join("")+`<div class="summary-line total"><span>Subtotal</span><span>${unknown?"Awaiting prices":money(total)}</span></div>`:'<p class="muted">Your bag is empty.</p>';if(!items.length||unknown)document.querySelector("#checkout-form button").disabled=true;}
  const checkout=document.getElementById("checkout-form");
  checkout?.addEventListener("submit",e=>{
    e.preventDefault();const cart=getCart(),items=cart.map(i=>({p:productById(i.id),qty:i.qty})).filter(x=>x.p);
    if(!items.length||items.some(x=>x.p.price==null)){document.getElementById("checkout-feedback").textContent="Please add products with confirmed prices. No order has been placed.";return;}
    const data=new FormData(checkout),lines=items.map(x=>`${x.p.name} x ${x.qty} — ${money(x.p.price*x.qty)}`).join("\n");
    const body=`Order enquiry — Exfacto Fragrances\n\nName: ${data.get("name")}\nEmail: ${data.get("email")}\nPhone: ${data.get("phone")}\nDelivery address: ${data.get("address")}\nNotes: ${data.get("notes")||"None"}\n\nItems:\n${lines}\n\nSubtotal: ${money(items.reduce((s,x)=>s+x.p.price*x.qty,0))}\n\nPlease confirm availability, delivery fee and payment instructions.`;
    if(cfg.whatsappNumber){window.open(`https://wa.me/${cfg.whatsappNumber}?text=${encodeURIComponent(body)}`,"_blank","noopener");document.getElementById("checkout-feedback").textContent="Your order enquiry has been prepared in WhatsApp. It is not confirmed until the business responds.";}
    else{document.getElementById("checkout-feedback").textContent="WhatsApp ordering is not connected yet. Add the confirmed business WhatsApp number in js/config.js. No order has been sent or placed.";toast("Business WhatsApp number still needs to be configured.");}
  });
  const contact=document.getElementById("contact-form");
  contact?.addEventListener("submit",e=>{e.preventDefault();const d=new FormData(contact);if(cfg.contactEmail){const subject=encodeURIComponent("Enquiry from Exfacto website");const body=encodeURIComponent(`Name: ${d.get("name")}\nEmail: ${d.get("email")}\n\n${d.get("message")}`);window.location.href=`mailto:${cfg.contactEmail}?subject=${subject}&body=${body}`;document.getElementById("contact-feedback").textContent="Your email application has been opened. The enquiry is not sent until you press Send.";}else{document.getElementById("contact-feedback").textContent="Business email is not configured. Add the confirmed email address in js/config.js before launch.";toast("Contact email still needs to be configured.");}});
  const menu=document.querySelector(".menu-toggle"),nav=document.querySelector(".main-nav");
  menu?.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
  document.querySelectorAll("#year").forEach(el=>el.textContent=new Date().getFullYear());
  updateCount();
})();