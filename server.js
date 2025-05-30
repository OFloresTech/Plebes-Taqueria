const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
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
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',       // Your full Gmail address
    pass: 'your-app-password'            // The 16-character app password you generated
  }
});
