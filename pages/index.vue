<script setup lang="ts">
import { definePageMeta } from "#imports";

definePageMeta({
  middleware: "auth",
  auth: {
    guestRedirectUrl: "/login",
  },
});
</script>

<template>
  <h1 class="font-sans">this is sans</h1>
  <h2 class="font-serif">this is serif</h2>
  <UserButton />
</template>
