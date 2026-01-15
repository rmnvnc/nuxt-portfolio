<script setup lang="ts">
    const colorMode = useColorMode();
    function changeColorMode() {
        colorMode.preference = colorMode.preference === 'light' ? 'dark' : 'light';  
    }
</script>

<template>
    <div class="container mx-auto max-w-2xl px-4">
        <button class="p-2 bg-blue-500 dark:bg-amber-900" @click="changeColorMode">Change color mode</button>
        <Menu />
        <main>
            <slot />
        </main>
    </div>
</template>

<style lang="css">
@reference '@/assets/css/main.css';


</style>