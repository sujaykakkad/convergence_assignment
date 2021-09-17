const authorizationService = require('../services/authorization');
const {
  login,
  generateReportHtmlToPdf,
  getPublicResources,
  getAdminResources,
} = require('../services');

module.exports = async (router) => {
  const initiateReportPdfDownloadSchema = {
    body: {
      type: 'object',
      required: [
        'aws_html_path',
        'report_sequence',
        'business_id',
        'application_id',
        'clientname',
        'report_type',
        'request_id',
        'callback_url',
        'aws_signed_url_expiry',
        'footer',
      ],
      properties: {
        aws_html_path: { type: 'string', minLength: 1 },
        aws_signed_url_expiry: { type: 'integer', minimum: 0 },
        callback_url: { type: 'string', minLength: 1 },
        pdf_password: { type: 'string' },
        business_id: {
          type: 'integer',
          enum: [27828, 27829],
        },
        sub_business_id: {
          type: 'integer',
          enum: [1],
        },
        request_id: { type: 'integer' },
        application_id: { type: ['integer', 'string'] },
        report_sequence: {
          type: 'array',
          items: { type: 'integer' },
        },
        clientname: { type: 'string', minLength: 1 },
        report_type: { type: 'string', minLength: 1 },
        footer: { type: 'boolean' },
      },
    },
  };

  router.post('/login', login);
  router.get('/resources/public/all', getPublicResources);
  router.get('/resources/only-admin/all', { onRequest: [authorizationService] }, getAdminResources);
  // router.get('/html-page', getHtmlPage);

  router.post(
    '/generate-report-html-to-pdf',
    {
      schema: initiateReportPdfDownloadSchema,
      onRequest: [authorizationService],
    },
    generateReportHtmlToPdf,
  );
};
