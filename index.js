const axios = require('axios');
const liquid = require('liquidjs');
const liquidEngine = liquid();
const checkOptions = require('check-options');
const Promise = require('bluebird');

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
      ['bodyTemplate', 'toAddress', 'toName', 'fromAddress', 'fromName', 'subjectTemplate'],
      { data: {} }
    );

    return Promise.props({
      body: parseAndRender(options.bodyTemplate, options.data),
      subject: parseAndRender(options.subjectTemplate, options.data)
    }).then(({body, subject}) => {
      return this.sendSimpleEmail({ ...options, plainTextBody: body, subject });
    });
  }
}

module.exports = SendgridLiquidMailer;
