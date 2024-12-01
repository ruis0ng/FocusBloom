<template>
  <div class="blank-component">
  </div>
</template>

<script>
export default {
  name: "BlankComponent",
};
</script>

<style scoped>
.blank-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: Arial, sans-serif;
  color: #555;
  background-color: #f9f9f9;
  text-align: center;
}

.description {
  font-size: 18px;
  color: #333;
  margin: 20px;
}
</style>
