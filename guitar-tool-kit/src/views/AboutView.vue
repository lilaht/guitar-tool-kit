<script setup lang="ts">
  import TheFretboard from '@/components/TheFretboard.vue';
  const openReadmeInEditor = () => fetch('/__open-in-editor?file=README.md')
  </script>
  

<template>
  <div class="about">
    <h1>This is an about page</h1>
    <TheFretboard />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
