# Portfolio site
This repo has been many things, and is currently morphing from a discordant series of experiments into a sort of portfolio site.

### Installation
---
Built using Node and MongoDB. You'll need these installed to run locally

Javascript packages are managed with NPM, and CSS packages are managed using Bower. To install, clone and then run

```
$ npm install
$ bower install
```

### Development
---
There are a set of Gulp tasks in `/gulp/tasks`, and a handy config file in `/gulp/config.js`. If you want to modify the JS bundles or add more stylesheets, this is the place to do it.

The default task is set to compile Sass/SCSS and JS on save and refresh the browser when necessary (CSS is injected) via Browsersync.

So, to get making things, just run:

```
$ gulp
```

### Linting
---
There's not a proper linter, but if you run `npm test` it'll check the front-end Javascript files against [Happiness guidelines](https://github.com/JedWatson/happiness) and maybe give you some pointers.

### Deployment
---
Deployment is done with Gulp, but it runs through NPM for simplicity. The deployment task can be tested locally by running.

```
$ npm start
```

When doing this, we can also simulate the production environment by modifying the `.env` file in root.
