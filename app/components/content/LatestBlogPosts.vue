
<script setup>
    defineProps({
        limit: {
            type: Number,
            default: null
        }
    })
</script>

<template>
    <BlogPosts v-slot="slotProps" :limit="limit">
        <ul>
            <li v-for="post in slotProps.posts" :key="post.id">
                <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
            </li>
        </ul>
    </BlogPosts>
</template>