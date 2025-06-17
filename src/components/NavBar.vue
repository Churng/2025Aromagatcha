<template>
  <nav
    class="navbar p-3 mb-3"
    style="background-color: #e3f2fd;"
  >
    <div class="d-flex gap-2">
      <router-link to="/learn">
        <button
          type="button"
          class="btn btn-warning"
        >
          70隻精油學習本
        </button>
      </router-link>
      <router-link to="/learnOil">
        <button
          type="button"
          class="btn btn-warning"
        >
          30隻植物油學習本
        </button>
      </router-link>
    </div>
  </nav>
</template>


<script>
export default {
  name: 'NavBar',
  props: {
    
  }
}
</script>
