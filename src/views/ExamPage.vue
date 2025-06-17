<template>
  <div class="flashcard-quiz p-3">
    <!-- 開始按鈕 -->
    <div
      v-if="!quizStarted"
      class="text-center"
    >
      <h2>閃卡學習測驗</h2>
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
import rawJsonData from '@/JSON/V.json'; // 確認路徑正確

export default {
  name: 'FlashcardQuiz',
  data() {
    return {
      jsonData: this.normalizeData(rawJsonData), // 正規化後的資料
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
      return this.userAnswers.filter(item => item.correct).length;
    }
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    // 1. 正規化資料：trim whitespace、去掉 newline，對可能多重 value 只保留第一行或做 join
    normalizeData(dataArray) {
      return dataArray.map(item => {
        const norm = {};
        // 處理每個關注欄位：取第一行並 trim
        ['name', 'scientificName', 'english', 'family', 'part', 'pattern', 'chemicalProperties'].forEach(key => {
          let val = item[key];
          if (typeof val === 'string') {
            // 拆行，只取第一行，再 trim
            const firstLine = val.split('\n')[0].trim();
            norm[key] = firstLine;
          } else {
            norm[key] = val;
          }
        });
        // 若要保留 note、disease，可在此加入
        norm.note = item.note || '';
        norm.disease = item.disease || '';
        return norm;
      });
    },
    startQuiz() {
      // 隨機 shuffle 且挑選前 10（若少於 10 筆，取全部）
      const shuffled = this.shuffleArray(this.jsonData.slice());
      const selectedItems = shuffled.slice(0, Math.min(10, shuffled.length));
      // 生成題目陣列
      this.questions = selectedItems.map(item => this.generateQuestion(item)).filter(q => q !== null);
      // 若有些題型因 distractors 不足而回傳 null，可得到少於 10 題
      // 若想一定要 10 題，可再做一次填補或重新呼叫 startQuiz()
      if (this.questions.length === 0) {
        alert('題庫或干擾選項不足，無法生成題目');
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
    // 2. 生成單題：可能回傳 null 表示此題無法生成（如干擾不足）
    generateQuestion(item) {
      // 定義題型：promptField, answerField, promptLabel
      const types = [
        { promptField: 'english', answerField: 'name', promptLabel: '以下哪一個是此英文名稱對應的中文？' },
        { promptField: 'name', answerField: 'english', promptLabel: '以下哪一個是此中文名稱對應的英文？' },
        { promptField: 'name', answerField: 'family', promptLabel: '以下哪一個是此中文名稱對應的科別？' },
        { promptField: 'name', answerField: 'scientificName', promptLabel: '以下哪一個是此中文名稱對應的學名？' },
        { promptField: 'name', answerField: 'part', promptLabel: '以下哪一個是此中文名稱常用的部位？' },
        { promptField: 'name', answerField: 'pattern', promptLabel: '以下哪一個是此中文名稱的外觀型態/萃取方式？' },
        // chemicalProperties 若過於集中，可以不加入，或改成是非題，這裡先不自動加入
      ];
      // 隨機題型
      const type = types[Math.floor(Math.random() * types.length)];
      // 正確答案
      const correctRaw = item[type.answerField];
      if (!correctRaw) return null; // 若沒有該欄位值，略過
      const correctAnswer = correctRaw;
      // 收集所有可能的 distractor 值 (去除與正確相同)
      const allOthers = this.jsonData.filter(x => x !== item);
      const distractorSet = new Set();
      for (let other of allOthers) {
        const rawVal = other[type.answerField];
        if (!rawVal) continue;
        const val = rawVal;
        if (val !== correctAnswer) {
          distractorSet.add(val);
        }
      }
      const distractorsArr = Array.from(distractorSet);
      // 如果 distractorsArr 長度 < 3，選擇少於 3 個干擾，但至少要 2 (共 3 選項) 或 1 (共 2 選項)，視需求
      let distractors = [];
      if (distractorsArr.length >= 3) {
        // 隨機抽 3
        const shuffledOthers = this.shuffleArray(distractorsArr.slice());
        distractors = shuffledOthers.slice(0, 3);
      } else if (distractorsArr.length >= 2) {
        const shuffledOthers = this.shuffleArray(distractorsArr.slice());
        distractors = shuffledOthers.slice(0, 2);
      } else {
        // 干擾太少，跳過此題
        return null;
      }
      // 組 choices 並 shuffle
      const choices = this.shuffleArray([correctAnswer, ...distractors]);
      // prompt
      const promptRaw = item[type.promptField];
      if (!promptRaw) return null;
      const prompt = promptRaw;
      return {
        prompt,
        promptLabel: type.promptLabel,
        choices,
        correctAnswer,
        promptField: type.promptField,
        answerField: type.answerField,
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
          // 時間到，自動記錄為未作答
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
      const correct = (!timeUp) && (choice === q.correctAnswer);
      const timeUsed = timeUp ? this.totalTimePerQuestion : (this.totalTimePerQuestion - this.timeLeft);
      this.userAnswers.push({
        promptLabel: q.promptLabel,
        prompt: q.prompt,
        selected: choice === null ? '（未作答）' : choice,
        correct: correct,
        correctAnswer: q.correctAnswer,
        timeUsed: timeUsed,
      });
      // 延遲一秒進下一題
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
    }
  }
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
