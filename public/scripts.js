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
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// POST endpoint for orders
app.post('/send-order', async (req, res) => {
  const { name, address, phone, cart, location, paymentMethod, instructions } = req.body;

  // Define recipient emails based on location
  const locationEmails = {
    Tlajomulco: 'tlajomulco@example.com',
    Zapopan: 'zapopan@example.com',
    // Add more as needed
  };

  const recipientEmail = locationEmails[location];
  if (!recipientEmail) return res.status(400).send('Invalid location selected');

  // Configure the email transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com', // your email
      pass: 'your_app_password',    // app password, NOT your email password
    },
  });

  const cartDetails = cart.map(item => `${item.quantity}x ${item.name} ($${item.price})`).join('\n');

  const mailOptions = {
    from: 'your_email@gmail.com',
    to: recipientEmail,
    subject: `Nuevo pedido para ${location}`,
    text: `
Nombre: ${name}
Teléfono: ${phone}
Dirección: ${address}
Método de pago: ${paymentMethod}
Instrucciones: ${instructions}

Pedido:
${cartDetails}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Pedido enviado con éxito');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al enviar el pedido');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
