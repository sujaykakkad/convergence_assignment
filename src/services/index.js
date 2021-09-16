exports.getHtmlPage = async (req, res) => {
  const flag = req;
  if (flag) {
    return {
      data: { message: 'Html Page' },
    };
  }
  res.status(404);
  return {
    data: {},
    errros: [{ message: 'File Not Found', trace: '' }],
  };
};

exports.generateReportHtmlToPdf = async (req) => {
  try {
    req.log.debug('In generateReportHTML');
    return {
      data: { message: 'Pdf generation initiated' },
    };
  } catch (e) {
    req.log.error(e);
    return {
      data: {},
      errros: [{ message: e.message, trace: '' }],
    };
  }
};
