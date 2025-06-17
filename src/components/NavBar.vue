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
          學習本
        </button>
      </router-link>
      <router-link to="/exam">
        <button
          type="button"
          class="btn btn-outline-secondary"
        >
          考試去
        </button>
      </router-link>
    </div>
  </nav>
</template>


<script>
export default {
  name: 'NavBar',
  props: {
    uniqueCategories: {
      type: Array,
      required: true
    }
  }
}
</script>
