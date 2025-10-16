<template>
  <button class="vue-button" @click="handleClick">
    <span class="vue-badge">Vue</span>
    {{ label }}
    <span v-if="count > 0" class="click-count">{{ count }}</span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  label?: string;
  onClick?: (count: number) => void;
}>();

const count = ref(0);

const handleClick = () => {
  count.value++;
  if (props.onClick) {
    props.onClick(count.value);
  }
};
</script>

<style scoped>
.vue-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vue-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

.vue-button:active {
  transform: translateY(0);
}

.vue-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.click-count {
  background: #ff4757;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}
</style>

