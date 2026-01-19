<script setup lang="ts">
    const props = defineProps({
        limit: {
            type: Number,
            default: null
        }
    })

    const { data: posts } = await useAsyncData('blog-posts', () => {
        return queryCollection('blog')
            .select('id', 'path', 'title', 'stem')
            .where('stem', '<>', 'blog/index')
            .limit(props.limit)
            .all()
    })
</script>

<template>
    <slot :posts="posts">
        <div>
            <article v-for="post in posts" :key="post.id">
                <NuxtLink :to="post.path" class="underline hover:underline-offset-4">
                    {{ post.title }}
                </NuxtLink>
            </article>
        </div>
    </slot>
</template>