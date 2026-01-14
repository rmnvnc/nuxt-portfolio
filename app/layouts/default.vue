<template>
    <div class="container mx-auto max-w-2xl">
        <nav class="mb-2">
            <ul class="pt-2">
                <li><NuxtLink to="/">Home</NuxtLink></li>
                <li><NuxtLink to="/about">About</NuxtLink></li>
            </ul>
        </nav>
        <main>
            <slot />
        </main>
    </div>
</template>