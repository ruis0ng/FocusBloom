<template>
<div class="flex flex-col items-center mt-4">
    <input v-model="goalInput" class="input-field" placeholder="Enter your project goal" />
    <button class="btn-primary mt-3" @click="setGoal">Set Goal</button>
</div>
</template>


<script>
export default {
  props: {
    goal: String
  },
  data() {
    return {
      goalInput: this.goal || ""
    };
  },
  methods: {
    setGoal() {
      this.$emit("update:goal", this.goalInput);
    }
  }
};
</script>

<style scoped>
.input-field {
  padding: 8px;
  border-radius: 8px;
  border: 2px solid #4caf50;
  width: 75%;
}
.btn-primary {
  padding: 8px 12px;
  background-color: #4caf50;
  color: white;
  font-weight: bold;
  border-radius: 5px;
}
</style>