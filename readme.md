# Sendgrid Liquid Mailer

A quick way to send an email (via Sendgrid) rendered from a Liquid template.

Usage

```js
const SendgridLiquidMailer = require('sendgrid-liquid-mailer');

const mailer = new SendgridLiquidMailer(SENDGRID_API_KEY);
const email = {
    template: `Hello, {{name}}`,
    data: {name: 'world'},
    fromAddress: 'from@example.com',
    fromName: 'Example Sender',
    toAddress: 'recipient@example.com',
    toName: 'A Recipient',
    subject: 'You are a winner.'
};

const result = mailer.sendLiquidEmail(email);
```
