<script setup lang="ts">
import { definePageMeta } from "#imports";
import { SignUp } from "vue-clerk";

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
