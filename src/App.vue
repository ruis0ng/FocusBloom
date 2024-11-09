<template>
  <div>
    <!-- Navigation (can be expanded in the future for additional views) -->
    <nav class="bg-gray-800 text-white p-4">
      <router-link to="/" class="mr-4">Progress Bar Mode</router-link>
    </nav>

    <!-- Main content rendered by the router -->
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style>
/* Styling for the navigation */
nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

/* Optional: Add global styles here */
</style>