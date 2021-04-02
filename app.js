const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const nodemailer = require('nodemailer')

const app = express()

//View Engine Setup
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')))

//Setting the body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('contact', {
        layout: false
    })
})

app.post('/send', async (req, res) => {
    const output = `
        <p>You have new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li> Name: ${req.body.name} </li>
            <li> Company: ${req.body.company} </li>
            <li> Email: ${req.body.email} </li>
            <li> Phone: ${req.body.phone} </li>
        </ul>
        <h3>Message</h3>
        <p>${req.body.message}</p>
    `

    console.log(output)

    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'we.foodie.premi@gmail.com', // generated ethereal user
      pass: 'pmkarbitzpgbzocs', // generated ethereal password
    },
    tls:{
        rejectUnauthorized: false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nodemailer Conatct " <we.foodie.premi@gmail.com>', // sender address
    to: "apratimdas18@gmail.com", // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.render('contact', {
      layout: false,
      msg: 'Email has been sent'
  })
})

app.listen(3000, () => console.log('Server Started'))