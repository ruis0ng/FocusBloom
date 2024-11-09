<template>
<ul class="mt-4 space-y-2">
    <li v-for="(task, index) in tasks" :key="index" class="flex items-center">
        <input type="checkbox" v-model="task.completed" @change="updateTaskCompletion" class="mr-2" />
        <label :class="{ 'line-through': task.completed }">{{ task.title }}</label>
    </li>
</ul>
</template>

  
<script>
export default {
    props: {
        tasks: Array
    },
    methods: {
        updateTaskCompletion() {
            this.$emit("task-completed");
        }
    }
};
</script>

  
<style scoped>
.line-through {
    text-decoration: line-through;
}
</style>
