<!-- Display the current task -->
<template>  
    <div v-if="currentTask" class="mt-4">
      <h3 class="text-gray-700">Your Current Task is:</h3>
      <p class="text-lg font-semibold">{{ currentTask.name }}</p>
    </div>
    <div v-else-if="hasTasks" class="text-gray-700">
      <p> All tasks completed! Congratulations! 🎉</p>    
    </div>
    <div v-else class="mt-4 text-gray-700">
      <h3>Your Current Task is:</h3>
      <p class="text-lg font-semibold">There are currently no tasks, if you want, let's get started!😊</p>
    </div>
  </template>

<script>
export default {
  props: {
    currentTask: {
      type: Object,
      default: null
    },
    hasTasks: {
      type: Boolean,
      default: false
    },
  }
};
</script>
