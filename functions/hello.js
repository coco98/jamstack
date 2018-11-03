// import nodemailer from 'nodemailer';

exports.handler = (event, context, cb) => {
  console.log(event);
  cb(null, {
    statusCode: 200,
    body: JSON.stringify({msg: 'Hello world'})
  });
};
