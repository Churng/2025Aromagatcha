<template>
  <div class="aCard">
    <div class="card mb-3">
      <h5 class="card-header">
        {{ jsonData.name }}
      </h5>
      <div class="card-body">
        <h5 class="card-title">
          {{ jsonData.english }}
        </h5>
        <p class="card-text">
          學名：{{ jsonData.scientificName }}<br>
          科屬：{{ jsonData.family }}<br>
          取用部位：{{ jsonData.part }}<br>
          萃取方式：{{ jsonData.pattern }}<br>
          化學屬性：{{ jsonData.chemicalProperties }}
        </p>
        <p>備注：{{ jsonData.note || '無' }}</p>

        <p
          v-if="allToxicities.length"
          class="mt-3"
        >
          <span
            v-for="(tox, idx) in allToxicities"
            :key="idx"
            :class="['badge me-2', tox.class]"
            style="font-size: 0.9rem;"
          >
            {{ tox.emoji }} {{ tox.label }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ACard',
  props: {
    jsonData: {
      type: Object,
      required: true
    }
  },
  computed: {
    allToxicities() {
      const badges = [];

      // 毒性字串欄位（非空顯示）
      if (this.jsonData.toxicity && this.jsonData.toxicity.trim() !== '') {
        badges.push(this.getBadgeInfo(this.jsonData.toxicity));
      }

      // 布林值對應標籤
      const boolMap = [
    { key: 'skinIrritation', label: '皮膚刺激', emoji: '🩹', class: 'bg-danger' },  // 新增這行
    { key: 'mucousIrritation', label: '粘膜刺激', emoji: '👄', class: 'bg-danger' },
    { key: 'contactSensitivity', label: '接觸性敏感反應', emoji: '✋', class: 'bg-danger' },
    { key: 'crossSensitivity', label: '交叉敏感反應', emoji: '🔄', class: 'bg-danger' },
    { key: 'epilepsy', label: '癲癇', emoji: '⚡', class: 'bg-warning text-dark' },
    { key: 'highBloodPressure', label: '高血壓', emoji: '❤️‍🔥', class: 'bg-warning text-dark' },
    { key: 'lowBloodPressure', label: '低血壓', emoji: '💔', class: 'bg-warning text-dark' },
    { key: 'homeopathyAvoid', label: '順勢療法應避免', emoji: '🚫', class: 'bg-secondary' },
    { key: 'ifaSkinBan', label: 'IFA禁用於皮膚', emoji: '❌', class: 'bg-dark text-white' },
    { key: 'ifaAromatherapyBan', label: 'IFA規定不可芳療用', emoji: '🚫', class: 'bg-dark text-white' },
  ];

      boolMap.forEach(item => {
        if (this.jsonData[item.key]) {
          badges.push({
            label: item.label,
            emoji: item.emoji,
            class: item.class
          });
        }
      });

      return badges;
    }
  },
  methods: {
    getBadgeInfo(toxType) {
      const map = {
        '光敏性': { class: 'bg-warning text-dark', emoji: '☀️', label: '光敏性' },
        '神經毒性': { class: 'bg-danger', emoji: '🧠', label: '神經毒性' },
        '腎毒性': { class: 'bg-primary', emoji: '💧', label: '腎毒性' }
      };
      return map[toxType] || { class: 'bg-secondary', emoji: '⚠️', label: toxType };
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
