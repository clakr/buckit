<script setup lang="ts">
definePageMeta({
  middleware: "guest",
  auth: {
    authenticatedRedirectUrl: "/",
  },
});
</script>

<template>
  <main class="min-h-svh grid place-content-center">
    <SignUp />
  </main>
</template>
