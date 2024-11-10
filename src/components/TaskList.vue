<!-- The fifth component -->
<template>
<ul class="mt-4 space-y-2">
    <li v-for="(task, index) in tasks" :key="index" class="flex items-center justify-between">
        <div class="flex items-center">
            <input type="checkbox" v-model="task.completed" @change="updateTaskStatus" class="mr-2" />

            <!-- Editable input field if in edit mode, otherwise display the task name -->
            <span v-if="!task.editing" :class="{ 'line-through': task.completed }">{{ task.name }}</span>
            <input v-else v-model="task.name" class="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none" />
        </div>

        <!-- Edit/Save and Delete Buttons -->
        <div class="flex space-x-2">
            <button @click="task.editing ? saveTask(task) : editTask(task)" class="text-blue-500 hover:underline">
                {{ task.editing ? "Save" : "Edit" }}
            </button>
            <button @click="deleteTask(index)" class="text-red-500 hover:underline">
                Delete
            </button>
        </div>
    </li>
</ul>
</template>

  
<script>
export default {
    props: {
        tasks: Array
    },
    methods: {
        updateTaskStatus() {
            this.$emit('update-progress');
        },
        deleteTask(index) {
            this.$emit('delete-task', index);
        },
        editTask(task) {
            // Enable edit mode for the task
            task.editing = true;
        },
        saveTask(task) {
            // Disable edit mode and update task name
            task.editing = false;
            this.$emit('update-progress');
        }
    }
};
</script>

  
<style scoped>
.line-through {
    text-decoration: line-through;
    color: grey;
}
</style>
