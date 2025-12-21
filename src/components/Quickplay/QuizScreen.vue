<template>
  <div class="max-w-md w-full p-6 bg-white rounded-2xl shadow-md">
    <div class="flex justify-between mb-4">
      <span>⏱️ 請把握時間喔～</span>
      <span>⏱️ {{ formatTime(timeLeft) }}</span>
      <!-- <span>{{ currentIndex + 1 }} / {{ quizData.length }}</span> -->
    </div>

    <h2 class="text-lg font-semibold mb-4">
      {{ currentQuestion.question }}
    </h2>
    <p class="mb-2 text-sm text-gray-500">
      （請嗅吸第 {{ currentQuestion.bottleNumber }} 號瓶）
    </p>

    <div>
      <button
        v-for="(option, i) in currentQuestion.options"
        :key="i"
        class="block btn w-full text-left border border-gray-300 rounded-lg p-2 mb-2 hover:bg-green-100 mx-2"
        :class="{
          'bg-green-200': answered && option === currentQuestion.answer,
          'bg-red-200': answered && option === selected && option !== currentQuestion.answer,
        }"
        :disabled="answered"
        @click="selectAnswer(option)"
      >
        {{ option }}
      </button>
    </div>

    <div
      v-if="answered"
      class="mt-4"
    >
      <p class="text-sm text-gray-700 mb-2">
        {{ currentQuestion.info }}
      </p>
      <button
        class="btn btn-outline-secondary "
        @click="nextQuestion"
      >
        下一題
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  quizData: Array,
  timeLeft: Number,
});
const emit = defineEmits(["finish"]);

const currentIndex = ref(0);
const selected = ref(null);
const answered = ref(false);
const resultArray = ref([]);

const currentQuestion = computed(() => props.quizData[currentIndex.value]);

function selectAnswer(option) {
  selected.value = option;
  answered.value = true;

  resultArray.value.push({
    id: currentQuestion.value.id,
    correct: option === currentQuestion.value.answer,
    answer: currentQuestion.value.answer, // ✅ 存正確答案
    info: currentQuestion.value.info,   
  });
}

function nextQuestion() {
  answered.value = false;
  selected.value = null;

  if (currentIndex.value + 1 < props.quizData.length) {
    currentIndex.value++;
  } else {
    emit("finish", resultArray.value);
  }
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
</script>
