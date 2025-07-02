<template>
  <div class="spelling-quiz p-4">
    <!-- 起始畫面 -->
    <div
      v-if="!quizStarted"
      class="text-center"
    >
      <h2>拼寫練習卡片</h2>
      <button
        class="btn btn-primary"
        @click="startQuiz"
      >
        開始練習
      </button>
    </div>

    <!-- 題目進行中 -->
    <div v-else-if="!quizEnded">
      <div class="text-end text-muted mb-2">
        ⏳ 剩下時間：{{ remainingTime }} 秒
      </div>
      <h4 class="mb-3">
        {{ isFillInTheBlank ? '填空題｜' : '拼寫題｜' }}請輸入「{{ currentQuestion.prompt }}」的 {{ currentQuestion.fieldLabel }}
        <span 
          v-if="errorCount[currentQuestion.answer]?.count >= 3"
          class="badge bg-danger ms-2"
        >
          super
        </span>
      </h4>

      <div v-if="isFillInTheBlank">
        <p class="fs-5">
          請補上空格處： <strong v-html="currentQuestion.blankText" />
        </p>
      </div>

      <input
        v-model="userInput"
        type="text"
        class="form-control mb-2"
        :disabled="answered"
        placeholder="輸入答案後按 Enter"
        @keyup.enter="checkAnswer"
      >

      <div v-if="answered">
        <p :class="{'text-success': isCorrect, 'text-danger': !isCorrect}">
          {{ isCorrect ? '✔️ 答對了！' : `❌ 答錯了，正確答案是：${currentQuestion.answer}` }}
        </p>
        <p
          v-if="!isCorrect"
          class="text-danger"
          v-html="diffHtml"
        />
        <p class="text-muted">
          這題你目前已經錯了 {{ errorCount[currentQuestion.answer]?.count || 0 }} 次
        </p>
        <button
          class="btn btn-secondary mt-2"
          @click="nextQuestion"
        >
          下一題
        </button>
      </div>
    </div>

    <!-- 結束畫面 -->
    <div v-else>
      <h2 class="mb-4 text-center">
        ⏰ 時間到囉！
      </h2>
      <h4 class="mb-3 text-center">
        以下是你答錯的題目
      </h4>

      <div
        v-if="wrongQuestions.length"
        class="row"
      >
        <div
          v-for="(q, idx) in wrongQuestions"
          :key="idx"
          class="col-12 mb-3"
        >
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">
                題目：{{ q.prompt }}（{{ q.fieldLabel }}｜{{ q.isFill ? '填空' : '拼寫' }}）
                <span 
                  v-if="errorCount[q.answer]?.count >= 3"
                  class="badge bg-danger ms-2"
                >
                  super
                </span>
              </h5>
              <p class="card-text mb-1">
                你的回答：<span class="text-danger fw-bold">{{ q.userInput }}</span>
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
        v-else-if="!recordsCleared"
        class="text-center"
      >
        <p class="text-success fs-4">
          太厲害了！你沒有答錯任何一題 🎉
        </p>
      </div>
      <div
        v-else
        class="text-center"
      >
        <p class="text-success fs-4">
          您的作答紀錄已消除
        </p>
      </div>

      <div class="text-center mt-4">
        <button
          class="btn btn-primary me-2"
          @click="startQuiz"
        >
          重新練習
        </button>
        <button
          class="btn btn-danger"
          @click="clearRecords"
        >
          清除紀錄
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import jsonData from '@/JSON/V.json';

