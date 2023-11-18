// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // urlBase: '/api/v1',
  urlBase: 'http://localhost:8080/api/v1',

  firebase: {
    apiKey: "AIzaSyA0obW7z27JMD40XU8w6Ez32IOL2McxThI",
    authDomain: "anovawebapp.firebaseapp.com",
    databaseURL: "https://anovawebapp.firebaseio.com",
    projectId: "anovawebapp",
    storageBucket: "anovawebapp.appspot.com",
    messagingSenderId: "1067813322833",
    appId: "1:1067813322833:web:236403b1a44de2c750f870",
    measurementId: "G-G8Q3HGTYL0"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
