// import nodemailer from 'nodemailer';

export handler = (event, context, cb) => {
  console.log(event);
  cb(null, {
    statusCode: 200,
    body: JSON.stringify({msg: 'Hello world'})
  });
};
