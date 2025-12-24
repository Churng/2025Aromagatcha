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

    <!-- 再玩一次按鈕 -->
    <button
      class="btn btn-warning mt-3 mb-3"
      :disabled="alreadyPlayed"
      @click="$emit('restart')"
    >
      再玩一次
    </button>

    <p
      v-if="alreadyPlayed"
      class="text-gray-500 mt-2 text-sm"
    >
      ⚠️ 已經玩過囉，感謝你的參與！
    </p>

    <div class="">
      <p><a href="https://lin.ee/2FB4xWu">想了解更多精油資訊嗎？歡迎加入我們的官方LINE！</a></p>
      <p><a href="https://www.instagram.com/p/CkwtfqhPOeD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==">加入我的Instagram 不定期有精油小知識告訴大家唷</a></p>
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
// onMounted(() => {
//   const played = localStorage.getItem('aromaGamePlayed')
//   if (played) {
//     alreadyPlayed.value = true
//   } else {
//     localStorage.setItem('aromaGamePlayed', 'true')
//   }
// })
</script>
