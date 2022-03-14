// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  autoConversationSaveTimer: (60 * 1000),
  apiUrl: 'https://builder-dev.dna-i.com/builder/api',
  azureTokenUrl: 'https://builder-moteur-dev.dna-i.com/builder-moteur/api/crea/{{CONV_CODE}}/token/azure/region/francecentral',
  checkPlayerUrl: 'https://builder-moteur-dev.dna-i.com/builder-moteur/api/crea/{{CONV_CODE}}/player/check'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
