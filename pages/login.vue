<script setup lang="ts">
import { definePageMeta } from "#imports";
import { SignIn } from "vue-clerk";

definePageMeta({
  middleware: "guest",
  auth: {
    authenticatedRedirectUrl: "/",
  },
});
</script>

<template>
  <SignIn />
</template>
