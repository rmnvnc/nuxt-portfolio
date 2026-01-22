<script setup lang="ts">
    const {error, pending, data: projects } = await useAsyncData(
        'github-projects', 
        () => $fetch('/api/projects'),
        {
            getCachedData: (key) => {
                return useNuxtApp().payload.data[key]
            },
            server: true,
            default: () => [],
        }
    );

    const sortedProjects = computed(() => {
        return projects.value ? projects.value.sort((a, b) => b.size - a.size) : [];
    })
</script>

<template>
    <div>
        <section v-if="pending">
            <svg class="mx-auto size-8 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </section>
        <section v-else-if="error">Error: {{ error }}</section>
        <section v-else class="grid grid-cols-1 gap-2">
            <NuxtLink v-for="project in sortedProjects" :to="project.html_url" :key="project.id" >
                <article class="rounded-xl border-2 border-gray-100">
                    <div class="flex items-start gap-4 p-4">
                        <img alt="" :src="project.owner.avatar_url" class="size-14 rounded-lg object-cover">
                        <div>
                            <h3 class="font-medium sm:text-lg">
                                {{ project.name }} 
                            </h3>

                            <p class="line-clamp-2 text-sm text-gray-700">
                                {{ project.description }} 
                            </p>

                            <div class="mt-2 sm:flex sm:items-center sm:gap-2">
                                <div class="flex items-center gap-1 text-gray-500">
                                    <p class="text-xs">{{project.size}} kb</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-end">
                        <strong class="-me-0.5 -mb-0.5 inline-flex items-center gap-1 rounded-ss-xl rounded-ee-xl bg-green-600 dark:bg-green-400 px-3 py-1.5 text-white dark:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                            </svg>
                            <span class="text-[10px] font-medium sm:text-xs">Public</span>
                        </strong>
                    </div>
                </article>
            </NuxtLink>
        </section>
    </div>
</template>