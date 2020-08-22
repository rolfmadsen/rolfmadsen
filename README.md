# Search user interface based on Openplatform v3

Full disclaimer: I am a rookie playing at programming and learning from my errors as I go along ...

This project is created with a Python3 backend and ReactJS / NextJS frontend and deployed using the Vercel cloud platform for static sites and Serverless Functions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/rolfmadsen/rolfmadsen)

Search functions are dependent on the Openplatform API and a valid access token.

To add an access token go to https://vercel.com/rolfmadsen/[INSERT-USER-NAME]/settings/environment-variables. Add an environment variable named "ACCESS_PLATFORM_ACCESS_TOKEN_CLIENT" for both Production and  Development, and set the value to a valid access token from the Access platform. 

See the section "Tokens" under https://openplatform.dbc.dk/v3/ for details on how to get an access token.

## Vercel (Zeit.co) - Next.JS

I use a very simple build pipeline where every commit to Github builds the site on the Vercel cloud platform.

After committing code to Github you can se the build process under https://vercel.com/dashboard for the corresponding project.

Example: https://rolfmadsen.now.sh/

## Github

If you clone this repository and setup a local development environment you can use the Vercel CLI to retrieve your environment variables using the "vercel env pull" command.

N.B. If you encounter the error message: "Error! The specified token is not valid" try "vercel logout" and "vercel login".

Install Vercel CLI:
1. $ npm i -g vercel

Install Git on Ubuntu

1. $ sudo apt update
1. $ sudo apt install git
1. $ git --version

Commands for pushing code to github:
1. $ git add . (Explanation: Stage all changes in the current directory and sub-directories)
1. $ git commit -m "Describe the changes" (Explanation: Saves all changes to the local repository)
1. $ git push (Explanation: Upload all changes from the local repository to the master of the remote repository)

NB. Remember to setup a Github Token for use as a password in the terminal under https://github.com/settings/tokens.

## Use GET to submit search query to browser URL
- [x] create HTML form
- [x] Send data via GET method
- [x] Handle character encoding

```html
<form action="/api/[PATH-TO-DIRECTORY]" method="get" accept-charset="utf-8" autocomplete="on">
    <input type="search" id="searchquery" name="searchquery" placeholder="Search for a subject, creator or title ..." autofocus>
    <input type="submit" value="Search">
</form>
```

## Python script

Any script placed in the /api folder is processed serverside, which includes the Python script.

The Python script is activated when a query is pushed to /api/[PATH-TO-DIRECTORY].

- [x] Access URL parameter

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/api/opensearch/search', methods=['GET'])
def get_query_string():
    searchquery = request.args.get('searchquery')
    return searchquery
```

## Styling with Tailwind CSS

### components/layout.js

"""js
function Layout({ children }) {
    return <div>{children}</div>
  }
  
  export default Layout
"""

### pages/_app.js

```js
import '../styles/index.scss';
function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
export default App;
```

### styles/index.scss

```js
@tailwind base;

h1 {
  @apply text-2xl;
}
h2 {
  @apply text-xl;
}
h3 {
  @apply text-lg;
}
a {
  @apply text-blue-600 underline;
}

@font-face {
  font-family: Proxima Nova;
  font-weight: 400;
  src: url(/fonts/proxima-nova/400-regular.woff) format("woff");
}
@font-face {
  font-family: Proxima Nova;
  font-weight: 500;
  src: url(/fonts/proxima-nova/500-medium.woff) format("woff");
}

@tailwind components;
@tailwind utilities;

html,
body,
#__next {
  height: 100%;
}

.transition-color-shadow {
  transition-property: color, background-color, box-shadow;
}
```

### postcss.config.js

```js
module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-preset-env'
  ],
};
```

### tailwind.config.js

```js
module.exports = {
    purge: ['./src/components/**/*.tsx', './src/pages/**/*.tsx'],
    theme: {
      screens: {
        xsm: '414px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
      },
      extend: {},
    },
    variants: {},
    plugins: [],
  };
```

### Add browserlist to package.json

```js
{
"browserslist": [">0.3%", "not ie 11", "not dead", "not op_mini all"]
}
```

### Sources

https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss
https://nextjs.org/learn/basics/assets-metadata-css/layout-component
https://nextjs.org/learn/basics/assets-metadata-css/global-styles

## Noter

1. Consider usering PurgeCSS to removed unused styles from Tailwind CSS. (Source: https://khanna.cc/blog/using-tailwind-ui-and-next-js-together/ - 3. Optimize for production with PurgeCSS.)