let express = require("express"),
  nodeMailer = require('nodemailer'),
  bodyParser = require('body-parser');

let app = express();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

let orders = [];
let id = 0;

app.post('/api/orders', (req, res) => {
  id = id + 1;
  let order = {
      id: id,
      name: req.body.name,
      number: req.body.number,
      date: req.body.date
  };
  orders.push(order);
  res.send(order);
});

app.get('/api/orders', (req, res) => {
  res.send(orders);
});

app.delete('/api/orders/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = orders.map(order => { return order.id; }).indexOf(id);
  if (removeIndex === -1) {
      res.status(404).send("Sorry, that item doesn't exist");
      return;
  }
  orders.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.post('/api/send-email', function (req, res) {
  let transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
          user: 'oitavstudent@gmail.com',
          pass: 'oitemail'
      }
  });
  let mailOptions = {
      to: 'd_goodsell@byu.edu',
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

let server = app.listen(3636, () => {
    let port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});
