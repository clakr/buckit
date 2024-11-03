// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: [
    "vue-clerk/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/fonts",
    "@nuxt/eslint",
    "shadcn-nuxt",
  ],
  clerk: {
    afterSignOutUrl: "/login",
  },
  runtimeConfig: {
    databaseUrl: "",
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
});
