<template>
    <div v-if="latestNote" class="mt-4 text-gray-700">
      <h3 class="text-lg font-semibold">Latest Note</h3>
      <p>{{ latestNote }}</p>
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
  