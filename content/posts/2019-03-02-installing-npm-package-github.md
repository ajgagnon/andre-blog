---
title: "Installing An Npm Package From Github Directly"
slug: installing-an-npm-package-github-directly
description: "You can manage packages without them being published to npm!"
date: 2019-04-11 12:08:24
author: andre gagnon
tags:
    - npm
    - git
    - github
fullscreen: false
---

Did you know you can use NPM to manage packages that are not published to the npm directory? I didn't until today! Here is how it's done.

```shell

npm i <git-host>:<git-user>/<repo-name>#<branch-name>

```

For example, you can install the master branch of Laravel Mix:


```shell

npm i github:JeffreyWay/laravel-mix#master --save-dev

```

[Documentation](https://docs.npmjs.com/cli/install)

This is especially useful for these scenarios:

1. You want to install a package version that has not been updated on npm.
2. You are developing your own npm package and want to test it before publishing.
3. You want to manage private dependencies that you'll never publish to the directory.
4. Easily testing new or unreleased beta versions.

Be sure you are running **1.1.65 or higher** and have git installed on your machine. This works for github only.
