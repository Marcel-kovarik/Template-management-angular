export class Language {
  name: string;
  languageCode: string;
  declinations: [string];

  constructor(init?: Partial<Language>) {
    Object.assign(this, init);
  }
}
