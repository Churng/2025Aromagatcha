<template>
  <div class="min-h-screen flex items-center justify-center bg-amber-50 text-gray-800">
    <StartScreen
      v-if="stage === 'start'"
      @start="startGame"
    />

    <QuizScreen
      v-if="stage === 'quiz'"
      :quiz-data="shuffledQuestions"
      :time-left="timeLeft"
      @finish="finishGame"
    />

    <ResultScreen
      v-if="stage === 'result'"
      :score="score"
      :total="quizData.length"
      :results="results"
      @restart="restartGame"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import StartScreen from "../components/Quickplay/StartScreen.vue";
import QuizScreen from "../components/Quickplay/QuizScreen.vue";
import ResultScreen from "../components/Quickplay/ResultScreen.vue";
import quizData from "../JSON/Quizdata.json";

const stage = ref("start");
const timeLeft = ref(180);
const score = ref(0);
const results = ref([]);
const shuffledQuestions = ref([]);

function startGame() {
  stage.value = "quiz";
  timeLeft.value = 180;
  score.value = 0;
  results.value = [];

  // 隨機題目
  shuffledQuestions.value = [...quizData].sort(() => Math.random() - 0.5);

  const timer = setInterval(() => {
    timeLeft.value--;
    if (timeLeft.value <= 0) {
      clearInterval(timer);
      finishGame(results.value);
    }
  }, 1000);
}

function finishGame(resultArray) {
  // ✅ 關鍵：確保這裡接到 QuizScreen emit 出來的 resultArray
  results.value = resultArray;

  // ✅ 這樣 ResultScreen 才拿得到 info、answer
  console.log("收到結果：", resultArray); // ← 你可以用這行測試

  score.value = resultArray.filter((r) => r.correct).length;
  stage.value = "result";
}

function restartGame() {
  stage.value = "start";
}
</script>
