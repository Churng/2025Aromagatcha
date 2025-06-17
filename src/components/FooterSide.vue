<template>
  <footer class="footer-container">
    <img
      src="@/assets/footerlogo.png"
      alt="Footer Logo"
      class="footer-logo"
    >
  </footer>
</template>

<script>
export default {
  name: 'FooterSide'
};
</script>

<style scoped>
.footer-container {
  width: 100%;
  padding: 20px 0;
  background-color: #f5f5f5;
  text-align: center;
  position: relative;
}

.footer-logo {
  max-width: 150px;
  height: auto;
}
</style>
