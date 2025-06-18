<template>
  <div id="app">
    <div class="page-wrapper">
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
    <FooterSide />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import FooterSide from './components/FooterSide.vue'

export default {
  name: 'App',
  components: {
    NavBar,
    FooterSide
  }
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  margin: 0;
  padding: 0;
  height: 100%;
  background: linear-gradient(#f8fdfc, #ffffff);
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

/* 標題 */
h1 {
  font-family: 'Satisfy', cursive;
  font-size: 2.5rem;
  color: #37504d;
  margin-bottom: 20px;
}


.page-wrapper {
  flex: 1;
}
</style>
