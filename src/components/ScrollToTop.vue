<template>
  <button
    v-show="showButton"
    class="go-to-top"
    aria-label="Go to top"
    @click="scrollToTop"
  >
    ⬆
  </button>
</template>

<script>
export default {
  data() {
    return {
      showButton: false,
    };
  },
  mounted() {
    window.addEventListener("scroll", this.checkScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.checkScroll);
  },
  methods: {
    checkScroll() {
      this.showButton = window.scrollY > 100;
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
.go-to-top {
  position: fixed;
  bottom: 30px;
  right: 20px;
  width: 50px;
  height: 50px;
  background-color: #37504d;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  z-index: 999;
  transition: opacity 0.3s ease;
}

@media (max-width: 768px) {
  .go-to-top {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
    bottom: 20px;
    right: 15px;
  }
}
</style>
