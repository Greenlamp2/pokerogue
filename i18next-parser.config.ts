const config = {
  // Save the _old files
  createOldCatalogs: true,

  // Indentation of the catalog files
  indentation: 2,

  // Keep keys from the catalog that are no longer in code
  keepRemoved: false,

  // Key separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict.
  // You might want to set `keySeparator: false` and `namespaceSeparator: false`.
  keySeparator: false,
  namespaceSeparator: false,

  // An array of the locales in your applications
  locales: ['en', 'fr', 'es', 'de', 'it', 'pt_BR', 'zh_CN'],

  output: 'src/locales/$LOCALE/auto-generated/translation.json',

  // An array of globs that describe where to look for source files relative to the location of the configuration file
  input: ['src/**/*.ts', 'src/**/*.js'],

  // Display info about the parsing including some stats
  verbose: false,

  lexers: {
    js: ['JsxLexer'],
    jsx: ['JsxLexer'],
    ts: ['JsxLexer'],
    tsx: ['JsxLexer'],
    default: ['TypescriptLexer']
  },

  // Default value to give to empty keys
  defaultValue: "",

  lineEnding: 'auto',

  sort: true,
};

export default config;
