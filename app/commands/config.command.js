export class Config {
  port = new Number();
  mongo = {
    connectionString: new String(),
    collections: {
      user: {
        name: new String(),
      },
      restaurant: {
        name: new String(),
      },
      branch: {
        name: new String(),
      },
      product: {
        name: new String(),
      },
      payment: {
        name: new String(),
      },
    }
  };
  firebaseAdminConfig = {
    type: new String(),
    project_id:  new String(),
    private_key_id:  new String(),
    private_key:  new String(),
    client_email:  new String(),
    client_id:  new String(),
    auth_uri:  new String(),
    token_uri:  new String(),
    auth_provider_x509_cert_url:  new String(),
    client_x509_cert_url:  new String(),
  };
  firebaseAppConfig = {
    apiKey: new String(),
    authDomain: new String(),
    projectId: new String(),
    storageBucket: new String(),
    messagingSenderId: new String(),
    appId: new String(),
    measurementId: new String(),
  };
  appName = new String();
  pagination = {
    page: new Number(),
    pageSize: new Number(),
    orderDirection: new Number(),
    orderBy: new String(),
  };
  cloudinary = {
    cloudinaryName: new String(),
    cloudinaryApiKey:new String(),
    cloudinaryApiSecret: new String(),
  };
  square = {
    locationId: new String(),
    accessToken: new String(),
  }
}