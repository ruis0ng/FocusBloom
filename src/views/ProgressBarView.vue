<template>
<div class="container mx-auto p-6">
    <!-- Welcome Message -->
    <WelcomeMessage />

    <!-- Project Goal Input -->
    <div v-if="!goal">
        <ProjectGoalInput @update:goal="updateGoal" />
    </div>

    <!-- Display Goal and Task Input -->
    <div v-else>
        <h2 class="text-xl font-semibold text-center mt-4">Your Project Goal: {{ goal }}</h2>

        <!-- Task Input -->
        <TaskInput @add-task="addTask" />

        <!-- Task List -->
        <TaskList :tasks="tasks" @task-completed="updateProgress" />

        <!-- Progress Bar -->
        <ProgressBar :progress="progress" />
    </div>
</div>
</template>

<script>
import WelcomeMessage from '../components/WelcomeMessage.vue';
import ProjectGoalInput from '../components/ProjectGoalInput.vue';
import TaskInput from '../components/TaskInput.vue';
import TaskList from '../components/TaskList.vue';
import ProgressBar from '../components/ProgressBar.vue';

export default {
    components: {
        WelcomeMessage,
        ProjectGoalInput,
        TaskInput,
        TaskList,
        ProgressBar

    },
    data() {
        return {
            goal: '',
            tasks: [],
            progress: 0
        };
    },
    methods: {
        updateGoal(goal) {
            this.goal = goal;
        },
        addTask(task) {
            this.tasks.push({
                title: task,
                completed: false
            });
            this.updateProgress();
        },
        updateProgress() {
            const completedTasks = this.tasks.filter(task => task.completed).length;
            this.progress = this.tasks.length > 0 ?
                Math.round((completedTasks / this.tasks.length) * 100) : 0; //compute a rounded result about completeness of the goal
        }
    }
};
</script>
