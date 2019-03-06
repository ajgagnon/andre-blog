<template>
  <Layout class="bg-white">
    <transition name="fade" appear>
      <main>
        <header class="bg-grey-darkest">
          <div
            class="container xl:max-w-xl mx-auto text-center px-6 py-10 md:py-32 border-b border-grey-lighter"
          >
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-mono font-bold mb-1">
              <g-link to="/" class="text-grey-lightest no-underline">v-bind</g-link>
            </h1>
            <p class="text-grey-dark text-lg sm:text-3xl">A blog about Vue.js.</p>
          </div>
        </header>
        <section>
          <post-item v-for="edge in $page.posts.edges" :key="edge.node.id" :post="edge.node"/>
        </section>
        <pagination :info="$page.posts.pageInfo" v-if="$page.posts.pageInfo.totalPages > 1"/>
        <site-footer class="py-8 sm:py-16"/>
      </main>
    </transition>
  </Layout>
</template>

<script>
import config from "~/.temp/config.js";
import SiteFooter from "@/components/Footer";
import PostItem from "@/components/PostItem";
import Pagination from "@/components/Pagination";

export default {
  components: {
    PostItem,
    Pagination,
    SiteFooter
  },
  metaInfo() {
    return {
      title: this.config.siteName,
      meta: [
        { property: "og:type", content: "website" },
        { property: "og:title", content: this.config.siteName },
        { property: "og:description", content: this.config.siteDescription },
        { property: "og:url", content: this.config.siteUrl },
        { property: "og:image", content: this.ogImageUrl },

        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: this.config.siteName },
        { name: "twitter:description", content: this.config.siteDescription },
        { name: "twitter:site", content: "@ajgagnon" },
        { name: "twitter:creator", content: "@ajgagnon" },
        { name: "twitter:image", content: this.ogImageUrl }
      ]
    };
  },
  computed: {
    config() {
      return config;
    },
    ogImageUrl() {
      return `${this.config.siteUrl}/images/bleda-card.png`;
    }
  }
};
</script>

<page-query>
  query Home ($page: Int) {
    posts: allPost (page: $page, perPage: 6) @paginate {
      totalCount
      pageInfo {
        totalPages
        currentPage
      }
      edges {
        node {
          id
          title
          datetime: date (format: "YYYY-MM-DD HH:mm:ss")
          content
          excerpt
          description
          path
          cover
          tags {
            id
            title
            path
          }
          author {
            id
            title
            path
          }
        }
      }
    }
  }
</page-query>

<style scoped>
.fade-enter-active {
  transition: opacity 0.35s, transform 0.35s ease;
}

.fade-enter {
  opacity: 0;
  transform: translateX(-5px);
}
</style>

