<template>
  <div class="aCard">
    <div class="card border-dark mb-3">
      <h5 class="card-header">
        {{ jsonData.CommonName }}
      </h5>
      <div class="card-body">
        <h5 class="card-title">
          {{ jsonData.English }}
        </h5>
        <p
          v-if="skinTypeArray.length"
          class="mt-2"
        >
          <span
            v-for="(skin, index) in skinTypeArray"
            :key="index"
            :class="['badge me-2', getSkinTypeBadgeClass(skin)]"
          >
            🧴 {{ skin }}
          </span>
        </p>

        <p class="card-text">
          學名：{{ jsonData.LatinName }}<br>
          科屬：{{ jsonData.Family }}<br>
          取用部位：{{ jsonData.ExtractionPart }}<br>
          萃取方式：{{ jsonData.ExtractionMethod }}<br>
        </p>
        <p>備注：{{ jsonData.note || '無' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BCard',
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  computed: {
  skinTypeArray() {
    const raw = this.jsonData.SuitableSkinType;
    if (!raw) return [];

    // 處理「、」分隔與逗號混合情況
    return raw
      .split(/[,、]/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }
},
methods: {
  getSkinTypeBadgeClass(skin) {
    switch (skin) {
      case '油性肌':
        return 'bg-warning text-dark';
      case '乾性肌':
        return 'bg-info text-dark';
      case '敏感肌':
        return 'bg-danger';
      case '混合肌':
        return 'bg-primary';
      case '一般肌':
        return 'bg-secondary';
      case '熟齡肌':
        return 'bg-primary text-white';
      case '各式肌膚':
        return 'bg-success';
      default:
        return 'bg-light text-dark';
    }
  }
}

};
</script>

<style scoped>
.badge {
  border-radius: 12px;
  font-weight: 600;
  padding: 0.35em 0.7em;
  font-size: 0.9rem;
}
</style>
