module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
  fakeAwsAccessKey: process.env.FAKE_AWS_ACCESS_KEY_ID || '',
  debugMode: process.env.NODE_ENV !== 'production'
};
