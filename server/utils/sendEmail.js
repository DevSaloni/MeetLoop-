import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const port = Number(process.env.EMAIL_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: port,
    secure: port === 465, // true for port 465, false for others (like 587, 2525)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      // Do not fail on invalid certificates
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000, // 10 seconds connection timeout
    greetingTimeout: 10000,   // 10 seconds greeting timeout
  });

  const message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
