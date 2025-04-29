const menuItemsContainer = document.getElementById('menu-items');
const bebidasItemsContainer = document.getElementById('bebidas-items'); // Nova linha
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');
const checkoutButton = document.getElementById('checkout-button');
const customerNameInput = document.getElementById('customer-name');
const customerAddressInput = document.getElementById('customer-address');
const customerPhoneInput = document.getElementById('customer-phone');
const cartItemCountElement = document.getElementById('cart-item-count');
const pedidoFinalizadoPopup = document.getElementById('pedido-finalizado-popup');
const productModal = document.getElementById('product-modal');
const closeModalButton = document.getElementById('close-modal');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalPrice = document.getElementById('modal-price');
const modalQuantitySpan = document.getElementById('modal-quantity');
const modalIncreaseButton = document.getElementById('modal-increase-quantity');
const modalDecreaseButton = document.getElementById('modal-decrease-quantity');
const modalAddToCartButton = document.getElementById('modal-add-to-cart');

let menu = [
    { id: 1, name: 'Tropeiro', description: 'O sabor da tradição mineira em cada garfada. Feijão, linguiça, bacon, ovos, couve e farofa.', price: 28.90, image: 'assets/tropeiro.jpg', category: 'principal' }, 
    { id: 2, name: 'Macarrão', description: 'O verdadeiro sabor caseiro em cada garfada. Macarrão al dente, molho artesanal, queijo derretido e um toque de manjericão.', price: 21.90, image: 'assets/macarrao.jpg', category: 'principal' }, 
    { id: 3, name: 'Lasanha', description: 'Camadas de puro sabor em cada mordida. Massa fresca, molho suculento, queijo derretido e aquele toque especial de carinho.', price: 18.90, image: 'assets/lasanha-bolonhesa-na-pressao.jpg', category: 'principal' }, 
    { id: 4, name: 'Feijoada', description: 'O verdadeiro sabor brasileiro em cada colherada. Feijão preto, carnes nobres, temperos caseiros e aquele toque de tradição.', price: 28.90, image: 'assets/feijoada.jpg', category: 'principal' }, 
    { id: 5, name: 'Refrigerante Lata', description: 'Refrigerante em lata. (Coca-Cola, Pepsi, Fanta, Sprite, Guaraná)', price: 6.50, image: 'assets/refrigerantes.png', category: 'bebida' }, 
    { id: 6, name: 'Suco Natural', description: 'Suco natural. (Laranja, Maracujá, Acerola, Abacaxi)', price: 9.00, image: 'assets/suco-natural.jpg', category: 'bebida' }, 
];

let cart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
let currentModalItem = null;
let modalQuantity = 1;

