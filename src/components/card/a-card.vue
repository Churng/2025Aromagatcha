<template>
  <div class="aCard">
    <div class="card  mb-3">
      <h5 class="card-header">
        {{ jsonData.name }}
      </h5>
      <div class="card-body">
        <h5 class="card-title">
          {{ jsonData.english }}
        </h5>
        <p class="card-text">
          學名：{{ jsonData.scientificName }}
          <br>
          科屬：{{ jsonData.family }}
          <br>
          取用部位：{{ jsonData.part }}
          <br>
          萃取方式：{{ jsonData.pattern }}
          <br>
          化學屬性：{{ jsonData.chemicalProperties }}
        </p>
        <p>備注：{{ jsonData.note }}</p>
        <!-- <a
          href="#"
          class="btn btn-primary"
        >Go somewhere</a> -->
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ACard',
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  }
}
</script>