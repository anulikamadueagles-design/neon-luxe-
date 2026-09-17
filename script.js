
const Naira = n => '₦' + Number(n).toLocaleString('en-NG',{maximumFractionDigits:0});
const state = {
  page:1, perPage:24, filtered:[], compare:JSON.parse(localStorage.getItem('nl_compare')||'[]'),
  cart:JSON.parse(localStorage.getItem('nl_cart')||'[]'), saved:JSON.parse(localStorage.getItem('nl_saved')||'[]'),
  recent:JSON.parse(localStorage.getItem('nl_recent')||'[]'), searches:JSON.parse(localStorage.getItem('nl_searches')||'[]'),
  listings:JSON.parse(localStorage.getItem('nl_listings')||'[]'), orders:JSON.parse(localStorage.getItem('nl_orders')||'[]'),
  chats:JSON.parse(localStorage.getItem('nl_chats')||'[]'), notifications:JSON.parse(localStorage.getItem('nl_notifications')||'[]')
};
const locations=['Abuja','Lagos','Port Harcourt','Kano','Ibadan'];
function save(k,v){localStorage.setItem(k,JSON.stringify(v))}
function toast(t){const x=document.getElementById('toast');x.textContent=t;x.classList.add('show');setTimeout(()=>x.classList.remove('show'),2400)}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function allProducts(){return PRODUCTS.concat(state.listings.map((x,i)=>({...x,id:'l'+i,listing:true})))}
function init(){
  const cats=[...new Set(allProducts().map(p=>p.category))];
  document.getElementById('categoryStrip').innerHTML=cats.map(c=>`<button onclick="filterCategory('${esc(c)}')">${esc(c)}</button>`).join('');
  document.getElementById('categoryFilter').innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
  updateCounts(); applyFilters(); renderNotifications();
}
function updateCounts(){
  document.getElementById('cartCount').textContent=state.cart.reduce((a,x)=>a+x.qty,0);
  document.getElementById('compareCount').textContent=state.compare.length;
  document.getElementById('notificationCount').textContent=state.notifications.length;
}
function productById(id){return allProducts().find(p=>String(p.id)===String(id))}
function applyFilters(){
  const q=(document.getElementById('searchInput').value||'').toLowerCase().trim(), cat=document.getElementById('categoryFilter').value;
  const max=Number(document.getElementById('priceFilter').value), condition=document.getElementById('conditionFilter').value, loc=document.getElementById('locationFilter').value;
  let a=allProducts().filter(p=>(!q||`${p.name} ${p.category} ${p.color||''} ${p.seller||''}`.toLowerCase().includes(q))&&(!cat||p.category===cat)&&Number(p.price)<=max&&(!condition||((p.condition||'New')===condition))&&(!loc||((p.location||'Abuja')===loc)));
  const sort=document.getElementById('sort').value;
  if(sort==='low')a.sort((x,y)=>x.price-y.price);if(sort==='high')a.sort((x,y)=>y.price-x.price);
  if(sort==='rating')a.sort((x,y)=>y.rating-x.rating);if(sort==='new')a.sort((x,y)=>y.id-x.id);
  state.filtered=a;state.page=1;renderProducts();
}
function renderProducts(){
  const start=(state.page-1)*state.perPage, rows=state.filtered.slice(start,start+state.perPage);
  document.getElementById('resultInfo').textContent=`${state.filtered.length} results`;
  document.getElementById('productGrid').innerHTML=rows.length?rows.map(card).join(''):'<div class="empty">No products match your filters.</div>';
  const pages=Math.max(1,Math.ceil(state.filtered.length/state.perPage));
  document.getElementById('pagination').innerHTML=Array.from({length:Math.min(pages,10)},(_,i)=>`<button class="${i+1===state.page?'active':''}" onclick="goPage(${i+1})">${i+1}</button>`).join('');
}
function card(p){
  const saved=state.saved.includes(String(p.id)), compared=state.compare.includes(String(p.id));
  return `<article class="product-card" onclick="openProduct('${p.id}')">
    <div class="product-img ${String(p.color||'').toLowerCase()}"><span class="badge">${esc(p.badge||'MARKET')}</span><button class="heart" onclick="event.stopPropagation();toggleSaved('${p.id}')">${saved?'♥':'♡'}</button><div class="product-symbol">${icon(p.category)}</div></div>
    <div class="product-info"><div class="badge-row"><small>${esc(p.category)} ${p.listing?'• LISTED':''}</small><span class="verify">${p.listing?'✓ Seller listing':''}</span></div>
    <h3>${esc(p.name)}</h3><div class="rating">★ ${p.rating} <span>(${p.reviews||0})</span></div><strong>${Naira(p.price)}</strong> ${p.oldPrice?`<del>${Naira(p.oldPrice)}</del>`:''}
    <div class="card-actions"><button onclick="event.stopPropagation();addCart('${p.id}')">Add to cart</button><button onclick="event.stopPropagation();toggleCompare('${p.id}')">${compared?'✓ Compared':'⇄ Compare'}</button></div></div>
  </article>`;
}
function icon(c){return ({Tech:'⚡',Fashion:'✦',Shoes:'◈',Bags:'▣',Home:'⌂',Beauty:'✿',Electronics:'◉',Sports:'◌',Jewelry:'◇',Kids:'★',Kitchen:'♨',Travel:'✈'}[c]||'◆')}
function goPage(n){state.page=n;renderProducts();document.getElementById('shop').scrollIntoView({behavior:'smooth'})}
function filterCategory(c){document.getElementById('categoryFilter').value=c;applyFilters();scrollToShop()}
function scrollToShop(){document.getElementById('shop').scrollIntoView({behavior:'smooth'})}
function clearSearch(){document.getElementById('searchInput').value='';applyFilters()}
function resetFilters(){document.getElementById('searchInput').value='';document.getElementById('categoryFilter').value='';document.getElementById('conditionFilter').value='';document.getElementById('locationFilter').value='';document.getElementById('priceFilter').value=1900;document.getElementById('priceVal').textContent='₦1,900';applyFilters()}
function toggleFilters(){document.getElementById('filters').classList.toggle('open')}
function toggleMenu(){document.getElementById('mobileMenu').classList.toggle('open')}
function showHome(){window.scrollTo({top:0,behavior:'smooth'})}
function openModal(html,wide=false){document.getElementById('modalContent').innerHTML=html;document.querySelector('.modal-panel').classList.toggle('wide',wide);document.getElementById('modal').classList.remove('hidden')}
function closeModal(){document.getElementById('modal').classList.add('hidden')}
function openProduct(id){
  const p=productById(id); if(!p)return; state.recent=[String(id),...state.recent.filter(x=>String(x)!==String(id))].slice(0,20);save('nl_recent',state.recent);
  openModal(`<p class="eyebrow">${esc(p.category)}</p><h2>${esc(p.name)}</h2><div class="grid-2"><div class="product-img large ${String(p.color||'').toLowerCase()}"><div class="product-symbol">${icon(p.category)}</div></div><div><h1>${Naira(p.price)}</h1><p>★ ${p.rating} • ${p.reviews||0} reviews</p><p>Condition: <b>${esc(p.condition||'New')}</b><br>Location: <b>${esc(p.location||'Abuja')}</b></p><p>✓ Buyer protection<br>✓ Secure checkout<br>✓ Delivery/pickup options</p><button class="primary" onclick="addCart('${p.id}');closeModal()">Add to cart</button> <button class="ghost" onclick="openOffer('${p.id}')">Make offer</button><button class="ghost" onclick="openChat('${p.id}')">💬 Chat seller</button><button class="ghost" onclick="toggleSaved('${p.id}')">♥ Save</button></div></div><hr><h3>Product details</h3><p>${esc(p.description||'Quality marketplace product with seller information, availability and delivery options.')}</p><div class="tabs"><button onclick="openReviews('${p.id}')">Reviews</button><button onclick="openSellerProfile('${p.seller||'NEON LUXE Seller'}')">Seller profile</button><button onclick="showInfo('buyer')">Buyer protection</button><button onclick="showInfo('delivery')">Delivery</button></div>`,true)
}
function addCart(id){const p=productById(id);if(!p)return;let x=state.cart.find(a=>String(a.id)===String(id));x?x.qty++:state.cart.push({id,qty:1});save('nl_cart',state.cart);updateCounts();toast('Added to cart')}
function openCart(){
 let items=state.cart.map(x=>({...productById(x.id),qty:x.qty})).filter(Boolean), total=items.reduce((s,x)=>s+x.price*x.qty,0);
 openModal(`<h2>Your cart</h2>${items.length?items.map(x=>`<div class="list-row"><span>${esc(x.name)} × ${x.qty}</span><b>${Naira(x.price*x.qty)}</b><button onclick="removeCart('${x.id}')">×</button></div>`).join('')+`<h2>Total: ${Naira(total)}</h2><div class="form-card"><input id="coupon" placeholder="Coupon code (try NEON10)"><button class="ghost" onclick="applyCoupon()">Apply</button></div><button class="primary" onclick="openCheckout()">Checkout →</button>`:'<div class="empty">Your cart is empty.</div>'}`)
}
function removeCart(id){state.cart=state.cart.filter(x=>String(x.id)!==String(id));save('nl_cart',state.cart);updateCounts();openCart()}
function applyCoupon(){const v=(document.getElementById('coupon').value||'').toUpperCase();toast(v==='NEON10'?'10% demo voucher applied':'Coupon not recognised')}
function openCheckout(){
 if(!state.cart.length){toast('Your cart is empty');return}
 openModal(`<h2>Secure checkout</h2><div class="grid-2"><div class="form-card"><h3>Delivery</h3><input placeholder="Full name"><input placeholder="Phone number"><select><option>Abuja</option><option>Lagos</option><option>Port Harcourt</option><option>Kano</option></select><textarea placeholder="Full delivery address"></textarea></div><div class="form-card"><h3>Payment</h3><button class="ghost">💳 Card</button><button class="ghost">🏦 Bank transfer</button><button class="ghost">📱 USSD / Wallet</button><button class="ghost">💵 Cash on delivery</button><p class="muted">Payment provider connection is a backend step.</p></div></div><button class="primary" onclick="placeOrder()">Place order</button>`,true)
}
function placeOrder(){const id='NL-'+Date.now().toString().slice(-8);state.orders.unshift({id,status:'Processing',date:new Date().toLocaleString(),items:state.cart});state.cart=[];save('nl_cart',state.cart);save('nl_orders',state.orders);state.notifications.unshift('Order '+id+' created');save('nl_notifications',state.notifications);updateCounts();openOrders()}
function openAccount(){openModal(`<h2>My account</h2><div class="grid-3"><button class="stat-card" onclick="openOrders()"><strong>📦</strong>Orders</button><button class="stat-card" onclick="openSaved()"><strong>♥</strong>Favourites</button><button class="stat-card" onclick="openChats()"><strong>💬</strong>Messages</button></div><div class="form-card"><h3>Profile</h3><input placeholder="Full name"><input placeholder="Email"><input placeholder="Phone"><button class="primary" onclick="toast('Profile saved in this demo');closeModal()">Save profile</button></div><button class="ghost" onclick="openSellerDashboard()">Seller dashboard</button><button class="ghost" onclick="openAdmin()">Admin demo</button>`,true)}
function openOrders(){openModal(`<h2>Orders</h2>${state.orders.length?state.orders.map(o=>`<div class="list-row"><span><b>${o.id}</b><br><small>${o.date}</small></span><span>${o.status}</span><button class="ghost" onclick="trackOrder('${o.id}')">Track</button></div>`).join(''):'<div class="empty">No orders yet.</div>'}`)}
function trackOrder(id){openModal(`<h2>Track ${id}</h2><div class="tabs"><button class="active">✓ Order placed</button><button>✓ Processing</button><button>○ Shipped</button><button>○ Delivered</button></div><p>Tracking updates will come from the delivery backend when connected.</p>`)}
function toggleSaved(id){const s=String(id);state.saved.includes(s)?state.saved=state.saved.filter(x=>x!==s):state.saved.unshift(s);save('nl_saved',state.saved);updateCounts();renderProducts()}
function openSaved(){const ps=state.saved.map(productById).filter(Boolean);openModal(`<h2>♥ Favourites</h2>${ps.length?`<div class="product-grid">${ps.map(card).join('')}</div>`:'<div class="empty">No favourites saved yet.</div>'}`,true)}
function saveCurrentSearch(){const q=document.getElementById('searchInput').value||'All products';state.searches.unshift({q,category:document.getElementById('categoryFilter').value,price:document.getElementById('priceFilter').value});state.searches=state.searches.slice(0,20);save('nl_searches',state.searches);toast('Search saved')}
function openCompare(){const ps=state.compare.map(productById).filter(Boolean);openModal(`<h2>⇄ Compare products</h2>${ps.length?`<div class="grid-${Math.min(ps.length,3)}">${ps.map(p=>`<div class="form-card"><h3>${esc(p.name)}</h3><p>${esc(p.category)}</p><h2>${Naira(p.price)}</h2><p>★ ${p.rating}<br>Condition: ${esc(p.condition||'New')}<br>Location: ${esc(p.location||'Abuja')}</p><button class="ghost" onclick="toggleCompare('${p.id}');openCompare()">Remove</button></div>`).join('')}</div>`:'<div class="empty">Add products with Compare to compare them.</div>'}`,true)}
function toggleCompare(id){const s=String(id);if(state.compare.includes(s))state.compare=state.compare.filter(x=>x!==s);else if(state.compare.length<4)state.compare.push(s);else return toast('Compare limit is 4');save('nl_compare',state.compare);updateCounts();renderProducts()}
function openRecentlyViewed(){const ps=state.recent.map(productById).filter(Boolean);openModal(`<h2>Recently viewed</h2>${ps.length?`<div class="product-grid">${ps.map(card).join('')}</div>`:'<div class="empty">Nothing viewed yet.</div>'}`,true)}
function openChats(){openModal(`<h2>💬 Messages</h2>${state.chats.length?state.chats.map(c=>`<div class="list-row"><span>Seller: ${esc(c.seller)}<br><small>${esc(c.last||'New conversation')}</small></span><button class="ghost" onclick="openChat('${c.product}')">Open</button></div>`).join(''):'<div class="empty">No chats yet. Open a product and tap Chat seller.</div>'}`)}
function openChat(id){
 const p=productById(id), seller=p?.seller||'NEON LUXE Seller'; let c=state.chats.find(x=>x.product===String(id));if(!c){c={product:String(id),seller,last:'',messages:[]};state.chats.push(c)}
 openModal(`<h2>💬 ${esc(seller)}</h2><div class="chat-box">${c.messages.map(m=>`<div class="msg ${m.me?'me':''}">${esc(m.text)}</div>`).join('')}</div><form onsubmit="sendChat(event,'${id}')"><input id="chatText" required placeholder="Ask about price, size, condition or delivery"><button class="primary">Send</button></form>`,true)
}
function sendChat(e,id){e.preventDefault();const c=state.chats.find(x=>x.product===String(id));const t=document.getElementById('chatText').value;c.messages.push({text:t,me:true});c.last=t;save('nl_chats',state.chats);state.notifications.unshift('New message');save('nl_notifications',state.notifications);openChat(id)}
function openOffer(id){const p=productById(id);openModal(`<h2>Make an offer</h2><p>${esc(p.name)} • Listed at ${Naira(p.price)}</p><div class="form-card"><input id="offer" type="number" placeholder="Your offer in ₦"><textarea placeholder="Message to seller"></textarea><button class="primary" onclick="sendOffer('${id}')">Send offer</button></div>`)}
function sendOffer(id){toast('Offer sent to seller (demo)');openChat(id)}
function openReviews(id){const p=productById(id);openModal(`<h2>Reviews • ${esc(p.name)}</h2><p>★ ${p.rating} average from ${p.reviews||0} reviews</p><div class="form-card">★ ★ ★ ★ ★<p>“Great value and exactly as described.”</p></div><div class="form-card">★ ★ ★ ★ ☆<p>“Seller communication was helpful.”</p></div><button class="primary" onclick="toast('Review form opened');">Write a review</button>`)}
function openSellerProfile(name){openModal(`<h2>✓ ${esc(name)}</h2><p>Verified marketplace seller profile</p><div class="grid-3"><div class="stat-card"><strong>4.8</strong>Seller rating</div><div class="stat-card"><strong>96%</strong>Response rate</div><div class="stat-card"><strong>120+</strong>Listings</div></div><button class="ghost" onclick="toast('Seller followed')">＋ Follow seller</button>`)}
function openSeller(){
 openModal(`<h2>＋ Create a listing</h2><div class="form-card"><label>Title</label><input id="liTitle" placeholder="What are you selling?"><label>Category</label><select id="liCat"><option>Tech</option><option>Fashion</option><option>Shoes</option><option>Bags</option><option>Home</option><option>Beauty</option><option>Electronics</option><option>Sports</option><option>Jewelry</option><option>Kids</option><option>Kitchen</option><option>Travel</option></select><label>Price (₦)</label><input id="liPrice" type="number" placeholder="50000"><label>Condition</label><select id="liCondition"><option>New</option><option>Used</option><option>Refurbished</option></select><label>Location</label><select id="liLocation">${locations.map(x=>`<option>${x}</option>`).join('')}</select><label>Description</label><textarea id="liDesc" placeholder="Describe your item..."></textarea><button class="primary" onclick="publishListing()">Publish listing</button></div><p class="muted">Real photo uploads, moderation, KYC and payment settlement connect to the backend.</p>`,true)
}
function publishListing(){
 const name=document.getElementById('liTitle').value.trim(),price=Number(document.getElementById('liPrice').value);if(!name||!price)return toast('Enter a title and price');
 state.listings.unshift({name,price,oldPrice:price*1.15,rating:5,reviews:0,color:'Green',badge:'NEW',category:document.getElementById('liCat').value,condition:document.getElementById('liCondition').value,location:document.getElementById('liLocation').value,description:document.getElementById('liDesc').value,seller:'My Store'});
 save('nl_listings',state.listings);state.notifications.unshift('Listing published');save('nl_notifications',state.notifications);closeModal();applyFilters();toast('Listing published')}
