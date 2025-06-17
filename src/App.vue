<template>
  <div id="app">
    <router-link to="/">
      <img
        alt="Vue logo"
        src="./assets/logo.png"
        style="width: 150px; cursor: pointer;"
      >
    </router-link>
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
