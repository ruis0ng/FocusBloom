<template>
    <div class="mt-6">
      <textarea 
        v-model="note" 
        class="textarea-field"
        placeholder="Enter any notes to help you resume your task..."
      ></textarea>
      <button 
        class="btn-primary mt-2"
        @click="saveNote"
      >Save Note</button>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        note: ''
      };
    },
    methods: {
      saveNote() {
        this.$emit("add-note", this.note);
        this.note = ''; // Clear input after saving
      }
    }
  };
  </script>
  
  <style scoped>
  .textarea-field {
    width: 100%;
    padding: 8px;
    border: 2px solid #4caf50;
    border-radius: 8px;
    min-height: 80px;
    resize: none;
  }
  .btn-primary {
    padding: 8px 12px;
    background-color: #4caf50;
    color: white;
    font-weight: bold;
    border-radius: 5px;
  }
  </style>
  