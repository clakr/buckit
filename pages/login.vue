<script setup lang="ts">
definePageMeta({
  middleware: "guest",
  auth: {
    authenticatedRedirectUrl: "/",
  },
});
</script>

<template>
  <main class="grid min-h-svh place-content-center">
    <SignIn />
  </main>
</template>
