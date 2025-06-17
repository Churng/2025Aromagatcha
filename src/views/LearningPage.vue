<template>
  <div>
    <button
      id="dropdownMenuButton1"
      class="btn btn-secondary dropdown-toggle mt-3"
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
