module.exports = process.env.NODE_ENV === 'development'
  ? require('./config/webpack.config.dev')
  : require('./config/webpack.config.prod');
