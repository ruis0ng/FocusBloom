<template>
<div class="container mx-auto p-6">
    <!-- Display a welcome message for my users -->
    <WelcomeMessage />

    <!-- Text field for the user to set their goal (one goal for one time) -->
    <ProjectGoalInput :goal="goal" @set-goal="setGoal" />

    <div v-if="goal">
        <ProjectGoalDisplay :goal="goal" />
        <!-- Text field for the user to set the tasks for the goal -->
        <TaskInput v-if="goal" @add-task="addTask" />
        <!-- Display the checklist of the tasks -->
        <TaskList :tasks="tasks" @update-progress="calculateProgress" @delete-task="deleteTask" />
        <!-- Display the progress Bar -->
        <ProgressBar v-if="tasks.length > 0" :progress="progress" />
        <!-- Display the current task -->
        <CurrentTaskDisplay :currentTask="currentTask" />
        <!-- Resumption Notes -->
        <NotesInput @add-note="addNote" />        
        <LatestNoteDisplay :latestNote="latestNote" />
    </div>
    <!-- Display their current goal for this time -->

</div>
</template>

<script>
import WelcomeMessage from '../components/WelcomeMessage.vue';
import ProjectGoalInput from '../components/ProjectGoalInput.vue';
import ProjectGoalDisplay from '../components/ProjectGoalDisplay.vue';
import TaskInput from '../components/TaskInput.vue';
import TaskList from '../components/TaskList.vue';
import ProgressBar from '../components/ProgressBarComponents/ProgressBar.vue';
import CurrentTaskDisplay from '../components/CurrentTaskDisplay.vue';
import NotesInput from '../components/NotesInput.vue';
import LatestNoteDisplay from '../components/LatestNoteDisplay.vue';

export default {
    components: {
        WelcomeMessage,
        ProjectGoalInput,
        ProjectGoalDisplay,
        TaskInput,
        TaskList,
        ProgressBar,
        CurrentTaskDisplay,
        NotesInput,
        LatestNoteDisplay
    },
    data() {
        return {
            goal: '',
            tasks: [],
            progress: 0,
            currentTask: null,
            latestNote: ''
        };
    },
    methods: {
        setGoal(goal) {
            this.goal = goal;
        },
        addTask(taskName) {
            const task = {
                name: taskName,
                completed: false
            };
            this.tasks.push(task);
            this.calculateProgress();
            this.updateCurrentTask();
        },
        deleteTask(index) {
            this.tasks.splice(index, 1);
            this.calculateProgress();
            this.updateCurrentTask();
        },
        calculateProgress() {
            if (this.tasks.length === 0) {
                this.progress = 0;
            } else {
                const completedTasks = this.tasks.filter(task => task.completed).length;
                this.progress = (completedTasks / this.tasks.length) * 100;
            }
        },
        updateCurrentTask() {
            this.currentTask = this.tasks.find(task => !task.completed) || null;
        },
        addNote(note) {
            this.latestNote = note;
        }
    },
    watch: {
        tasks: {
            deep: true,
            handler() {
                this.calculateProgress();
                this.updateCurrentTask();
            }
        }
    }
};
</script>

<style scoped>
</style>
