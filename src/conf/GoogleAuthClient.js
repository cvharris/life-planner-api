'use strict'

const GoogleAuth = require('google-auth-library')
const auth = new GoogleAuth
require('dotenv').config()

module.exports = function() {
  return new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, '', '')
}