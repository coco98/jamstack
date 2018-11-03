import nodemailer from 'nodemailer';

exports.handler = (event, context, cb) => {
  console.log(event);
  let transporter = nodemailer.createTransport({sendmail: true});
  transporter.sendMail({
      from: 'tanmai-netlify-test@tanmaigopal.com',
      to: 'tanmaig@hasura.io',
      subject: 'netlify message',
      text: 'I hope this message gets delivered!'
  }, (err, info) => {
      cb(null, {
        statusCode: 200,
        body: JSON.stringify({msg: 'Hello world'})
      });
      console.log(info.envelope);
      console.log(info.messageId);
  });
};
