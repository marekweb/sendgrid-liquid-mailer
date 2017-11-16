const axios = require('axios');

class SendgridLiquidMailer {
  constructor(sendgridApiKey) {
    this.sendgridApiKey = sendgridApiKey;
  }

  send(mail) {
    // axios sends json header by default
    const requestOptions = {
      headers: {
        authorization: `Bearer ${this.sendgridApiKey}`
      }
    };

    return axios.post(
      'https://api.sendgrid.com/v3/mail/send',
      mail,
      requestOptions
    );
  }

  sendSimpleEmail({
    toAddress,
    toName,
    fromAddress,
    fromName,
    subject,
    plainTextBody
  }) {
    const mail = {
      from: { email: fromAddress, name: fromName },
      personalizations: [{ to: [{ email: toAddress, name: toName }] }],
      subject: subject,
      content: [
        {
          type: 'text/plain',
          value: plainTextBody
        }
      ]
    };
    return this.mail(mail);
  }

  sendLiquidEmail(options) {
    const plainTextBody = liquid.parseAndRender(options.template, options.data);
    return this.sendSimpleEmail({ ...options, plaimTextBody });
  }
}

module.exports = SendgridLiquidMailer;
