<template>
  <div class="spelling-quiz p-4">
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

    <div v-else-if="!quizEnded">
      <div class="text-end text-muted mb-2">
        ⏳ 剩下時間：{{ remainingTime }} 秒
      </div>

      <h4 class="mb-3">
        {{ isFillInTheBlank ? '填空題｜' : '拼寫題｜' }}
        請輸入「{{ currentQuestion.prompt }}」的 {{ currentQuestion.fieldLabel }}
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
        <p class="text-muted">
          這題你目前已經錯了 {{ errorCount[currentQuestion.answer] || 0 }} 次
        </p>
        <button
          class="btn btn-secondary mt-2"
          @click="nextQuestion"
        >
          下一題
        </button>
      </div>
    </div>

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
              </h5>
              <p class="card-text mb-1">
                你的回答：<span class="text-danger fw-bold">{{ q.userInput }}</span>
              </p>
              <p class="card-text mb-1">
                正確答案：<span class="text-success">{{ q.answer }}</span>
              </p>
              <p class="text-muted">
                錯誤次數：{{ errorCount[q.answer] || 1 }} 次
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
          太厲害了！你沒有答錯任何一題 🎉
        </p>
      </div>

      <div class="text-center mt-4">
        <button
          class="btn btn-primary"
          @click="startQuiz"
        >
          重新練習
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
      remainingTime: 180, // 秒數（例如 3 分鐘）,
      wrongQuestions: []
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    startQuiz() {
      this.normalizedData = this.shuffleArray(this.normalizeData(jsonData));
      this.quizStarted = true;
      this.quizEnded = false;
      this.remainingTime = 180;
      this.errorCount = {};
      this.nextQuestion();
      this.startCountdown();
    },
    restartQuiz() {
      this.quizStarted = false;
      this.quizEnded = false;
      this.userInput = '';
      this.currentQuestion = {};
      clearInterval(this.timer);
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
    endQuiz() {
      clearInterval(this.timer);
      this.quizEnded = true;
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
        blankText = answer
          .split('')
          .map((char, i) => (i >= start && i < end ? '_' : char))
          .join('');
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
      const correct = this.currentQuestion.answer.trim().toLowerCase();
      const userAns = this.userInput.trim().toLowerCase();

      this.isCorrect = userAns === correct;

     if (!this.isCorrect) {
  const ans = this.currentQuestion.answer;
  this.errorCount[ans] = (this.errorCount[ans] || 0) + 1;

  this.wrongQuestions.push({
    ...this.currentQuestion,
    userInput: this.userInput
  });
}
      
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
    shuffleArray(array) {
      return [...array].sort(() => Math.random() - 0.5);
    }
  }
};
</script>

<style scoped>
.spelling-quiz {
  max-width: 600px;
  margin: 0 auto;
}
</style>
