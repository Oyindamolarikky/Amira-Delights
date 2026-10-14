const buttons = document.querySelectorAll(".add-to-cart");

const cartCount = document.getElementById("cakes-cart-count");
const cartPanel = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartButton = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartLink = document.getElementById("cakes-cart-link");

let cart = JSON.parse(localStorage.getItem("amiradelightsCart")) || [];

function saveCart() {
    localStorage.setItem("amiradelightsCart", JSON.stringify(cart));
}

function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    cart.forEach(function(cake, index) {
        total += cake.price * cake.quantity;
        totalQuantity += cake.quantity;

        const item = document.createElement("div");

        item.className = "cart-item";

        item.innerHTML = `
            <p>
                <strong>${cake.name}</strong><br>
                ₦${cake.price.toLocaleString("en-NG")} each
            </p>

            <div class="quantity-controls">
                <button class="quantity-btn"
                    data-index="${index}"
                    data-action="decrease">−</button>

                <span>${cake.quantity}</span>

                <button class="quantity-btn"
                    data-index="${index}"
                    data-action="increase">+</button>
            </div>

            <button class="remove-btn"
                data-index="${index}">Remove</button>
        `;

        cartItems.appendChild(item);
    });

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = total.toLocaleString("en-NG");

    saveCart();
}

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        const cakeName = button.dataset.name;
        const cakePrice = Number(button.dataset.price);

        const existingCake = cart.find(function(cake) {
            return cake.name === cakeName;
        });

        if (existingCake) {
            existingCake.quantity++;
        } else {
            cart.push({
                name: cakeName,
                price: cakePrice,
                quantity: 1
            });
        }
        updateCart();
        showCartMessage(cakeName);



    });
});

function openCart() {
    cartPanel.classList.add("active");
    cartOverlay.classList.add("active");
    document.body.classList.add("cart-open");
}

function closeCart() {
    cartPanel.classList.remove("active");
    cartOverlay.classList.remove("active");
    document.body.classList.remove("cart-open");
}

cartLink.addEventListener("click", function(event) {
    event.preventDefault();
    updateCart();
    openCart();
});

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

cartItems.addEventListener("click", function(event) {
    const index = Number(event.target.dataset.index);

    if (event.target.classList.contains("quantity-btn")) {
        const action = event.target.dataset.action;

        if (action === "increase") {
            cart[index].quantity++;
        } else if (action === "decrease") {
            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }

        updateCart();
    }

    if (event.target.classList.contains("remove-btn")) {
        cart.splice(index, 1);
        updateCart();
    }
});

checkoutBtn.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "checkout.html";
});

updateCart();

function showCartMessage(cakeName) {
    let message = document.getElementById("cart-message");

    if (!message) {
        message = document.createElement("div");
        message.id = "cart-message";
        document.body.appendChild(message);
    }

    message.textContent = "🎂 " + cakeName + " added to your cart!";
    message.classList.add("show");

    clearTimeout(message.timer);

    message.timer = setTimeout(function() {
        message.classList.remove("show");
    }, 2500);
}

