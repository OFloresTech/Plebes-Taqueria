const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to serve static files and parse form data
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST endpoint to receive order and send email
app.post('/send-order', async (req, res) => {
  const { name, address, phone, cart, location, paymentMethod, instructions } = req.body;

  // Send all orders to your email for now
  const recipientEmail = 'oborawatabanost@gmail.com';

  // Configure the email transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'oborawatabanost@gmail.com', // Your Gmail
      pass: 'qxkltssibjqwiren'           // Your 16-digit app password (NO SPACES)
    },
  });

  // Format cart items
  const cartDetails = cart.map(item => `${item.quantity}x ${item.name} ($${item.price})`).join('\n');

  // Email content
  const mailOptions = {
    from: 'oborawatabanost@gmail.com',
    to: recipientEmail,
    subject: `Nuevo pedido desde ${location}`,
    text: `
Nombre: ${name}
Teléfono: ${phone}
Dirección: ${address}
Ubicación seleccionada: ${location}
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
    console.error('Error al enviar el correo:', error);
    res.status(500).send('Hubo un problema al enviar el pedido');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
