# UXify Theme Kit: Make your own Bootstrap 4 Themes

This is simple starter project to help you get started quickly when making a custom Bootstrap 4 theme.

QuickStart
==========

View default theme
------------------

`gulp`

Create a new theme
------------------

`gulp create --theme [your-theme-name]`

View a new theme
----------------

`gulp view --theme [your-theme-name]`

(Static web server view of theme build)

Work on a theme
---------------

`gulp dev --theme [your-theme-name]`

Build a theme
-------------

`gulp build --theme [your-theme-name]`

(Also what you are viewing when running dev)

**Theme Sub commands**
Executed when you run the build command

`gulp bundle-css --theme [your-theme-name]`

`gulp bundle-js --theme [your-theme-name]`

`gulp bundle-html --theme [your-theme-name]`

(Generically builds all .html files and their directories like /docs/your-file.html or /html/other-file.html)

`gulp bundle-images --theme [your-theme-name]`

(Generically pulls in the directory for images if a value is set in /\_theme-config.json)

## Features

- Multiple themes and semantic versioning
- Uses themes/themes[theme].sass to incorporate in your own (continuous) build pipeline
- Generates builds/[theme]/[version]/[theme].css to incorporate in your own build pipeline (apply your own pre/postcss bundling)
- Generates [theme].min.css which is minified and browser prefixed, if you want to just import the css directly

## What this project does

This repository includes a project structure with a build script that builds a custom CSS version of Bootstrap 4, using Gulp. You can
clone this repository, run the Gulp task and go right into modifying variables and adding styles. There's also an HTML file that contains
a neatly organized collection of Bootstrap components that fit a 1920x1080 display, so you can instantly see the outcome.

## Prerequisites

- This works on Windows, macOS and Linux.
- Node Package Manager and Gulp are required. Make sure you can run `gulp -v` and `npm -v`.
- You can get Node at [nodejs.org](https://nodejs.org), then install gulp using `npm install gulp-cli -g`

## Getting started



## Inspiration

**Alexander Rechsteiner**

- <https://github.com/arechsteiner>

**Bootstrap**

- <https://github.com/twbs/bootstrap/>

## Copyright and license

Code released under the [MIT License](https://opensource.org/licenses/MIT).
