<template>
<div class="mt-6">
    <h3 class="text-lg font-semibold mb-2">Current Task</h3>
    <p v-if="currentTask" class="text-gray-700">{{ currentTask.title }}</p>
    <p v-else class="text-gray-500">All tasks completed! Congratulations!🎉</p>
</div>
</template>

  
<script>
export default {
    props: {
        tasks: {
            type: Array,
            required: true
        }
    },
    computed: {
        currentTask() {
            // Find the first incomplete task and mark it as the current task, to make sure that the user can stay in flow.
            return this.tasks.find(task => !task.completed) || null;
        }
    }
};
</script>

  
<style scoped>
</style>
