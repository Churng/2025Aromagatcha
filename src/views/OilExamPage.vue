<template>
  <div class="flashcard-quiz p-3">
    <!-- 開始按鈕 -->
    <div
      v-if="!quizStarted"
      class="text-center"
    >
      <h2>配對學習閃卡</h2>
      <button
        class="btn btn-primary mt-3"
        @click="startQuiz"
      >
        開始測驗
      </button>
    </div>

    <!-- 測驗中 -->
    <div v-else-if="quizInProgress">
      <div class="d-flex justify-content-between mb-2 align-items-center">
        <div>題目 {{ currentQuestionIndex + 1 }} / {{ questions.length }}</div>
        <div>剩餘時間: {{ timeLeft }}s</div>
      </div>
      <div
        class="progress mb-3"
        style="height: 20px;"
      >
        <div
          class="progress-bar"
          role="progressbar"
          :style="{ width: (timeLeft / totalTimePerQuestion * 100) + '%' }"
          :class="{'bg-danger': timeLeft <= totalTimePerQuestion * 0.3}"
        >
          {{ Math.ceil((timeLeft / totalTimePerQuestion) * 100) }}%
        </div>
      </div>

      <div class="card mb-3">
        <div class="card-body">
          <p class="card-text">
            <strong>{{ questions[currentQuestionIndex].promptLabel }}</strong>
          </p>
          <h4 class="card-title">
            {{ questions[currentQuestionIndex].prompt }}
          </h4>
        </div>
      </div>

      <div class="list-group mb-3">
        <button
          v-for="(choice, idx) in questions[currentQuestionIndex].choices"
          :key="idx"
          type="button"
          class="list-group-item list-group-item-action"
          :class="{
            'list-group-item-success': answered && choice === questions[currentQuestionIndex].correctAnswer,
            'list-group-item-danger': answered && choice === selectedChoice && choice !== questions[currentQuestionIndex].correctAnswer
          }"
          :disabled="answered"
          @click="selectChoice(choice)"
        >
          {{ choice }}
        </button>
      </div>
    </div>

    <!-- 測驗結果 -->
    <div
      v-else
      class="text-center"
    >
      <h2>測驗完成！</h2>
      <p>答對 {{ correctCount }} / {{ questions.length }} 題</p>
      <button
        class="btn btn-primary"
        @click="restartQuiz"
      >
        重新開始
      </button>
      <div class="mt-4 text-start">
        <h4>詳細結果：</h4>
        <ul class="list-group">
          <li
            v-for="(res, idx) in userAnswers"
            :key="idx"
            class="list-group-item"
          >
            題目 {{ idx + 1 }}:
            <strong>{{ res.promptLabel }}: {{ res.prompt }}</strong><br>
            你的回答: {{ res.selected }}
            <span
              v-if="res.correct"
              class="text-success"
            >✔️ 正確</span>
            <span
              v-else
              class="text-danger"
            >❌ 錯誤，正確答案: {{ res.correctAnswer }}</span>
            ，花費時間: {{ res.timeUsed }}s
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import rawJsonData from '@/JSON/O.json';