function updateCartCount() {
    if (cartItemCountElement) {
        cartItemCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateHeaderCartCount(); 
}

function showModal(item) {
    currentModalItem = item;
    modalQuantity = 1;
    modalImage.src = item.image;
    modalImage.alt = item.name;
    modalTitle.textContent = item.name;
    modalDescription.textContent = item.description;
    modalPrice.textContent = `R$ ${item.price.toFixed(2)}`;
    modalQuantitySpan.textContent = modalQuantity;
    productModal.classList.remove('hidden');
}

function closeModal() {
    productModal.classList.add('hidden');
    currentModalItem = null;
    modalQuantity = 1;
}

function updateModalQuantity(change) {
    modalQuantity += change;
    if (modalQuantity < 1) {
        modalQuantity = 1;
    }
    modalQuantitySpan.textContent = modalQuantity;
}

function handleModalAddToCart() {
    if (currentModalItem) {
        const existingItemIndex = cart.findIndex(item => item.id === currentModalItem.id);
        if (existingItemIndex !== -1) {
            cart[existingItemIndex].quantity += modalQuantity;
        } else {
            cart.push({ ...currentModalItem, quantity: modalQuantity });
        }
        saveCart(); 
        closeModal();
    }
}

function renderMenuItems() {
    if (!menuItemsContainer || !bebidasItemsContainer) return;

    menuItemsContainer.innerHTML = '';
    bebidasItemsContainer.innerHTML = '';

    menu.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'bg-white rounded shadow p-4 cursor-pointer';
        menuItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="w-full h-32 object-cover rounded mb-2">
            <h3 class="text-lg font-semibold mb-1">${item.name}</h3>
            <p class="text-gray-600 text-sm mb-2">${item.description}</p>
            <p class="text-green-500 font-bold">R$ ${item.price.toFixed(2)}</p>
        `;
        menuItemDiv.addEventListener('click', () => showModal(item));

        if (item.category === 'principal') {
            menuItemsContainer.appendChild(menuItemDiv);
        } else if (item.category === 'bebida') {
            bebidasItemsContainer.appendChild(menuItemDiv);
        }
    });
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
    updateCartTotal();
}

function changeCartItemQuantity(itemId, newQuantity) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        cart[itemIndex].quantity = parseInt(newQuantity);
        if (cart[itemIndex].quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart(); 
            updateCartTotal();
        }
        renderCart();
    }
}

function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500">Seu carrinho está vazio.</p>';
        return;
    }
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.className = 'flex flex-col sm:flex-row items-center justify-between py-2 border-b gap-4';
        cartItemDiv.innerHTML = `
            <div class="flex items-center mb-2 sm:mb-0">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
                <div>
                    <h4 class="text-sm font-semibold">${item.name}</h4>
                    <p class="text-black text-xs">R$ ${item.price.toFixed(2)}</p>
                    ${item.observations ? `<p class="text-gray-500 text-xs italic">Obs: ${item.observations}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm focus:outline-none" onclick="changeCartItemQuantity(${item.id}, parseInt(this.nextElementSibling.value) - 1)">
                    -
                </button>
                <input type="number" min="1" value="${item.quantity}" class="w-12 text-center text-sm focus:outline-none border-none shadow-inner rounded" onchange="changeCartItemQuantity(${item.id}, this.value)">
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm focus:outline-none" onclick="changeCartItemQuantity(${item.id}, parseInt(this.previousElementSibling.value) + 1)">
                    +
                </button>
                <button class="text-red-500 hover:text-red-700 focus:outline-none" onclick="removeFromCart(${item.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItemDiv);
    });
}

function updateCartTotal() {
    if (!cartTotalElement) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotalElement.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function showPedidoFinalizadoPopup() {
    if (pedidoFinalizadoPopup) {
        pedidoFinalizadoPopup.classList.remove('opacity-0');
        setTimeout(() => {
            pedidoFinalizadoPopup.classList.add('opacity-0');
        }, 3000);
    }
}

if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        const customerName = customerNameInput ? customerNameInput.value : '';
        const customerAddress = customerAddressInput ? customerAddressInput.value : '';
        const customerPhone = customerPhoneInput ? customerPhoneInput.value : '';

        if (cart.length === 0 || !customerName || !customerAddress || !customerPhone) {
            alert('Por favor, adicione itens ao carrinho e preencha suas informações.');
            return;
        }

        let message = "*Novo Pedido:*\n\n";
        cart.forEach(item => {
            message += `*${item.name}* \nQuantidade: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\nTotal: *${cartTotalElement ? cartTotalElement.textContent.split(': ')[1] : '0.00'}*\n\n`;
        message += `Nome: ${customerName}\n`;
        message += `Endereço: ${customerAddress}\n`;
        message += `Telefone: ${customerPhone}`;

        const whatsappUrl = `https://api.whatsapp.com/send?phone=5531995822479&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');

        cart = [];
        saveCart();
        renderCart();
        updateCartTotal();

        if (window.location.pathname.includes('carrinho.html')) {
            showPedidoFinalizadoPopup();
        }
    });
}

if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
}

if (modalIncreaseButton) {
    modalIncreaseButton.addEventListener('click', () => updateModalQuantity(1));
}

if (modalDecreaseButton) {
    modalDecreaseButton.addEventListener('click', () => updateModalQuantity(-1));
}

if (modalAddToCartButton) {
    modalAddToCartButton.addEventListener('click', handleModalAddToCart);
}

// Inicializações
updateCartCount();
if (window.location.pathname.includes('index.html')) {
    renderMenuItems();
} else if (window.location.pathname.includes('carrinho.html')) {
    renderCart();
    updateCartTotal();
}


// aaaaaaa

const cartItemCountHeader = document.getElementById('cart-item-count-header');

function updateHeaderCartCount() {
    if (cartItemCountHeader) {
        cartItemCountHeader.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

// Chame a função também nas inicializações
updateHeaderCartCount();
updateCartCount();
if (window.location.pathname.includes('index.html')) {
    renderMenuItems();
} else if (window.location.pathname.includes('carrinho.html')) {
    renderCart();
    updateCartTotal();
}