function openSellerDashboard(){
 let rows=state.listings.map((p,i)=>'<div class="list-row"><span>'+esc(p.name)+'<br><small>'+Naira(p.price)+' • '+esc(p.location)+'</small></span><button class="ghost" onclick="deleteListing('+i+')">Delete</button></div>').join('');
 if(!rows) rows='<div class="empty">You have no listings. Create your first listing.</div>';
 openModal('<h2>Seller Center</h2><div class="grid-3"><div class="stat-card"><strong>'+state.listings.length+'</strong>Listings</div><div class="stat-card"><strong>₦0</strong>Revenue</div><div class="stat-card"><strong>0</strong>Orders</div></div><div class="tabs"><button class="active">Products</button><button onclick="toast(\'Seller orders ready for backend\')">Orders</button><button onclick="openChats()">Messages</button><button onclick="toast(\'Analytics ready for backend\')">Analytics</button><button onclick="toast(\'Payouts require payment backend\')">Payouts</button></div>'+rows+'<button class="primary" onclick="openSeller()">＋ New listing</button>',true);
}
function deleteListing(i){state.listings.splice(i,1);save('nl_listings',state.listings);openSellerDashboard();applyFilters()}
function openAdmin(){openModal(`<h2>Admin Control Center</h2><div class="grid-3"><div class="stat-card"><strong>${allProducts().length}</strong>Products</div><div class="stat-card"><strong>${state.listings.length}</strong>Seller listings</div><div class="stat-card"><strong>${state.orders.length}</strong>Orders</div></div><div class="form-card"><h3>Moderation</h3><p>✓ Product approval<br>✓ Seller verification<br>✓ Reports & disputes<br>✓ Reviews moderation<br>✓ Promotions & coupons<br>✓ Platform analytics</p><button class="ghost" onclick="toast('Admin tools are ready for backend connection')">Open moderation</button></div>`,true)}
function openNotifications(){state.notifications=[];save('nl_notifications',state.notifications);updateCounts();openModal(`<h2>🔔 Notifications</h2><div class="empty">No unread notifications.</div>`)}
function renderNotifications(){}
function showDeals(){document.getElementById('sort').value='low';applyFilters();scrollToShop();toast('Showing marketplace deals')}
function sortNew(){document.getElementById('sort').value='new';applyFilters();scrollToShop()}
function subscribe(e){e.preventDefault();toast('Subscribed successfully')}
function showInfo(type){
 const data={buyer:['Buyer protection','Use secure checkout, seller ratings, reviews, reporting and order records. Real escrow/protection requires a payment backend.'],verified:['Verified sellers','Seller verification and KYC badges can be displayed after a real identity provider is connected.'],delivery:['Delivery options','Support seller delivery, pickup points, express delivery and tracking through a logistics API.'],seller:['Seller help','Create listings, manage inventory, answer chats, process orders and review analytics.'],support:['Support','Add live support, tickets, dispute handling, refunds and moderation.']}[type]||['NEON LUXE','Marketplace information'];
 openModal(`<h2>${data[0]}</h2><p>${data[1]}</p><button class="primary" onclick="closeModal()">Continue</button>`)
}
init();

document.addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
