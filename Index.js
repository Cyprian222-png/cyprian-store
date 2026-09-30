const products = [
    {
        id: 1,
        name: "Classic Sneakers",
        price: 18000,
        icon: "👟"
    },
    {
        id: 2,
        name: "Premium T-Shirt",
        price: 8500,
        icon: "👕"
    },
    {
        id: 3,
        name: "Denim Jeans",
        price: 15000,
        icon: "👖"
    },
    {
        id: 4,
        name: "Leather Bag",
        price: 12000,
        icon: "👜"
    },
    {
        id: 5,
        name: "Wristwatch",
        price: 10000,
        icon: "⌚"
    },
    {
        id: 6,
        name: "Hoodie",
        price: 14500,
        icon: "🧥"
    }
];

let cart = {};

function money(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

function showProducts() {
    const container = document.getElementById("products");

    container.innerHTML = "";

    products.forEach(function(product) {
        container.innerHTML += `
            <div class="product">

                <div class="product-image">
                    ${product.icon}
                </div>

                <h3>${product.name}</h3>

                <div class="price">
                    ${money(product.price)}
                </div>

                <button onclick="addToCart(${product.id})">
                    Add to Order
                </button>

            </div>
        `;
    });
}

function addToCart(id) {

    if (cart[id]) {
        cart[id]++;
    } else {
        cart[id] = 1;
    }

    showCart();
}

function changeQuantity(id, amount) {

    cart[id] += amount;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    showCart();
}

function showCart() {

    const cartContainer = document.getElementById("cart");
    const cartCount = document.getElementById("cartCount");
    const totalElement = document.getElementById("total");

    const ids = Object.keys(cart);

    let totalItems = 0;
    let totalPrice = 0;

    if (ids.length === 0) {

        cartContainer.innerHTML = `
            <p class="empty">
                Your order is empty.
                Add a product above.
            </p>
        `;

        cartCount.textContent = "0";
        totalElement.textContent = "₦0";

        return;
    }

    cartContainer.innerHTML = "";

    ids.forEach(function(id) {

        const product = products.find(
            function(p) {
                return p.id == id;
            }
        );

        const quantity = cart[id];

        const subtotal = product.price * quantity;

        totalItems += quantity;
        totalPrice += subtotal;

        cartContainer.innerHTML += `
            <div class="order-item">

                <div>
                    <strong>${product.name}</strong>
                    <br>
                    <small>${money(product.price)}</small>
                </div>

                <div class="quantity">

                    <button onclick="changeQuantity(${product.id}, -1)">
                        −
                    </button>

                    <span>${quantity}</span>

                    <button onclick="changeQuantity(${product.id}, 1)">
                        +
                    </button>

                </div>

            </div>
        `;
    });

    cartCount.textContent = totalItems;
    totalElement.textContent = money(totalPrice);
}

function scrollToOrder() {

    document
        .getElementById("order")
        .scrollIntoView({
            behavior: "smooth"
        });
}

document
    .getElementById("orderForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        if (Object.keys(cart).length === 0) {

            alert("Please add at least one product.");

            return;
        }

        const name =
            document.getElementById("name").value;

        const phone =
            document.getElementById("phone").value;

        const address =
            document.getElementById("address").value;

        const payment =
            document.getElementById("payment").value;

        const notes =
            document.getElementById("notes").value;

        let orderText =
            "CYPRIAN STORE ORDER\n\n";

        orderText +=
            "Customer: " + name + "\n";

        orderText +=
            "Phone: " + phone + "\n";

        orderText +=
            "Address: " + address + "\n\n";

        orderText += "ITEMS:\n";

        let total = 0;

        Object.keys(cart).forEach(function(id) {

            const product = products.find(
                function(p) {
                    return p.id == id;
                }
            );

            const quantity = cart[id];

            const subtotal =
                product.price * quantity;

            total += subtotal;

            orderText +=
                product.name +
                " x" +
                quantity +
                " = " +
                money(subtotal) +
                "\n";
        });

        orderText +=
            "\nTOTAL: " + money(total);

        orderText +=
            "\nPayment: " + payment;

        orderText +=
            "\nNote: " +
            (notes || "None");

        document.getElementById("summary")
            .textContent = orderText;

        document.getElementById("confirmation")
            .style.display = "block";

        document.getElementById("confirmation")
            .scrollIntoView({
                behavior: "smooth"
            });

        window.lastOrder = orderText;
    });

function copyOrder() {

    if (!window.lastOrder) {
        return;
    }

    navigator.clipboard
        .writeText(window.lastOrder)
        .then(function() {

            alert("Order details copied!");

        })
        .catch(function() {

            alert(
                "Copy failed. Please copy the order manually."
            );

        });
}

showProducts();
showCart();