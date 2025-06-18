<template>
  <div class="px-5">
    <div class="d-flex justify-content-center align-items-center gap-2 mt-3">
      <!-- 篩選按鈕 -->
      <div class="dropdown">
        <button
          id="dropdownMenuButton1"
          class="btn btn-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          依照科屬篩選
        </button>

        <ul
          class="dropdown-menu"
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click="filterData('')"
            >All</a>
          </li>
          <li
            v-for="category in uniqueCategories"
            :key="category"
          >
            <a
              class="dropdown-item"
              href="#"
              @click="filterData(category)"
            >
              {{ category }}
            </a>
          </li>
        </ul>
      </div>

      <!-- 考試去按鈕 -->
      <router-link to="/exam">
        <button
          type="button"
          class="btn btn-outline-secondary"
        >
          10題牛刀小試去
        </button>
      </router-link>

      <!-- 考試去按鈕 -->
      <router-link to="/examQ1">
        <button
          type="button"
          class="btn btn-outline-secondary"
        >
          3分鐘默寫考試去
        </button>
      </router-link>
    </div>


    <div class="container text-center mt-5">
      <div class="row align-items-start">
        <div
          v-for="(data, index) in filteredData"
          :key="index"
          class="col-12 col-md-4 mb-4"
        >
          <acard :json-data="data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Acard from '../components/card/a-card.vue';
import jsonData from '../JSON/V.json'

export default {
  components: { Acard },
  data() {
    return {
      jsonData,
      currentCategory: '',
    };
  },
  computed: {
    uniqueCategories() {
      // Extract unique categories from jsonData
      const categories = this.jsonData.map(item => item.family); // Adjust 'family' if category property is different
      return [...new Set(categories)]; // Ensures unique values
    },
    filteredData() {
      if (this.currentCategory) {
        return this.jsonData.filter(item => item.family === this.currentCategory); // Adjust 'family' if needed
      }
      return this.jsonData;
    },
  },
  methods: {
    filterData(category) {
      this.currentCategory = category;
    },
  },
};
</script>
