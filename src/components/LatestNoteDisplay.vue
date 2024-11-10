<template>
    <div v-if="latestNote" class="mt-4 text-gray-700">
      <h3>I want to remind you of the followings: </h3>
      <p class="text-lg font-semibold">{{ latestNote }}</p>
      <h3>I hope it can help you resume your task</h3>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      latestNote: String
    }
  };
  </script>
  
  <style scoped>
  </style>
  