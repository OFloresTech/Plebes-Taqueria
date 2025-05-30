const summaryList = document.getElementById("summary-list");
const totalDisplay = document.getElementById("total");
let cartItems = [];

function updateCartDisplay() {
  summaryList.innerHTML = "";
  let total = 0;

  cartItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.name}: ${item.quantity} x $${item.price} = $${item.quantity * item.price}`;

    const removeBtn = document.createElement("span");
    removeBtn.textContent = "❌";
    removeBtn.classList.add("remove-btn");
    removeBtn.onclick = () => {
      cartItems.splice(index, 1);
      updateCartDisplay();
    };

    li.appendChild(removeBtn);
    summaryList.appendChild(li);
    total += item.quantity * item.price;
  });

  totalDisplay.textContent = `Total: $${total}`;
}

document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const input = this.previousElementSibling;
    const quantity = parseInt(input.value);

    if (!quantity || quantity < 1) return;

    const name = input.dataset.name;
    const price = parseInt(input.dataset.price);

    // Check if item is already in cart
    const existingItem = cartItems.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.push({ name, quantity, price });
    }

    input.value = ""; // clear input
    updateCartDisplay();
  });
});

const paymentMethodSelect = document.getElementById('payment-method');
const transferInfoDiv = document.getElementById('transfer-info');
const referenceNumberInput = document.getElementById('payment-reference'); // ✅ corrected

paymentMethodSelect.addEventListener('change', () => {
  if (paymentMethodSelect.value === 'transfer') {
    transferInfoDiv.style.display = 'block';
    referenceNumberInput.setAttribute('required', 'required');
  } else {
    transferInfoDiv.style.display = 'none';
    referenceNumberInput.removeAttribute('required');
    referenceNumberInput.value = '';
  }
});
function checkOrderHours() {
  const now = new Date();
  const currentHour = now.getHours();
  const orderButton = document.getElementById("send-order-btn");

  // Create or find the message element
  let message = document.getElementById("hours-message");
  if (!message) {
    message = document.createElement("p");
    message.id = "hours-message";
    message.style.color = "red";
    message.style.fontWeight = "bold";
    orderButton.parentNode.insertBefore(message, orderButton);
  }

  // Allow orders from 13:00 (1 PM) to 23:00 (11 PM)
  if (currentHour >= 13 && currentHour < 23) {
    orderButton.disabled = false;
    message.textContent = ""; // clear any previous message
  } else {
    orderButton.disabled = true;
    message.textContent = "Lo sentimos, solo aceptamos pedidos en línea entre la 1:00 PM y las 11:00 PM.";
  }
}

document.addEventListener("DOMContentLoaded", checkOrderHours);
document.getElementById("send-order-btn").addEventListener("click", async () => {
  const name = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;
  const paymentMethod = document.getElementById("payment-method").value;
  const instructions = document.getElementById("instructions").value;

  const orderData = {
    name,
    address,
    phone,
    location,
    paymentMethod,
    instructions,
    cart: cartItems, // cartItems from your existing JS
  };

  const response = await fetch('/send-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (response.ok) {
    alert('¡Pedido enviado con éxito!');
  } else {
    alert('Hubo un problema al enviar el pedido.');
  }
});

