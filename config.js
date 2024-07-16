require('dotenv').config();

module.exports = {
  mongoURL: process.env.MONGO_URL,
  sessionSecret: process.env.SESSION_SECRET,
  githubClientID: process.env.GITHUB_CLIENT_ID,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
};
