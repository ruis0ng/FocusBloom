<template>
<div v-if="goal" class="goal-container text-center mt-4">
    <h2>Your Project Goal is:</h2>
    <h2 class="text-xl font-semibold"> {{ goal }}</h2>    
</div>
</template>

<script>
export default {
    props: {
        goal: String
    }
};
</script>

<style scoped>
.goal-container {
    background-color: #f0f4ff;
    /* Light blue background */
    padding: 16px;
    border-radius: 8px;
    border: 2px solid #3b82f6;
    /* Blue border */
    margin-top: 20px;
}

.goal-text {
    color: #1e3a8a;
    /* Dark blue text color */
}
</style>
