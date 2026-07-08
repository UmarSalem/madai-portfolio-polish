// const serverUrl = process.env.REACT_APP_SERVER_URL;
// const frontendUrl = process.env.REACT_APP_FRONTEND_URL
// const image_base_url = process.env.REACT_APP_IMAGE_ENDPOINT
// const file_base_url = process.env.REACT_APP_FILE_ENDPOINT

const serverUrl = "http://localhost:5122";


// const serverUrl = 'http://127.0.0.1:8000/';

export const Config = {

  secretPass: "replace-with-local-demo-secret-pass",
  serverUrl: serverUrl,

  serverApiUrl: serverUrl + 'api/',
  serverUrlImages: serverUrl + 'public/images/',
  serverUrlCategoryImages: serverUrl + 'images/categories/',
  serverUrlProductImages: serverUrl + 'public/images/products/',
  serverUrlUserImages: serverUrl + 'public/images/users/',
  adminApiTokenName: 'admin-login-token',
  roleName: 'role',
  email: 'email',
  verificationCode: 'verifiactionCode',

  userApiTokenName: 'user', 
  googleApiKey: 'replace-with-local-google-api-key',

  // Used in whole app
  currency_symbol: "DKK",
  currency: "Kr.",

  appName: "MAD - My AI Doctor",

  pushTokenName: 'device-push-token',

  // Here add language and then add transaltion file for languages
  languages: [
    { shortName: 'en', icon: '', longName: 'English' },
    { shortName: 'da', icon: '', longName: 'Danish' }
  ],
  firstVisitDone: "firstVisitDone",
  directory: "web-yaksport",
  defaultActivityImg: "../select-image.jpg",
  defaultImg: "select-image.jpg",
  defaultProductImageURI: 'https://www.thespruceeats.com/thmb/vJUFf6L4p8y9Cn_1pE9Z7Ua9uok=/3000x2001/filters:fill(auto,1)/indian-style-burger-1957599-hero-01-266103a4bb4e4ee7b5feb4da2d2e99da.jpg',




}
