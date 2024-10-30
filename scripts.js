// Inicialização do carrinho
let cart = [];

// Função para adicionar um produto ao carrinho
function addToCart(product) {
    const foundProduct = cart.find(item => item.name === product.name);

    if (foundProduct) {
        foundProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

// Função para remover um produto do carrinho
function removeFromCart(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCart();
}

// Função para atualizar a visualização do carrinho
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - R$ ${item.price.toFixed(2)} (x${item.quantity})`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remover';
        removeButton.onclick = () => removeFromCart(index);

        li.appendChild(removeButton);
        cartItems.appendChild(li);
    });

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById('cart-total').textContent = 'Total: R$ ' + total.toFixed(2);
}

// Função para finalizar o pedido e redirecionar para a seleção de sabores
function finalizeOrder() {
    if (cart.length === 0) {
        alert('O carrinho está vazio!');
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const protocolNumber = Date.now();
    localStorage.setItem('totalPedido', total.toFixed(2));
    localStorage.setItem('protocolNumber', protocolNumber);
    localStorage.setItem('orderedProducts', JSON.stringify(cart));

    window.location.href = 'sabores.html'; // Redireciona para a página de seleção de sabores
}

// Função para carregar os produtos do pedido na página de seleção de sabores
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('sabores-list')) { // Verifica se está na página de seleção de sabores
        const saboresList = document.getElementById('sabores-list');
        const orderedProducts = JSON.parse(localStorage.getItem('orderedProducts')) || [];

        orderedProducts.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `
                <label for="${item.name}">Sabor para ${item.name}:</label>
                <input type="text" id="${item.name}" name="sabor-${item.name}" placeholder="Digite o sabor desejado" required>
            `;
            saboresList.appendChild(div);
        });
    }
});

// Função para enviar os dados de sabores e contato
function submitSabores() {
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const sabores = {};

    document.querySelectorAll('#sabores-list input[type="text"]').forEach(input => {
        sabores[input.id] = input.value;
    });

    localStorage.setItem('clienteEmail', email);
    localStorage.setItem('clienteTelefone', telefone);
    localStorage.setItem('saboresEscolhidos', JSON.stringify(sabores));

    alert('Dados enviados com sucesso! Entraremos em contato para finalizar o pedido.');
}
