---
title: "Integrating WordPress Javascript Translations with Vue.js"
slug: wordpress-javascript-translations-with-vue-js
description: "How to integrate WordPress i18n translations with Vue.js."
date: 2019-03-06 14:43:24
author: andre gagnon
tags:
    - wordpress
    - translate
    - i18n
cover: https://source.unsplash.com/dC6Pb2JdAqs
fullscreen: false
---

For years, internationalization support has been supported in WordPress when it came to PHP development. However, with the release of WordPress 5.0, included [JavaScript i18n support](https://make.wordpress.org/core/2018/11/09/new-javascript-i18n-support-in-wordpress/)! This makes it much easier for theme and plugin developers to translate strings in javascript functionality.

Even if our users are not yet on 5.0, we can still implement this in older versions of WordPress. Let's take a look at how to implement this in Vue.js in a way that works with newer and older versions of WordPress.

## 1. Include the @wordpress/i18n package

To take advantage of translation features, we need to include the [@wordpress/i18n](https://www.npmjs.com/package/@wordpress/i18n) package. WordPress 5.0+ has these baked in, but we want to make these available to older versions as well.

```shellscript
$ npm install @wordpress/i18n --save
```

Now that we've installed the `@wordpress/i18n` package, we can begin using the translation functions we're used to, but this time right in javascript!

```js
// examples
import { __, _x, _n, _nx, sprintf } from "@wordpress/i18n";

__("__", "my-domain");
_x("_x", "_x_context", "my-domain");
_n("_n_single", "_n_plural", number, "my-domain");
_nx("_nx_single", "_nx_plural", number, "_nx_context", "my-domain");
```

These functions mirror their php counterparts, which makes it nice and easy to understand for WordPress developers.

## 2. Integrate Translation Functions into Vue

However, it can be a bit tricky to implement into Vue.js, since template files cannot call these functions directly. To do this, we can do this through a global Vue mixin!

In our main app.js file, we can call this before we make our Vue instance:

```js
// import functions we'll use to translate
import { __, _x, _nx, sprintf } from "@wordpress/i18n";

// create a global mixin
Vue.mixin({
    methods: {
        __
        _x,
        _nx,
        sprintf
    }
});

// start our app
var app = new Vue({
  el: '#app'
})
```

This mixin exposes these methods in all our Vue components, which make it nice and easy to being adding translation strings. Here's an example of the different places we can add these translation functions, right within a Vue single file component:

```vue
<template>
    <div id="app">
        <!-- we can use these right in component templates! -->
        <h1>{{ __("My Todo App!", "my-domain") }}</h1>
        <TodoList :title="computedTitle" />
    </div>
</template>

<script>
import TodoList from "./components/TodoList.vue";

export default {
    components: {
        TodoList
    },
    computed: {
        computedTitle() {
            // use this. then the function name in this context
            return this.__("List Items", "my-domain");
        }
    }
};
</script>
```

## 3. Generating a new .pot file with wp-vue-i18n

Now that we've added our translations via Javascript, we can generate a new .pot file to make them available for translation. However, we have the problem that creating a pot file via traditional methods only scans php files, and not our `.js` or `.vue` files.

Luckily, there's an awesome open-source npm script called [wp-vue-i18n](https://www.npmjs.com/package/wp-vue-i18n) that lets us add these, by [Edi Amin](https://github.com/ediamin/wp-vue-i18n)!

```shellscript
$ npm install wp-vue-i18n --save-dev
$ wpvuei18n makepot
```

or in package.json

```yaml
...
"scripts": {
  ...
  "makepot": "wpvuei18n makepot"
},
...
```

## 4. Generate a JED file from a .po file

Once you have a translation, you can generate a JED file from the .po file. If you're using something like [Glotpress](https://wordpress.org/plugins/glotpress/), to source your translations, you can simply download the translations in JED format. However, if you've translated youself, you can run the po2json script

```shellscript
npm install po2json --save-dev
po2json translation.po translation.json -f jed
```

## 5. Load the JED file through wp_localize_script

In order to guarantee backwords compatiblity, we cannot yet use [wp_set_script_translations](https://developer.wordpress.org/reference/functions/wp_set_script_translations/). Instead, we'll be loading our translations throught the [wp_localize_script](https://codex.wordpress.org/Function_Reference/wp_localize_script) function. We'll localize our JSON translations through our app's javascript handle:

```php
<?php

// localize our translations and expose them to the global window object
wp_localize_script(
  'my-plugin-script-handle',
  'myPluginJSL10n',
  array(
    'my-domain' => wpse_1928_get_json_translations(),
  )
);

// get the json jed file
function wpse_1928_get_json_translations() {
  // get the json file (or wherever it's stored)
  // you may need to modify this depending on your file name an locaion
  $file = basename( dirname( __FILE__ ) ) . '/languages/my-plugin-' . get_locale() . '.jed.json';

  if ( ! $file || ! is_readable( $file ) ) {
		return false;
	}

	if ( file_exists( $file ) ) {
		$file = file_get_contents( $file );
		if ( is_string( $file ) && $file !== '' ) {
			return json_decode( $file, true );
		}
	}
}
```

This outputs our json translations into a global scope which we can access through the window object in javascript.

## Create a new JED instance configuration

Finally, we can load the translation messages via javascript using the setLocaleData function in our app.js file!

```js
import { setLocaleData } from "@wordpress/i18n";

// get plugin domain
// feel free to use lodash _.get or some other method to prevent property of undefined issues here!
const translations = window.myPluginJSL10n["my-domain"].locale_data.messages;

if (translations === false) {
    // Jed needs to have meta information in the object keyed by an empty string.
    setLocaleData({ "": {} }, textdomain);
} else {
    setLocaleData(translations, textdomain);
}
```
