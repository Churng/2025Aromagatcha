<template>
  <div id="app">
    <a
      href="https://churng.github.io/2025Aromagatcha/"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img
        src="./assets/logo.png"
        alt="logo"
        style="width:150px; cursor:pointer;"
      >
    </a>
    <h1>Welcome to learn Aroma</h1>
    <NavBar />
    <router-view />
  </div>
</template>

<script>

import NavBar from './components/NavBar.vue'
export default {
  name: 'App',
  components: {
    NavBar
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
