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
