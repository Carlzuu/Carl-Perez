document.addEventListener("DOMContentLoaded", function () {

    const filterButtons = Array.from(document.querySelectorAll('.filter-button'));
    const productGrid = document.getElementById('product-grid');
    const productCards = productGrid ? Array.from(productGrid.querySelectorAll('.product-card')) : [];

    function showCard(card) {
        card.style.display = '';
        card.classList.remove('hidden');
    }
    function hideCard(card) {
        card.style.display = 'none';
        card.classList.add('hidden');
    }

    function applyFilter(filter) {
        productCards.forEach(card => {
            const category = card.dataset.category || '';

            if (filter === 'all' || category === filter) {
                showCard(card);
            } else {
                hideCard(card);
            }
        });
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const filter = button.dataset.filter || 'all';

            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            applyFilter(filter);
        });
    });

    const initialActive = filterButtons.find(b => b.classList.contains('active')) || filterButtons[0];
    if (initialActive) {
        const initFilter = initialActive.dataset.filter || 'all';
        applyFilter(initFilter);
    }

    const addToCartButtons = document.querySelectorAll('.add-to-cart-button');
    const cartCountSpan = document.getElementById('cart-count');
    const cartButton = document.getElementById('cart-btn');
    const miniCartDropdown = document.getElementById('mini-cart-dropdown');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalItemsSummary = document.getElementById('total-items-summary');
    
    let cart = [];

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty.</p>';
            cartCountSpan.classList.add('hidden');
        } else {
            cart.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('cart-item');
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.onerror=null; this.src='https://placehold.co/50x50/3f1a58/ffffff?text=Product';">
                    <div class="cart-item-details">
                        <p class="cart-item-name">${item.name}</p>
                        <p class="cart-item-price">${item.price}₱</p>
                    </div>
                `;
                cartItemsContainer.appendChild(itemDiv);
            });
            cartCountSpan.classList.remove('hidden');
        }
        
        cartCountSpan.textContent = cart.length;
        totalItemsSummary.textContent = cart.length;
    }

    function toggleMiniCart(event) {
        event.preventDefault();
        miniCartDropdown.classList.toggle('active');
        miniCartDropdown.classList.toggle('hidden');
    }

    cartButton.addEventListener('click', toggleMiniCart);

    function flyToCart(button) {
        const productCard = button.closest('.product-card');
        const productData = {
            name: productCard.dataset.name,
            price: productCard.dataset.price,
            image: productCard.dataset.imageUrl
        };

        cart.push(productData);
        renderCart();

        const flyingClone = productCard.cloneNode(true);
        const startRect = button.getBoundingClientRect();
        const endRect = cartButton.getBoundingClientRect();

        flyingClone.style.position = 'fixed';
        flyingClone.style.zIndex = '9999';
        flyingClone.style.top = startRect.top + 'px';
        flyingClone.style.left = startRect.left + 'px';
        flyingClone.style.width = startRect.width + 'px';
        flyingClone.style.height = startRect.height + 'px';
        flyingClone.style.opacity = '0.8';
        flyingClone.style.pointerEvents = 'none';
        flyingClone.style.borderRadius = '0.5rem';
        flyingClone.style.transition = 'transform 0.8s cubic-bezier(0.5, -0.5, 0.5, 1.5), opacity 0.8s ease-in';
        
        const productInfo = flyingClone.querySelector('.product-info');
        if(productInfo) {
            productInfo.style.opacity = 0;
        }

        document.body.appendChild(flyingClone);

        setTimeout(() => {
            const deltaX = endRect.left + (endRect.width / 2) - (startRect.left + (startRect.width / 2));
            const deltaY = endRect.top + (endRect.height / 2) - (startRect.top + (startRect.height / 2));
            
            flyingClone.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.1)`;
            flyingClone.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            flyingClone.remove();
            
            miniCartDropdown.classList.add('active');
            miniCartDropdown.classList.remove('hidden');

            cartButton.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartButton.style.transform = 'scale(1)';
            }, 300);

        }, 800);
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            flyToCart(button);
        });
    });

    renderCart();
});