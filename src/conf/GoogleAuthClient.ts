import GoogleAuth = require('google-auth-library')
const auth = new GoogleAuth
require('dotenv').config()

export const GoogleAuthClient = new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, '', '')
