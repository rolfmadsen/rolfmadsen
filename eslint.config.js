const react = require('eslint-plugin-react');
const globals = require('globals');

module.exports = {
    settings: {
      react: {
        version: "18.2.0",
      },
    },
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ["eslint:recommended", "plugin:react/recommended"],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 13,
      sourceType: "module",
    },
    plugins: ["react"],
    rules: {
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
    },
  };
  