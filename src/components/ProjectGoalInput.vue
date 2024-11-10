<!-- The second component of the progressBarView.vue -->
<template>
<div v-if="!goal" class="flex flex-col items-center mt-4">
    <h2 class="text-2xl font-semibold mb-4">Please enter your project goal</h2>
    <input v-model="projectGoal" placeholder="Enter overall project goal" class="input-field mb-4" />
    <button @click="setGoal" class="btn-primary">
        Set Goal!
    </button>
</div>
</template>

<script>
export default {
    data() {
        return {
            projectGoal: ''
        };
    },
    props: ['goal'],
    methods: {
        setGoal() {
            if (this.projectGoal.trim()) {
                this.$emit('set-goal', this.projectGoal);
                this.projectGoal = '';
            }
        }
    }
};
</script>

<style scoped>
.input-field {
    width: 75%;
    padding: 8px;
    border-radius: 8px;
    border: 2px solid #4caf50;
}

.btn-primary {
    padding: 8px 12px;
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    border-radius: 5px;
    transition: background-color 0.3s;
}

.btn-primary:hover {
    background-color: #388e3c;
}
</style>
