<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  auth: {
    guestRedirectUrl: "/login",
  },
  layout: "auth",
});
</script>

<template>
  <main class="mx-auto max-w-screen-lg px-3 py-6">
    <h1>this is index</h1>
  </main>
</template>
