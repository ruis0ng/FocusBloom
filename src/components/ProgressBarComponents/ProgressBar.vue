<template>
<div class="progress-bar-container w-full bg-gray-300 rounded-full mt-6">
    <div class="bg-green-500 h-4 rounded-full transition-all duration-300" :style="{ width: progress + '%' }"></div>
</div>

<p class="text-center mt-2 font-semibold">
    Your project progress is {{ progress }}% - {{ progressMessage }}
</p>
</template>

<script>
export default {
    props: {
        progress: {
            type: Number,
            required: true
        }
    },
    computed: {
        //Define the 6 phases of the motivational message
        progressMessage() {
            if (this.progress === 0) {
                return "Let's get started!";
            } else if (this.progress > 0 && this.progress <= 20) {
                return "You're off to a good start!";
            } else if (this.progress > 20 && this.progress <= 50) {
                return "You're making great progress!";
            } else if (this.progress > 50 && this.progress <= 75) {
                return "You're more than halfway there!";
            } else if (this.progress > 75 && this.progress < 100) {
                return "Almost there! Keep pushing!";
            } else {
                return "Congratulations! You've completed your project!";
            }
        }

    }

};
</script>

<style>
</style>
