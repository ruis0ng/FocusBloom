<!-- The fourth component -->
<template>
<div class="flex items-center mt-4">
    <input v-model="newTask" class="input-field mr-2" placeholder="Enter a task" />
    <button class="btn-primary" @click="addTask">Add Task</button>
</div>
</template>

  
<script>
export default {
    data() {
        return {
            newTask: ''
        };
    },
    methods: {
        addTask() {
            if (this.newTask.trim()) {
                this.$emit('add-task', this.newTask.trim());
                this.newTask = '';
            }
        }
    }
};
</script>

  
<style scoped>
.input-field {
    padding: 8px;
    border-radius: 8px;
    border: 2px solid #4caf50;
    width: 75%;
}

.btn-primary {
    padding: 8px 12px;
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    border-radius: 5px;
}
</style>
