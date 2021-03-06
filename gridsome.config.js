class TailwindExtractor {
  static extract(content) {
    return content.match(/[A-Za-z0-9-_:\/]+/g) || [];
  }
}

module.exports = {
  siteName: "v-bind",
  siteDescription: "A blog about Vue.js",
  siteUrl: "https://v-bind.com",
  titleTemplate: `%s | v-bind`,
  // icon: "src/favicon.png",

  transformers: {
    remark: {
      externalLinksTarget: "_blank",
      externalLinksRel: ["nofollow", "noopener", "noreferrer"],
      plugins: [
        [
          "gridsome-plugin-remark-shiki",
          {
            theme: "Material-Theme-Palenight"
          }
        ]
      ]
    }
  },

  plugins: [
    {
      use: "@gridsome/source-filesystem",
      options: {
        path: "content/posts/**/*.md",
        typeName: "Post",
        route: "/:slug",
        refs: {
          tags: {
            typeName: "Tag",
            route: "/tag/:id",
            create: true
          },
          author: {
            typeName: "Author",
            route: "/author/:id",
            create: true
          }
        }
      }
    },
    {
      use: "@gridsome/plugin-google-analytics",
      options: {
        id: "UA-135781014-1"
      }
    },
    {
      use: "@gridsome/plugin-sitemap",
      options: {
        cacheTime: 600000 // default
      }
    },
    {
      use: "gridsome-plugin-rss",
      options: {
        contentTypeName: "Post",
        feedOptions: {
          title: "A blog about Vue.js",
          feed_url: "https://v-bind.com/feed.xml",
          site_url: "https://v-bind.com"
        },
        feedItemOptions: node => ({
          title: node.title,
          description: node.fields.description,
          url: "https://v-bind.com/" + node.slug,
          author: node.fields.author,
          date: node.fields.date
        }),
        output: {
          dir: "./static",
          name: "feed.xml"
        }
      }
    }
  ],

  chainWebpack: config => {
    config.module
      .rule("css")
      .oneOf("normal")
      .use("postcss-loader")
      .tap(options => {
        options.plugins.unshift(
          ...[
            require("postcss-import"),
            require("postcss-nested"),
            require("tailwindcss")("tailwind.js")
          ]
        );

        if (process.env.NODE_ENV === "production") {
          options.plugins.push(
            ...[
              require("@fullhuman/postcss-purgecss")({
                content: ["src/assets/**/*.css", "src/**/*.vue", "src/**/*.js"],
                extractors: [
                  {
                    extractor: TailwindExtractor,
                    extensions: ["css", "vue", "js"]
                  }
                ],
                whitelistPatterns: [/shiki/]
              })
            ]
          );
        }

        return options;
      });
  }
};
