<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
    error: Object as () => NuxtError,
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <NuxtLayout>
        <h1>Oopsie! {{ error?.statusCode}}</h1>
        <h2>{{ error?.message }}</h2>
        <button @click="handleError" class="px-4 py-2 bg-red-500 rounded-xl">
            Clear errors
        </button>
  </NuxtLayout>
</template>