export default {
  name: 'FlashcardQuiz',
  data() {
    return {
      jsonData: this.normalizeData(rawJsonData),
      quizStarted: false,
      quizInProgress: false,
      questions: [],
      currentQuestionIndex: 0,
      totalTimePerQuestion: 30,
      timeLeft: 0,
      timerId: null,
      answered: false,
      selectedChoice: null,
      userAnswers: [],
    };
  },
  computed: {
    correctCount() {
      return this.userAnswers.filter((item) => item.correct).length;
    },
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    normalizeData(dataArray) {
      // 資料簡單處理，trim跟換行可自行調整
      return dataArray.map((item) => {
        const norm = {};
        [
          'English',
          'LatinName',
          'CommonName',
          'ExtractionMethod',
          'ExtractionPart',
          'TherapeuticProperties',
          'SuitableSkinType',
          'Family',
        ].forEach((key) => {
          let val = item[key];
          if (typeof val === 'string') {
            norm[key] = val.split('\n').map((v) => v.trim()).filter(Boolean).join('，');
          } else {
            norm[key] = val || '';
          }
        });
        return norm;
      });
    },

    startQuiz() {
      const shuffled = this.shuffleArray(this.jsonData.slice());
      const selectedItems = shuffled.slice(0, Math.min(10, shuffled.length));
      this.questions = selectedItems
        .map((item) => this.generateQuestion(item))
        .filter((q) => q !== null);

      if (this.questions.length === 0) {
        alert('題庫資料不足，無法生成題目');
        return;
      }
      this.quizStarted = true;
      this.quizInProgress = true;
      this.currentQuestionIndex = 0;
      this.userAnswers = [];
      this.startTimer();
    },

    restartQuiz() {
      this.quizStarted = false;
      this.quizInProgress = false;
      this.questions = [];
      this.currentQuestionIndex = 0;
      this.userAnswers = [];
      this.clearTimer();
      this.answered = false;
      this.selectedChoice = null;
    },

    shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },

    generateQuestion(item) {
    // 顯示題目用的中文欄位對應
    const ruleMap = {
        '中文俗名': ['英文俗名', '拉丁學名', '萃取方式', '萃取部位', '療效特性', '適合肌膚', '植物科屬'],
        '英文俗名': ['中文俗名', '拉丁學名', '植物科屬'],
        '拉丁學名': ['中文俗名', '英文俗名'],
        '療效特性': ['中文俗名'],
        '萃取方式': ['中文俗名'],
        '萃取部位': ['中文俗名'],
        '適合肌膚': ['中文俗名'],
        '植物科屬': ['中文俗名'],
    };

    // 將中文欄位對應到實際 JSON 的欄位 key
    const fieldMap = {
        '中文俗名': 'CommonName',
        '英文俗名': 'English',
        '拉丁學名': 'LatinName',
        '萃取方式': 'ExtractionMethod',
        '萃取部位': 'ExtractionPart',
        '療效特性': 'TherapeuticProperties',
        '適合肌膚': 'SuitableSkinType',
        '植物科屬': 'Family',
    };

    // 隨機選擇題目欄位與答案欄位（中文）
    const promptLabel = this.shuffleArray(Object.keys(ruleMap))[0];
    const answerLabel = this.shuffleArray(ruleMap[promptLabel])[0];

    // 找到對應的 JSON 欄位 key
    const promptField = fieldMap[promptLabel];
    const answerField = fieldMap[answerLabel];

    const promptValue = item[promptField];
    const correctAnswer = item[answerField];

    if (!promptValue || !correctAnswer) return null;

    // 建立干擾選項集
    const distractorSet = new Set(
        this.jsonData
        .filter((x) => x !== item && x[answerField])
        .map((x) => x[answerField])
    );

    distractorSet.delete(correctAnswer);

    const distractorList = Array.from(distractorSet);
    if (distractorList.length < 2) return null;

    const distractors = this.shuffleArray(distractorList).slice(0, 2);

    // 選項包含正確答案與兩個干擾項目
    const choices = this.shuffleArray([correctAnswer, ...distractors]);

    return {
        prompt: promptValue,
        promptLabel: `請問以下哪一個是「${promptLabel}」對應的「${answerLabel}」？`,
        choices,
        correctAnswer,
        promptField,
        answerField,
    };
    },


    startTimer() {
      this.clearTimer();
      this.timeLeft = this.totalTimePerQuestion;
      this.answered = false;
      this.selectedChoice = null;
      this.timerId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          this.recordAnswer(null, true);
        }
      }, 1000);
    },

    clearTimer() {
      if (this.timerId) {
        clearInterval(this.timerId);
        this.timerId = null;
      }
    },

    selectChoice(choice) {
      if (this.answered) return;
      this.clearTimer();
      this.recordAnswer(choice, false);
    },

    recordAnswer(choice, timeUp) {
      this.answered = true;
      this.selectedChoice = choice;
      const q = this.questions[this.currentQuestionIndex];
      const correct = !timeUp && choice === q.correctAnswer;
      const timeUsed = timeUp ? this.totalTimePerQuestion : this.totalTimePerQuestion - this.timeLeft;
      this.userAnswers.push({
        promptLabel: q.promptLabel,
        prompt: q.prompt,
        selected: choice === null ? '（未作答）' : choice,
        correct,
        correctAnswer: q.correctAnswer,
        timeUsed,
      });
      setTimeout(() => {
        this.goToNextQuestion();
      }, 1000);
    },

    goToNextQuestion() {
      this.clearTimer();
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.startTimer();
      } else {
        this.quizInProgress = false;
      }
    },
  },
};
</script>

<style scoped>
.flashcard-quiz {
  max-width: 600px;
  margin: 0 auto;
}

.list-group-item-success,
.list-group-item-danger {
  position: relative;
  z-index: 2;
  border: none;
}

.list-group-item {
  margin-bottom: 8px;
  border-radius: 8px;
  border: 0.5px solid #ccc;
  transition: all 0.2s ease-in-out;
}

.list-group-item-success {
  box-shadow: 0 0 0 2px #28a745;
  background-color: #d4edda !important;
  font-weight: bold;
}

.list-group-item-danger {
  box-shadow: 0 0 0 2px #dc3545;
  background-color: #f8d7da !important;
  font-weight: bold;
}

.list-group-item:hover:not(:disabled) {
  background-color: #f0f0f0;
  cursor: pointer;
}
</style>
