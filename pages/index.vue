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
  <h1>you're signed in!</h1>
  <UserButton />
</template>
