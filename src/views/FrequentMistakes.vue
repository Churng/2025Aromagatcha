<template>
  <div class="frequent-mistakes p-4">
    <h2 class="mb-4 text-center">
      錯題超過3次的題目
    </h2>

    <div
      v-if="frequentMistakes.length"
      class="row"
    >
      <div
        v-for="(q, idx) in frequentMistakes"
        :key="idx"
        class="col-12 mb-3"
      >
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title">
              題目：{{ q.prompt }}（{{ q.fieldLabel }}｜{{ q.isFill ? '填空' : '拼寫' }}）
              <span class="badge bg-danger ms-2">超難</span>
            </h5>
            <p class="card-text mb-1">
              你的最後回答：<span class="text-danger fw-bold">{{ q.userInput }}</span>
            </p>
            <p class="card-text mb-1">
              正確答案：<span class="text-success">{{ q.answer }}</span>
            </p>
            <p class="text-muted">
              錯誤次數：{{ errorCount[q.answer]?.count || 1 }} 次
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center"
    >
      <p class="text-success fs-4">
        恭喜！目前沒有錯超過3次的題目 🎉
      </p>
    </div>

    <div class="text-center mt-4">
      <button
        class="btn btn-primary"
        @click="goBack"
      >
        返回上一頁
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wrongQuestions: [],
      errorCount: {},
      frequentMistakes: []
    };
  },
  created() {
    this.loadDataFromLocalStorage();
    this.filterFrequentMistakes();
  },
  methods: {
    loadDataFromLocalStorage() {
      const wrong = localStorage.getItem('wrongQuestions');
      const count = localStorage.getItem('errorCount');
      this.wrongQuestions = wrong ? JSON.parse(wrong) : [];
      this.errorCount = count ? JSON.parse(count) : {};
    },
    filterFrequentMistakes() {
      this.frequentMistakes = this.wrongQuestions.filter(
        q => this.errorCount[q.answer]?.count >= 3
      );
    },
    goBack() {
      this.$router.push('/learn'); // 根據您的應用路由設置調整路徑
    }
  }
};
</script>

<style scoped>
.frequent-mistakes {
  max-width: 600px;
  margin: 0 auto;
}

/* Bootstrap 徽章樣式 */
.badge {
  vertical-align: middle;
  font-size: 0.8em;
}
</style>