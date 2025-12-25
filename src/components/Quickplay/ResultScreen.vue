<template>
  <div class="flex flex-col items-center p-6 bg-amber-50 min-h-screen">
    <h2 class="text-2xl font-bold mb-4">
      🌸 挑戰完成！
    </h2>
    <p class="mb-6 text-lg">
      你答對了 {{ score }} / {{ total }} 題
    </p>

    <!-- 根據答對題數顯示訊息 -->
    <div class="mb-6 text-center">
      <p
        v-if="score >= 3"
        class="text-green-600 font-semibold text-lg"
      >
        🎉 恭喜你得到小禮物！
      </p>
      <p
        v-else
        class="fs-1 fw-bold"
      >
        🎉 感謝參加，恭喜獲得精油小知識！
      </p>
      <p
        v-if="score < 3"
        class="fs-3 fw-bold underline"
      >
        折價券連結：<a href="https://lin.ee/Or1CxEI">優惠券連結</a>
      </p>
    </div>

    <!-- 小知識回顧卡片 -->
    <div class="w-full max-w-md grid gap-4">
      <div
        v-for="(r, i) in results"
        :key="i"
        class="bg-white rounded-xl shadow-md p-4 border border-gray-200 mb-3"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-semibold">題 {{ i + 1 }}</span>
          <span class="text-sm">
            {{ r.correct ? "✅ 正確" : "❌ 錯誤" }}
          </span>
        </div>

        <p class="text-gray-800 mb-1">
          <span class="font-semibold">正確答案：</span>{{ r.answer }}
        </p>
        <p class="text-gray-600 italic text-sm">
          {{ r.info }}
        </p>
      </div>
    </div>

    <p
      v-if="alreadyPlayed"
      class="text-gray-500 mt-2 text-sm"
    >
      ⚠️ 感謝你的參與！
    </p>

    <!-- 再玩一次按鈕 -->
    <button
      class="btn btn-warning mt-3 mb-3"
      :disabled="alreadyPlayed"
      @click="$emit('restart')"
    >
      ⬇️歡迎加入我的社群好友⬇️
    </button>


    <div class="social-section">
      <div class="social-item">
        <div class="social-img-wrap">
          <img
            src="../../assets/lineScan.png"
            alt="LINE QR Code"
            class="social-img"
          >
        </div>
        <p class="social-text">
          <a
            href="https://lin.ee/2FB4xWu"
            target="_blank"
          >
            想了解更多精油資訊嗎？歡迎加入我們的官方 LINE！
          </a>
        </p>
      </div>

      <div class="social-item">
        <div class="social-img-wrap">
          <img
            src="../../assets/insScan.jpg"
            alt="Instagram QR Code"
            class="social-img"
          >
        </div>
        <p class="social-text">
          <a
            href="https://www.instagram.com/p/CkwtfqhPOeD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
            target="_blank"
          >
            加入我的 Instagram，不定期有精油小知識告訴大家唷 💧
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  score: Number,
  total: Number,
  results: Array,
});

const alreadyPlayed = ref(false)

// 進入頁面時檢查 localStorage
onMounted(() => {
  const played = localStorage.getItem('aromaGamePlayed')
  if (played) {
    alreadyPlayed.value = true
  } else {
    localStorage.setItem('aromaGamePlayed', 'true')
  }
})
</script>

<style scoped>.social-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
}

.social-item {
  display: flex;
  align-items: center;
  background: #fdfdfd;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease;
}

.social-item:hover {
  transform: translateY(-3px);
}

.social-img-wrap {
  flex-shrink: 0;
  width: 160px; /* ← 圖片變大 */
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 12px;
  margin-right: 20px;
}

.social-img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 保持比例顯示完整 */
}

.social-text a {
  color: #333;
  text-decoration: none;
  font-size: 17px;
  line-height: 1.6;
  font-weight: 500;
}

.social-text a:hover {
  color: #2e8b57;
  text-decoration: underline;
}

/* 📱 響應式 - 手機改成上下排列 */
@media (max-width: 600px) {
  .social-item {
    flex-direction: column;
    text-align: center;
  }

  .social-img-wrap {
    width: 200px;
    height: 200px;
    margin: 0 0 12px 0;
  }

  .social-text a {
    font-size: 16px;
  }
}
  </style>