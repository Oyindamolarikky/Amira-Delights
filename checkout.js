const checkoutItems = document.getElementById("checkout-items");
const checkoutTotal = document.getElementById("checkout-total");

let cart = JSON.parse(localStorage.getItem("amiradelightsCart")) || [];

function displayCheckout() {
    checkoutItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>Your cart is empty.</p>";

        checkoutTotal.textContent = "0";
        return;
    }

    cart.forEach(function(cake) {
        const itemTotal = cake.price * cake.quantity;

        total += itemTotal;

        const item = document.createElement("div");

        item.innerHTML = `
            <p>
                <strong>${cake.name}</strong>
                <br>
                Quantity: ${cake.quantity}
                <br>
                Price: ₦${itemTotal.toLocaleString("en-NG")}
            </p>
        `;

        checkoutItems.appendChild(item);
    });

    checkoutTotal.textContent = total.toLocaleString("en-NG");
}

displayCheckout();

const checkoutForm = document.getElementById("checkout-form");

checkoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty! Please add cakes before placing an order.");
        return;
    }

    const customerName = document.getElementById("customer-name").value;
    const customerEmail = document.getElementById("customer-email").value;
    const customerPhone = document.getElementById("customer-phone").value;
    const deliveryAddress = document.getElementById("delivery-address").value;

    const order = {
        customer: {
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
            address: deliveryAddress
        },
        items: cart,
        total: cart.reduce(function(sum, cake) {
            return sum + cake.price * cake.quantity;
        }, 0)
    };

    // Prepare the customer's order details
    let orderMessage = `🎂 Amira Delights - NEW ORDER

    Customer Name: ${customerName}
    Email: ${customerEmail}
    Phone: ${customerPhone}
    Delivery Address: ${deliveryAddress}

    ORDER DETAILS:
    `;

    cart.forEach(function(cake) {
        orderMessage += `
    ${cake.name}
    Quantity: ${cake.quantity}
    Price: ₦${(cake.price * cake.quantity).toLocaleString("en-NG")}
    `;
    });

    orderMessage += `
    TOTAL: ₦${order.total.toLocaleString("en-NG")} 
    Thank you for choosing Amira Delights! ❤️
    `;

    // Open WhatsApp with the order details
    const whatsappNumber = "2347081578012";

    const whatsappLink =
        "https://wa.me/" +
        whatsappNumber +
     "?text=" +
        encodeURIComponent(orderMessage);

    window.open(whatsappLink, "_blank");

    // Show a professional order confirmation
    const confirmationMessage = `
    🎂 Amira Delights

    Thank you, ${customerName}! ❤️

    Your order details are ready.

    Total: ₦${order.total.toLocaleString("en-NG")}

    Please send your order through WhatsApp to complete your request.

    We look forward to baking something special for you! 🧁
    `;

    alert(confirmationMessage);
});