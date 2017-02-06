/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const yahooProxyOptions = {
  target: 'http://download.finance.yahoo.com',
  changeOrigin: true,
  pathRewrite: {
    '^/external/yahoo': ''
  }
};

const wikipediaProxyOptions = {
  target: 'https://en.wikipedia.org',
  changeOrigin: true,
  pathRewrite: {
    '^/external/wikipedia': ''
  }
};

module.exports = {
  yahoo: yahooProxyOptions,
  wikipedia: wikipediaProxyOptions
};