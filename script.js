const express = require("express"),
  bodyParser = require('body-parser'),
  nodeMailer = require('nodemailer'),
  mongoose = require('mongoose');

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

// let orders = [];
// let id = 0;

//Connect to the database
mongoose.connect('mongodb://localhost:27017/cp4', {
  useNewUrlParser: true
});

//Mongo scheme for orders
const orderSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: String,
});

//Mongo model for orders
const Order = mongoose.model('Order', orderSchema);

app.post('/api/orders', async (req, res) => {
  const order = new Order({
      name: req.body.name,
      number: req.body.number,
      date: req.body.date
  });
  try {
    await order.save();
    res.send(order);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    let orders = await Order.find();
    res.send(orders);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    let order = await Order.findOne({
      _id: req.params.id
    });
    order.name = req.body.name;
    order.number = req.body.number;
    order.date = req.body.date;
    await order.save();
    res.send(order);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    await Order.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.post('/api/send-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'byucs260winter2019@gmail.com',
          pass: 'brigham\'s-beard'
      }
  });
  let mailOptions = {
      to: req.body.recipient,
      subject: req.body.subject,
      html: req.body.message
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
  res.sendStatus(200);
});

let server = app.listen(3939, () => {
    let port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});
