const axios = require('axios');
const liquid = require('liquidjs');
const liquidEngine = liquid();
const checkOptions = require('check-options');

class SendgridLiquidMailer {
  constructor(sendgridApiKey) {
    if (!sendgridApiKey) {
      throw new Error('Missing Sendgrid API key');
    }
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

  sendSimpleEmail(options) {
    const {
      toAddress,
      toName,
      fromAddress,
      fromName,
      subject,
      plainTextBody
    } = options;

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
    return this.send(mail);
  }

  sendLiquidEmail(options) {
    options = checkOptions(
      options,
      ['template', 'toAddress', 'toName', 'fromAddress', 'fromName', 'subject'],
      { data: {} }
    );

    return liquidEngine
      .parseAndRender(options.template, options.data)
      .then(plainTextBody => {
        return this.sendSimpleEmail({ ...options, plainTextBody });
      });
  }
}

module.exports = SendgridLiquidMailer;
