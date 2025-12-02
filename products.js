// Products loader - fetches and renders products from database
(async function() {
    // Render products in a container
    function renderProducts(products, container, template = 'default') {
        if (!container) return;
        
        container.innerHTML = ''; // Clear existing content
        
        if (!products || products.length === 0) {
            container.innerHTML = '<p style="color: #ccc; text-align: center;">No products available.</p>';
            return;
        }
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Handle both image/picture and original_price/old_price naming
            const imageUrl = product.picture || product.image || 'images/placeholder.jpg';
            const oldPrice = product.old_price || product.original_price;
            
            if (template === 'index') {
                // Template for index.html (Offers and Featured sections)
                const price = product.price || '0';
                const oldPriceHtml = oldPrice ? 
                    `<h3>for <span class="ltr">${price}$</span> Instead of <span class="ltr">${oldPrice}$</span></h3>` : 
                    `<h3><span class="ltr">${price}$</span></h3>`;
                
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${product.name || 'Product'}">
                    <h3>${product.name || 'Product'}</h3>
                    <p>${product.description || ''}</p>
                    ${oldPriceHtml}
                    <a href="shop.html" class="btn">Buy Now</a>
                `;
            } else if (template === 'shop') {
                const price = product.price || '0';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${product.name || 'Product'}">
                    <h3>${product.name || 'Product'}</h3>
                    <p>${product.description || ''}</p>
                    <h3><span class="ltr">${price}$</span></h3>
                `;
            } else {
                // Default template for category pages (arenapoints, arenacd, arenaaccounts)
                const price = product.price || '0';
                card.innerHTML = `
                    <img src="${imageUrl}" alt="${product.name || 'Product'}">
                    <h3>${product.name || 'Product'}</h3>
                    <p>${product.description || ''}</p>
                    <h3><span class="ltr">${price}$</span></h3>
                `;
                
                // Add modal data attribute if needed
                if (product.id) {
                    card.setAttribute('data-modal', `modal-${product.id}`);
                }
            }
            
            container.appendChild(card);
            if (template !== 'index') {
                const addBtn = document.createElement('button');
                addBtn.className = 'btn add-cart';
                addBtn.textContent = 'Add to Cart';
                addBtn.setAttribute('data-id', product.id || `${product.name}-${imageUrl}`);
                addBtn.setAttribute('data-name', product.name || 'Product');
                addBtn.setAttribute('data-price', product.price || '0');
                addBtn.setAttribute('data-image', imageUrl);
                card.appendChild(addBtn);
                addBtn.addEventListener('click', () => {
                    if (window.authState && typeof window.authState.isLoggedIn === 'function' && !window.authState.isLoggedIn()) {
                        showAuthPrompt();
                        return;
                    }
                    const item = {
                        id: addBtn.getAttribute('data-id'),
                        name: addBtn.getAttribute('data-name'),
                        price: parseFloat(addBtn.getAttribute('data-price')) || 0,
                        image: addBtn.getAttribute('data-image'),
                        qty: 1
                    };
                    addToCart(item);
                });
            }
        });
    }
    
    // Load products for index.html
    async function loadIndexProducts() {
        const offersContainer = document.querySelector('#offers-container, .cards-container');
        const featuredContainer = document.querySelectorAll('.cards-container')[1];
        
        if (offersContainer) {
            try {
                // Use category='offers' for the Offers section
                const response = await fetch('api/products.php?category=offers');
                const data = await response.json();
                if (data.success) {
                    renderProducts(data.products, offersContainer, 'index');
                }
            } catch (error) {
                console.error('Error loading offers:', error);
            }
        }
        
        if (featuredContainer) {
            try {
                // Use category='featured' for the Featured Products section
                const response = await fetch('api/products.php?category=featured');
                const data = await response.json();
                if (data.success) {
                    renderProducts(data.products, featuredContainer, 'index');
                }
            } catch (error) {
                console.error('Error loading featured products:', error);
            }
        }
    }
    
    // Load products for shop.html
    async function loadShopProducts() {
        // Arena Accounts section
        const accountsSection = document.querySelector('#alpha-accounts');
        if (accountsSection) {
            const accountsContainer = accountsSection.querySelector('.card-container');
            if (accountsContainer) {
                try {
                    const response = await fetch('api/products.php?category=arena_accounts');
                    const data = await response.json();
                    if (data.success) {
                        renderProducts((data.products || []).slice(0, 4), accountsContainer, 'shop');
                        const viewAll = document.createElement('a');
                        viewAll.href = 'arenaaccounts.html';
                        viewAll.className = 'btn';
                        viewAll.textContent = 'View All';
                        accountsSection.appendChild(viewAll);
                    }
                } catch (error) {
                    console.error('Error loading arena accounts:', error);
                }
            }
        }
        
        // Arena Points section (first alpha-games section)
        const pointsSections = document.querySelectorAll('#alpha-games');
        if (pointsSections.length > 0) {
            const pointsContainer = pointsSections[0].querySelector('.card-container');
            if (pointsContainer) {
                try {
                    const response = await fetch('api/products.php?category=arena_points');
                    const data = await response.json();
                    if (data.success) {
                        renderProducts((data.products || []).slice(0, 4), pointsContainer, 'shop');
                        const viewAll = document.createElement('a');
                        viewAll.href = 'arenapoints.html';
                        viewAll.className = 'btn';
                        viewAll.textContent = 'View All';
                        pointsSections[0].appendChild(viewAll);
                    }
                } catch (error) {
                    console.error('Error loading arena points:', error);
                }
            }
        }
        
        // Arena CDs section (explicit alpha-cds section)
        const cdsSection = document.querySelector('#alpha-cds');
        if (cdsSection) {
            const cdsContainer = cdsSection.querySelector('.card-container');
            if (cdsContainer) {
                try {
                    const response = await fetch('api/products.php?category=arena_cds');
                    const data = await response.json();
                    if (data.success) {
                        renderProducts((data.products || []).slice(0, 4), cdsContainer, 'shop');
                        const viewAll = document.createElement('a');
                        viewAll.href = 'arenacd.html';
                        viewAll.className = 'btn';
                        viewAll.textContent = 'View All';
                        cdsSection.appendChild(viewAll);
                    }
                } catch (error) {
                    console.error('Error loading arena cds:', error);
                }
            }
        }
    }
    
    // Load products for category pages (arenapoints, arenacd, arenaaccounts)
    async function loadCategoryProducts(category) {
        const container = document.querySelector('.card-container');
        if (!container) return;
        
        try {
            const response = await fetch(`api/products.php?category=${category}`);
            const data = await response.json();
            if (data.success) {
                renderProducts(data.products, container, 'default');
            }
        } catch (error) {
            console.error(`Error loading ${category} products:`, error);
        }
    }
    
    // Auto-detect page and load appropriate products
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || filename === '' || path.endsWith('/')) {
        loadIndexProducts();
    } else if (filename === 'shop.html') {
        loadShopProducts();
    } else if (filename === 'arenapoints.html') {
        loadCategoryProducts('arena_points');
    } else if (filename === 'arenacd.html') {
        loadCategoryProducts('arena_cds');
    } else if (filename === 'arenaaccounts.html') {
        loadCategoryProducts('arena_accounts');
    }

    function getCart() {
        try { return JSON.parse(localStorage.getItem('arena_cart') || '[]'); } catch { return []; }
    }
    function saveCart(cart) { localStorage.setItem('arena_cart', JSON.stringify(cart)); }
    function cartTotal(cart) { return cart.reduce((sum, it) => sum + (it.price * it.qty), 0); }
    function updateCartUI() {
        const cart = getCart();
        const countEl = document.getElementById('cart-count');
        const inlineCountEl = document.getElementById('inline-cart-count');
        const listEl = document.getElementById('cart-list');
        const emptyEl = document.getElementById('cart-empty');
        const totalEl = document.getElementById('cart-total');
        if (countEl) countEl.textContent = String(cart.reduce((s, it) => s + it.qty, 0));
        if (inlineCountEl) inlineCountEl.textContent = String(cart.reduce((s, it) => s + it.qty, 0));
        if (listEl && emptyEl) {
            listEl.innerHTML = '';
            if (cart.length === 0) {
                emptyEl.style.display = 'block';
            } else {
                emptyEl.style.display = 'none';
                cart.forEach(item => {
                    const li = document.createElement('li');
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';
                    li.style.justifyContent = 'space-between';
                    li.style.margin = '8px 0';
                    li.innerHTML = `
                        <div style="display:flex;align-items:center;gap:10px;">
                            <img src="${item.image}" alt="${item.name}" style="width:44px;height:44px;border-radius:8px;object-fit:cover;">
                            <div>
                                <div style="color:#fff;font-weight:600;">${item.name}</div>
                                <div style="color:#9aa0a6">$${item.price.toFixed(2)} × ${item.qty}</div>
                            </div>
                        </div>
                        <button data-id="${item.id}" class="remove-item" style="background:transparent;border:none;color:#ff3b30;cursor:pointer;">✕</button>
                    `;
                    listEl.appendChild(li);
                });
            }
        }
        if (totalEl) totalEl.textContent = `$${cartTotal(cart).toFixed(2)}`;
        if (listEl) {
            listEl.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    const cart = getCart().filter(it => it.id !== id);
                    saveCart(cart);
                    updateCartUI();
                });
            });
        }
    }
    function addToCart(item) {
        const cart = getCart();
        const existing = cart.find(it => it.id === item.id);
        if (existing) existing.qty += item.qty; else cart.push(item);
        saveCart(cart);
        updateCartUI();
        const panel = document.getElementById('cart-panel');
        if (panel) { panel.style.right = '0'; panel.setAttribute('aria-hidden','false'); }
        const fabBtn = document.getElementById('cart-btn');
        if (fabBtn) { fabBtn.style.display = 'none'; }
    }
    function ensureCartUI() {
        if (!document.getElementById('cart-btn')) {
            const btn = document.createElement('button');
            btn.id = 'cart-btn';
            btn.title = 'Cart';
            btn.setAttribute('aria-label','Open cart');
            btn.className = 'cart-fab';
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M3 5h3l2 10h9l2-7H8" stroke="#001" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span id="cart-count" class="cart-badge">0</span>`;
            document.body.appendChild(btn);
        }
        if (!document.getElementById('cart-panel')) {
            const aside = document.createElement('aside');
            aside.id = 'cart-panel';
            aside.setAttribute('aria-hidden','true');
            aside.style.cssText = 'position:fixed;right:-420px;top:0;height:100%;width:380px;background:linear-gradient(180deg,#0b0b12, #12121a);box-shadow:-20px 0 60px rgba(0,0,0,0.6);z-index:1400;padding:20px;transition:right 0.35s ease;';
            aside.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <h3 style="margin:0;color:#00d4ff;">Your Cart</h3>
                    <button id="close-cart" aria-label="Close cart" style="background:transparent;border:none;color:#fff;font-size:20px;cursor:pointer;">✕</button>
                </div>
                <div id="cart-items" style="overflow:auto;height:calc(100% - 160px);padding-right:8px;">
                    <p id="cart-empty" style="color:#ccc;">Your cart is empty.</p>
                    <ul id="cart-list" style="list-style:none;padding:0;margin:0;display:block;"></ul>
                </div>
                <div style="position:absolute;left:20px;right:20px;bottom:20px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.04);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;color:#ddd;">
                        <strong>Total</strong>
                        <span id="cart-total">$0.00</span>
                    </div>
                    <button id="checkout-btn" style="width:100%;padding:12px;border-radius:10px;border:none;background:#00d4ff;color:#001;font-weight:700;cursor:pointer;">Checkout</button>
                </div>`;
            document.body.appendChild(aside);
        }
        const btn = document.getElementById('cart-btn');
        const panel = document.getElementById('cart-panel');
        const closeBtn = document.getElementById('close-cart');
        if (btn && panel) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                panel.style.right = '0';
                panel.setAttribute('aria-hidden','false');
                btn.style.display = 'none';
            });
        }
        if (closeBtn && panel) {
            closeBtn.addEventListener('click', () => {
                panel.style.right = '-420px';
                panel.setAttribute('aria-hidden','true');
                const fab = document.getElementById('cart-btn');
                if (fab) fab.style.display = '';
            });
        }
        updateCartUI();
    }
    function ensureAuthPromptUI() {
        if (!document.getElementById('auth-prompt')) {
            const overlay = document.createElement('div');
            overlay.id = 'auth-prompt';
            overlay.setAttribute('role','dialog');
            overlay.setAttribute('aria-modal','true');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);display:none;align-items:center;justify-content:center;z-index:2000;';
            const panel = document.createElement('div');
            panel.style.cssText = 'background:linear-gradient(180deg,#0b0b12,#12121a);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:22px;max-width:420px;width:92%;color:#fff;box-shadow:0 20px 60px rgba(0,0,0,0.6);text-align:center;';
            panel.innerHTML = `
                <h3 style="margin:0 0 8px;color:#00d4ff;">Sign in required</h3>
                <p style="margin:0 0 16px;color:#d0d0d0;">Please sign in or create an account to add items to your cart.</p>
                <div style="display:flex;gap:10px;justify-content:center;">
                    <a href="signin.html" class="btn" style="padding:10px 16px;border-radius:10px;background:#00d4ff;color:#001;font-weight:700;text-decoration:none;">Sign In</a>
                    <a href="signup.html" class="btn" style="padding:10px 16px;border-radius:10px;background:#00aaff;color:#001;font-weight:700;text-decoration:none;">Sign Up</a>
                    <button id="auth-close" style="padding:10px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.18);background:transparent;color:#fff;cursor:pointer;">Close</button>
                </div>
            `;
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
            const closeBtn = panel.querySelector('#auth-close');
            closeBtn.addEventListener('click', () => { overlay.style.display = 'none'; });
        }
    }
    function showAuthPrompt() {
        ensureAuthPromptUI();
        const overlay = document.getElementById('auth-prompt');
        if (overlay) overlay.style.display = 'flex';
    }

    function ensureQuizUI() {
        const DONE_KEY = 'arena_quiz_done';
        if (localStorage.getItem(DONE_KEY)) return;
        if (!document.getElementById('quiz-prompt')) {
            const overlay = document.createElement('div');
            overlay.id = 'quiz-prompt';
            overlay.setAttribute('role','dialog');
            overlay.setAttribute('aria-modal','true');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;z-index:2100;';
            const panel = document.createElement('div');
            panel.style.cssText = 'background:linear-gradient(180deg,#0b0b12,#12121a);border:1px solid rgba(255,255,255,0.12);border-radius:16px;padding:24px;max-width:560px;width:94%;color:#fff;box-shadow:0 24px 70px rgba(0,0,0,0.6);direction:ltr;text-align:left;';
            panel.innerHTML = `
                <h2 style="margin:0 0 10px;color:#00d4ff;">Welcome! Quick Questions</h2>
                <p style="margin:0 0 16px;color:#d0d0d0;">Help us tailor your experience. This appears only once.</p>
                <div style="width:100%;height:8px;background:rgba(255,255,255,0.08);border-radius:8px;overflow:hidden;margin:8px 0 16px;">
                    <div id="quiz-progress" style="height:100%;width:0;background:linear-gradient(90deg,#00d4ff,#0084ff);"></div>
                </div>
                <div id="quiz-question" style="min-height:120px;"></div>
                <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;">
                    <button id="quiz-prev" style="padding:10px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#fff;cursor:pointer;">Back</button>
                    <button id="quiz-next" class="btn" style="padding:10px 16px;border-radius:10px;border:none;background:linear-gradient(90deg,#00d4ff,#0084ff);color:#001;font-weight:700;cursor:pointer;">Next</button>
                    <button id="quiz-submit" class="btn" style="padding:10px 16px;border-radius:10px;border:none;background:linear-gradient(90deg,#00d4ff,#0084ff);color:#001;font-weight:700;cursor:pointer;" disabled>Submit</button>
                    <button id="quiz-skip" style="padding:10px 16px;border-radius:10px;border:1px solid rgba(255,255,255,0.2);background:transparent;color:#fff;cursor:pointer;">Skip</button>
                </div>
            `;
            overlay.appendChild(panel);
            document.body.appendChild(overlay);

            const questions = [
                { key: 'often', type: 'radio', label: 'Do you purchase online often?', options: ['yes','no','sometimes'] },
                { key: 'platform', type: 'radio', label: 'Preferred platform', options: ['playstation','pc','xbox','mobile','other'], otherInput: true },
                { key: 'payment', type: 'radio', label: 'Preferred payment method', options: ['card','wallet','cod','other'], otherInput: true },
                { key: 'interests', type: 'checkbox', label: 'What are you most interested in?', options: ['accounts','points','cds'], requireOne: true },
            ];
            const answers = { often: null, platform: null, payment: null, interests: [] };
            let step = 0;

            const qContainer = panel.querySelector('#quiz-question');
            const progressEl = panel.querySelector('#quiz-progress');
            const prevBtn = panel.querySelector('#quiz-prev');
            const nextBtn = panel.querySelector('#quiz-next');
            const submitBtn = panel.querySelector('#quiz-submit');
            const skipBtn = panel.querySelector('#quiz-skip');

            function renderStep() {
                const q = questions[step];
                progressEl.style.width = `${Math.round((step)/questions.length*100)}%`;
                prevBtn.style.display = step === 0 ? 'none' : '';
                nextBtn.style.display = step < questions.length - 1 ? '' : 'none';
                submitBtn.style.display = step === questions.length - 1 ? '' : 'none';
                qContainer.innerHTML = `
                    <label style="display:block;margin:8px 0 10px;color:#9aa0a6;">${q.label}</label>
                    <div id="quiz-inputs" style="display:flex;gap:12px;flex-wrap:wrap;"></div>
                `;
                const inputsBox = qContainer.querySelector('#quiz-inputs');
                if (q.type === 'radio') {
                    q.options.forEach(opt => {
                        const label = document.createElement('label');
                        label.innerHTML = `<input type="radio" name="q_${q.key}" value="${opt}"> ${opt[0].toUpperCase()+opt.slice(1)}`;
                        inputsBox.appendChild(label);
                    });
                    if (q.otherInput) {
                        const other = document.createElement('input');
                        other.id = `q_${q.key}_other`; other.type='text'; other.placeholder='Specify other';
                        other.style.cssText = 'display:none;margin-left:8px;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.18);background:rgba(10,15,25,0.5);color:#fff;';
                        inputsBox.appendChild(other);
                        inputsBox.querySelectorAll(`input[name="q_${q.key}"]`).forEach(r => {
                            r.addEventListener('change', () => {
                                other.style.display = r.value === 'other' && r.checked ? 'inline-block' : 'none';
                                validateStep();
                            });
                        });
                        other.addEventListener('input', validateStep);
                    } else {
                        inputsBox.querySelectorAll(`input[name="q_${q.key}"]`).forEach(r => r.addEventListener('change', validateStep));
                    }
                } else if (q.type === 'checkbox') {
                    q.options.forEach(opt => {
                        const label = document.createElement('label');
                        label.innerHTML = `<input type="checkbox" name="q_${q.key}" value="${opt}"> ${opt[0].toUpperCase()+opt.slice(1)}`;
                        inputsBox.appendChild(label);
                    });
                    inputsBox.querySelectorAll(`input[name="q_${q.key}"]`).forEach(c => c.addEventListener('change', validateStep));
                }
                validateStep();
            }

            function validateStep() {
                const q = questions[step];
                let valid = false;
                if (q.type === 'radio') {
                    const sel = qContainer.querySelector(`input[name="q_${q.key}"]:checked`);
                    if (sel) {
                        if (q.otherInput && sel.value === 'other') {
                            const other = qContainer.querySelector(`#q_${q.key}_other`);
                            valid = !!(other && other.value.trim().length > 0);
                        } else {
                            valid = true;
                        }
                    }
                } else if (q.type === 'checkbox') {
                    const sels = Array.from(qContainer.querySelectorAll(`input[name="q_${q.key}"]:checked`));
                    valid = q.requireOne ? sels.length > 0 : true;
                }
                nextBtn.disabled = !valid;
                submitBtn.disabled = !allAnsweredNow();
            }

            function allAnsweredNow() {
                const partial = { ...answers };
                const q = questions[step];
                if (q.type === 'radio') {
                    const sel = qContainer.querySelector(`input[name="q_${q.key}"]:checked`);
                    if (sel) {
                        if (q.otherInput && sel.value === 'other') {
                            const other = qContainer.querySelector(`#q_${q.key}_other`);
                            partial[q.key] = other && other.value.trim() ? other.value.trim() : 'other';
                        } else {
                            partial[q.key] = sel.value;
                        }
                    }
                } else if (q.type === 'checkbox') {
                    partial[q.key] = Array.from(qContainer.querySelectorAll(`input[name="q_${q.key}"]:checked`)).map(i => i.value);
                }
                return !!(partial.often && partial.platform && partial.payment && Array.isArray(partial.interests) && partial.interests.length > 0);
            }

            function saveStep() {
                const q = questions[step];
                if (q.type === 'radio') {
                    const sel = qContainer.querySelector(`input[name="q_${q.key}"]:checked`);
                    if (sel) {
                        if (q.otherInput && sel.value === 'other') {
                            const other = qContainer.querySelector(`#q_${q.key}_other`);
                            answers[q.key] = other && other.value.trim() ? other.value.trim() : 'other';
                        } else {
                            answers[q.key] = sel.value;
                        }
                    }
                } else if (q.type === 'checkbox') {
                    answers[q.key] = Array.from(qContainer.querySelectorAll(`input[name="q_${q.key}"]:checked`)).map(i => i.value);
                }
            }

            function allAnswered() {
                return !!(answers.often && answers.platform && answers.payment && Array.isArray(answers.interests) && answers.interests.length > 0);
            }

            prevBtn.addEventListener('click', () => { if (step > 0) { step--; renderStep(); } });
            nextBtn.addEventListener('click', () => { saveStep(); if (step < questions.length - 1) { step++; renderStep(); } });
            submitBtn.addEventListener('click', async () => {
                saveStep();
                if (!allAnswered()) return;
                const params = new URLSearchParams();
                params.append('often', answers.often);
                params.append('platform', answers.platform);
                params.append('payment', answers.payment);
                params.append('interests', JSON.stringify(answers.interests));
                try {
                    const res = await fetch('api/quiz.php', { method: 'POST', body: params });
                    const data = await res.json();
                } catch (e) {}
                try { localStorage.setItem('arena_quiz_answers', JSON.stringify(answers)); } catch {}
                localStorage.setItem(DONE_KEY, '1');
                overlay.remove();
            });
            skipBtn.addEventListener('click', () => { localStorage.setItem(DONE_KEY, '1'); overlay.remove(); });

            renderStep();
        }
    }
    // Show first-run quiz on all pages
    ensureQuizUI();
    if (!(filename === 'index.html' || filename === '' || path.endsWith('/'))) {
        ensureCartUI();
        ensureAuthPromptUI();
    }

    // Export for manual use if needed
    window.productsLoader = {
        renderProducts,
        loadIndexProducts,
        loadShopProducts,
        loadCategoryProducts,
        addToCart
    };
})();

