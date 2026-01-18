<script setup lang="ts">
    const route = useRoute()
    const { data: posts } = await useAsyncData('blog-posts', () => {
        return queryCollection('content').select('id', 'path', 'title').all()
    })
</script>

<template>
    <div>
        <article v-for="post in posts" :key="post.id">
            <NuxtLink :to="post.path" class="underline hover:underline-offset-4">
                {{ post.title }}
            </NuxtLink>
        </article>
    </div>
</template>