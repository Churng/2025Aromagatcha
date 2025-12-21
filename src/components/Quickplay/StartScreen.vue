<template>
  <div class="text-center">
    <p class="fs-1 font-bold mb-4">
      🌿 香氣記憶挑戰
    </p>
    <p class="mb-6">
      準備好挑戰你的嗅覺記憶了嗎？限時 3 分鐘！
    </p>
    <button
      class="btn btn-outline-secondary"
      @click="$emit('start')"
    >
      開始遊戲
    </button>
  </div>
</template>
