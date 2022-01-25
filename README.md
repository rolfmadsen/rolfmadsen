# Search user interface based on Openplatform v3

Full disclaimer: I am a rookie playing at programming and learning from my errors as I go along ...

This project is created with a Python3 backend and ReactJS / NextJS frontend and deployed using the Vercel cloud platform for static sites and Serverless Functions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/project?template=https://github.com/rolfmadsen/rolfmadsen)

Search functions are dependent on the Openplatform API and a valid access token.

See the section "Tokens" under https://openplatform.dbc.dk/v3/ for details on how to get an access token.


## Vercel (Zeit.co) - Next.JS

I use a very simple build pipeline where every commit to Github builds the site on the Vercel cloud platform.

After committing code to Github you can se the build process under https://vercel.com/dashboard for the corresponding project.

Example: https://rolfmadsen.dk/

## Ready your Ubuntu

I have installed Ubuntu on a laptop for my local development environment.

### Update nodejs to version 14 due to dependency on this version
```console
  curl -sL https;//deb.nodesource.com/setup_14.x | sudo bash -
```

```console
  sudo apt -y install nodejs
```

```console
  node -v
```

### Install Git on Ubuntu
```console
  sudo apt update
```

```console
  sudo apt install git
```

```console
  git --version
```

#### Configure username and e-mail

Configure your name:
```console
  git config --global user.name "ENTER YOUR NAME"
```

Configure your e-mail-addresse:
```console
  git config --global user.email "GITHUB-USERNAME@users.noreply.github.com E-MAIL-ADDRESSE"
```
NB. Find your Github no-reply e-mail-adress under https://github.com/settings/emails. 

See configuration:
```console
  git config --list
```

### Install Vercel CLI:
```console
  npm i -g vercel
```

```console
  vercel -v
```

NB. When running $ "vercel -v" I got the response "command not found" and had to use $ "npm install -g npm".

## Github

If you clone this repository and setup a local development environment you can use the Vercel CLI to retrieve your environment variables using the "vercel env pull" command.

N.B. If you encounter the error message: "Error! The specified token is not valid" try "vercel logout" and "vercel login".

### Clone repository
Clone the code repository on Github to Github directory on your local development environment.

```console
  mkdir Github && cd Github
```

```console
  git clone https//github.com/rolfmadsen/rolfmadsen.git
```

Install all dependencies:
```console
  npm install
```

### Connect your local development environment to your Vercel project

1. Login (https://vercel.com/login) or create account (https://vercel.com/signup) on Vercel.
1. Create a new project (https://vercel.com/new).
1. Select "Add GitHub Org or Account".

Login to Vercel from terminal:
```console
  vercel login
```

Link local development environment to Vercel project: 
```console
  vercel link
```

Run project on localhost for testing before you commit changes to Github:
```console
  vercel dev
```
NB. To enable search in the Datawell you have to add the secret token for verification of your client to the Open Platform.

### Add access token for Open Platform as environment variable in Vercel

1. "Plaintext" is only for use on your local development environment.
1. "Secret" is for use on staging or production environments published on Vercel.

Use the key "vercel" for both environment variables, and set the value to a valid access token from the Access platform.

The access token kan be retrieved via https://openplatform.dbc.dk/v3/ under the "Tokens" section.


### Adding a staging domain for testing changes

First set up Vercel to build a staging site when you push changes to your staging branch in your Github organization:
1. Open https://vercel.com/[ENTER YOUR ORGANIZATION]/rolfmadsen/settings/domains
1. Add "staging.[ENTER YOUR DOMAIN].dk"
1. Add "https://github.com/[ENTER YOUR ORGANIZATION]/rolfmadsen/tree/staging"

Create staging branch
```console
  git branch staging
```
Shift to staging branch
```console
  git checkout staging
```
Perform the changes you wish on the staging branch.

Shift to master branch
```console
  git checkout master
```
Add the changes made on the staging branch to the master branch.
```console
  git merge staging
```
Push the merged changes on the master branch to origin (Github master branch)
```console
  git push
```

### Commands for pushing code to github:

Stage all changes in the current directory and sub-directories:

Show status of working tree/directory and staging area:
```console
git status
```

Add or track all files from working tree/directory to staging area:
```console
git add .
```
NB. Add specific files by exchanging "." with the "file-name".

See the history of changes to the repository:
```console
  git log --all --decorate --oneline --graph
```
NB. You can use graph as an alias for the previous "git log" command via:
```console
  alias graph="git log --all --decorate --oneline --graph"  
```

See the difference between working tree/direcotr and staging area:
```console
  git diff
```

Saves all changes to the local repository:
```console
  git commit -m "ENTER A DESCRIPTION OF THE CHANGE" 
```

Upload all changes from the local repository to the master of the remote repository:
```console
  git push
```
NB. When you push you will be promptet to login to Github and you can use a Github Token for use as a password in the terminal under https://github.com/settings/tokens.

Get updates from remote repository:
```console
  git pull
```

Close staging branch

NB. Checkout master branch before deleting staging branch.

```console
  git checkout master
  git branch -d staging
```

## Solving conflicts

Conflicts in package-lock.json can sometimes be resolved by fixing the conflict in package.json and then running:

```terminal
npm install --package-lock-only
```
## Github - Personal access token

1. Open https://github.com/settings/tokens
2. Click "Generate new token"
3. Add token name
4. Select scopes/permissions by clicking repo checkmark
5. Click "Generate token"
6. Copy the token to your preferred password manager
7. Open your terminal and navigate to local project directory
8. Remove old origin remote: 
```console
$ git remote remove origin
```
9. Add new origin remote: 
```console
$ git remote add origin https://{TOKEN}@github.com/{USERNAME}/{REPOSITORY}.git
```

## Development FAQ

### How to use GET to submit search query to browser URL

```html
<form action="/api/[PATH-TO-DIRECTORY]" method="get" accept-charset="utf-8" autocomplete="on">
    <input type="search" id="searchquery" name="searchquery" placeholder="Search for a subject, creator or title ..." autofocus>
    <input type="submit" value="Search">
</form>
```

#### Python script

Any script placed in the /api folder is processed serverside, which includes the Python script.

The Python script is activated when a query is pushed to /api/[PATH-TO-DIRECTORY].

```python
from flask import Flask, request

app = Flask(__name__)

@app.route('/api/opensearch/search', methods=['GET'])
def get_query_string():
    searchquery = request.args.get('searchquery')
    return searchquery
```

### Styling with Tailwind CSS

#### components/layout.js

"""js
function Layout({ children }) {
    return <div>{children}</div>
  }
  
  export default Layout
"""

#### pages/_app.js

```js
import '../styles/index.scss';
function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
export default App;
```

#### styles/index.scss

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

#### postcss.config.js

```js
module.exports = {
  plugins: [
    'tailwindcss',
    'postcss-preset-env'
  ],
};
```

#### tailwind.config.js

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

#### Add browserlist to package.json

```js
{
"browserslist": [">0.3%", "not ie 11", "not dead", "not op_mini all"]
}
```

#### Sources

1. https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss
1. https://nextjs.org/learn/basics/assets-metadata-css/layout-component
1. https://nextjs.org/learn/basics/assets-metadata-css/global-styles

### Notes

1. Consider usering PurgeCSS to removed unused styles from Tailwind CSS. 
(Source: https://khanna.cc/blog/using-tailwind-ui-and-next-js-together/ - 3. Optimize for production with PurgeCSS.)