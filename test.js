const { test } = require('ava');

const SendgridLiquidMailer = require('.');

test('test sendLiquidEmail', t => {
  const expectedMail = {
    from: {
      email: 'from@example.com',
      name: 'Example Sender'
    },
    personalizations: [
      {
        to: [
          {
            email: 'marekz@gmail.com',
            name: 'A Recipient'
          }
        ]
      }
    ],
    subject: 'You are a winner, world!!',
    content: [
      {
        type: 'text/plain',
        value: 'Hello, world'
      }
    ]
  };

  const sendgridApiKey = 'apikey123';

  const mailer = new SendgridLiquidMailer(sendgridApiKey);

  const email = {
    bodyTemplate: `Hello, {{name}}`,
    data: {
      name: 'world'
    },
    fromAddress: 'from@example.com',
    fromName: 'Example Sender',
    toAddress: 'marekz@gmail.com',
    bccAddress: 'marek@example.com',
    toName: 'A Recipient',
    subjectTemplate: 'You are a winner, {{name}}!!'
  };

  mailer.send = function(mail) {
    t.snapshot(mail);
    return Promise.resolve();
  };

  return mailer.sendLiquidEmail(email);
});
