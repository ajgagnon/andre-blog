# Bleda

> A blog based on [Gridsome](https://gridsome.org), inspired by the [Attila](https://github.com/zutrinken/attila) Ghost theme and styled with [Tailwind CSS](https://tailwindcss.com).

[![Netlify Status](https://api.netlify.com/api/v1/badges/73522bef-3651-4b57-ba18-261a130f04b3/deploy-status)](https://app.netlify.com/sites/v-bind/deploys)

## Features

- Sitemap
- RSS Feed
- Google Analytics
- Custom 404 Page
- Open Graph meta tags
- Code syntax highlighting
- Parallax post image covers
- Option for fullscreen covers
- Medium-like image lightbox
- Taxonomies: Tags and Authors
- Aproximate read time for posts
- Post excerpts: automatic or user-defined
- **Paginated** blog, [tag](https://gridsome-starter-bleda.netlify.com/tag/dummy/), and author archives
- Easily show post dates in your locale (moment.js)
- Posts show a warning if they're older than 1 year (configurable)

## Installation

It's recommended that you install Bleda with the `gridsome create` command, so that Gridsome removes the `.git` folder and installs NPM dependencies for you: 

```sh 
gridsome create my-website https://github.com/hellocosmin/gridsome-starter-bleda.git
```

Alternatively, you can clone this repo and set it up manually:

```sh 
git clone https://github.com/hellocosmin/gridsome-starter-bleda.git my-website

# navigate to the directory
cd my-website

# remove the Git folder
rm -rf .git

# install NPM dependencies
npm install
```

## Development

Run `gridsome develop` to start a local development server, or `gridsome build` to build the static site into the `dist` folder.

See the [Gridsome docs](https://gridsome.org/docs) for more information.
