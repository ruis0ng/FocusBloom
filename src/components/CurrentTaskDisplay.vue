<template>
    <div v-if="currentTask" class="mt-4">
      <h3 class="text-lg font-semibold">Your Current Task is:</h3>
      <p class="text-gray-700">{{ currentTask.name }}</p>
    </div>
    <div v-else class="mt-4 text-gray-700">
      <h3 class="text-lg font-semibold">Your Current Task is:</h3>
      <p>All tasks completed! Congratulations!🎉</p>
    </div>
  </template>

<script>
export default {
  props: {
    currentTask: {
      type: Object,
      default: null
    }
  }
};
</script>

<style scoped>
</style>
