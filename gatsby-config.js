const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  pathPrefix: process.env.PATH_PREFIX || '/gemaelde',
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-react-helmet",
    "gatsby-transformer-json",
    "gatsby-plugin-sass",
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'material icons',
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-i18n',
      options: {
        langKeyDefault: 'de',
        useLangKeyLayout: false,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'content',
        path: './content/',
        ignore: ['**/_archiv/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '~': resolve('src'),
        },
        extensions: [
          'js',
          'jsx',
          'css',
          'scss',
          'json',
        ],
      },
    },
  ],
};
