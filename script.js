const buttons = document.querySelectorAll(".add-to-cart");

const cartCount = document.getElementById("cart-count");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

const checkoutBtn = document.getElementById("checkout-btn");

let cart = JSON.parse(localStorage.getItem("amiradelightsCart")) || [];

buttons.forEach(function(button) {

    button.addEventListener("click", function(){

        const cakeName = button.dataset.name;
        const cakePrice = Number(button.dataset.price);

        const existingCake = cart.find(function(cake) {
            return cake.name === cakeName;
        });

        if (existingCake) {
            existingCake.quantity++;
        } else {
            const cake = {
                name: cakeName,
                price: cakePrice,
                quantity: 1
            };

            cart.push(cake);
        }
        updateCart();
        showCartMessage(cakeName);
        
    });
});

function updateCart() {
    cartItems.innerHTML = "";

    localStorage.setItem("amiradelightsCart", JSON.stringify(cart));

    let total = 0;

    cart.forEach(function(cake, index) {
        total += cake.price * cake.quantity;

        const item = document.createElement("div");

        item.innerHTML = `
            <div class="cart-item">
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

                    <button class="remove-btn"
                        data-index="${index}">Remove</button>
                </div>
            </div>
        `;

        cartItems.appendChild(item);
    });

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
    }

    cartCount.textContent = cart.reduce(function(sum, cake) {
        return sum + cake.quantity;
    }, 0);

    cartTotal.textContent = total.toLocaleString("en-NG");

    document.querySelectorAll(".quantity-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            const index = Number(button.dataset.index);
            const action = button.dataset.action;

            if (action === "increase") {
                cart[index].quantity++;
            } else if (action === "decrease") {
                cart[index].quantity--;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }

            updateCart();
        });
    });

    document.querySelectorAll(".remove-btn").forEach(function(button) {
        button.addEventListener("click", function() {
            const index = Number(button.dataset.index);

            cart.splice(index, 1);

            updateCart();
        });
    });
}

checkoutBtn.addEventListener("click", function() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    window.location.href = "checkout.html";
});

const cartLink = document.querySelector('a[href="#cart"]');
const cartPanel = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartButton = document.getElementById("close-cart");

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
    openCart();
});

closeCartButton.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);

updateCart();

if (
    window.location.hash === "#cart" &&
    document.referrer &&
    new URL(document.referrer).origin === window.location.origin &&
    new URL(document.referrer).pathname !== window.location.pathname
) {
    openCart();
}

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