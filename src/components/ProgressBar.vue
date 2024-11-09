<template>
<div class="w-full bg-gray-300 rounded-full mt-6">
    <div :style="{ width: progress + '%' }" class="bg-green-500 h-4 rounded-full transition-all duration-300"></div>
</div>
<p class="text-center mt-2 font-semibold">Progress: {{ progress }}%</p>
</template>


<script>
export default {
  props: {
    progress: {
      type: Number,
      required: true
    }
  }
};
</script>