export default {
  data() {
    return {
      quizStarted: false,
      quizEnded: false,
      currentQuestion: {},
      userInput: '',
      answered: false,
      isCorrect: false,
      normalizedData: [],
      errorCount: {},
      fields: [
        { key: 'english', label: '英文俗名' },
        { key: 'scientificName', label: '拉丁學名' }
      ],
      isFillInTheBlank: false,
      timer: null,
      remainingTime: 180,
      wrongQuestions: [],
      diffHtml: '',
      recordsCleared: false
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    startQuiz() {
      this.quizStarted = true;
      this.quizEnded = false;
      this.remainingTime = 180;
      this.userInput = '';
      this.answered = false;
      this.isCorrect = false;
      this.recordsCleared = false;
      this.loadWrongQuestionsFromLocalStorage();

      this.normalizedData = this.shuffleArray(this.normalizeData(jsonData));
      this.nextQuestion();
      this.startCountdown();
    },
    normalizeData(dataArray) {
      return dataArray.map(item => ({
        name: item.name || '',
        english: item.english || '',
        scientificName: item.scientificName || ''
      }));
    },
    generateQuestion() {
      const item = this.normalizedData[Math.floor(Math.random() * this.normalizedData.length)];
      const field = this.fields[Math.floor(Math.random() * this.fields.length)];
      const answer = item[field.key];

      const isFill = Math.random() < 0.5;
      let blankText = '';

      if (isFill) {
        const start = Math.floor(answer.length / 3);
        const end = Math.floor(answer.length * 2 / 3);
        blankText = answer.split('').map((char, i) => (i >= start && i < end ? '_' : char)).join('');
      }

      return {
        prompt: item.name,
        answer,
        fieldKey: field.key,
        fieldLabel: field.label,
        blankText,
        isFill
      };
    },
    checkAnswer() {
      this.answered = true;
      const correct = this.currentQuestion.answer.trim();
      const userAns = this.userInput.trim();

      this.isCorrect = userAns !== '' && userAns.toLowerCase() === correct.toLowerCase();

      if (!this.isCorrect) {
        const today = new Date().toISOString().split('T')[0];
        const ans = this.currentQuestion.answer;

        if (!this.errorCount[ans]) {
          this.errorCount[ans] = { count: 1, lastWrong: today };
        } else {
          this.errorCount[ans].count++;
          this.errorCount[ans].lastWrong = today;
        }

        this.wrongQuestions.push({ ...this.currentQuestion, userInput: this.userInput });

        this.diffHtml = this.generateDiffHTML(userAns, correct);

        this.saveWrongQuestionsToLocalStorage();
      } else {
        this.diffHtml = '';
      }
    },
    generateDiffHTML(user, correct) {
      if (!user) {
        return `錯字對照：<span class="wrong-letter">${'_'.repeat(correct.length)}</span>`;
      }

      const userChars = user.split('');
      const correctChars = correct.split('');
      let result = '錯字對照：';

      const maxLength = Math.max(userChars.length, correctChars.length);
      for (let i = 0; i < maxLength; i++) {
        const userChar = userChars[i] || '';
        const correctChar = correctChars[i] || '';

        if (userChar && userChar.toLowerCase() === correctChar.toLowerCase()) {
          result += userChar;
        } else {
          result += `<span class="wrong-letter">${userChar || ' '}</span>`;
        }
      }

      return result;
    },
    nextQuestion() {
      this.userInput = '';
      this.answered = false;
      this.isCorrect = false;
      if (!this.quizEnded) {
        const q = this.generateQuestion();
        this.currentQuestion = q;
        this.isFillInTheBlank = q.isFill;
      }
    },
    endQuiz() {
      clearInterval(this.timer);
      this.quizEnded = true;
    },
    startCountdown() {
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
        } else {
          this.endQuiz();
        }
      }, 1000);
    },
    shuffleArray(array) {
      return [...array].sort(() => Math.random() - 0.5);
    },
    saveWrongQuestionsToLocalStorage() {
      localStorage.setItem('wrongQuestions', JSON.stringify(this.wrongQuestions));
      localStorage.setItem('errorCount', JSON.stringify(this.errorCount));
    },
    loadWrongQuestionsFromLocalStorage() {
      const wrong = localStorage.getItem('wrongQuestions');
      const count = localStorage.getItem('errorCount');
      this.wrongQuestions = wrong ? JSON.parse(wrong) : [];
      this.errorCount = count ? JSON.parse(count) : {};
    },
    clearRecords() {
      this.wrongQuestions = [];
      this.errorCount = {};
      localStorage.removeItem('wrongQuestions');
      localStorage.removeItem('errorCount');
      this.recordsCleared = true;
    }
  }
};
</script>

<style scoped>
.spelling-quiz {
  max-width: 600px;
  margin: 0 auto;
}

/* 錯字紅色加粗 */
.wrong-letter {
  color: red;
  font-weight: bold;
  text-decoration: underline;
}

/* Bootstrap badge styling */
.badge {
  vertical-align: middle;
  font-size: 0.8em;
}
</style>