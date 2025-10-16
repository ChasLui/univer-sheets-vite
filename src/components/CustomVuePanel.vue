<template>
  <div class="custom-vue-panel">
    <div class="panel-header">
      <h3>{{ title }}</h3>
      <button @click="handleClose" class="close-btn">✕</button>
    </div>
    <div class="panel-content">
      <div class="info-section">
        <p><strong>当前时间：</strong>{{ currentTime }}</p>
        <p><strong>计数器：</strong>{{ count }}</p>
      </div>
      
      <div class="control-section">
        <button @click="increment" class="action-btn">增加</button>
        <button @click="decrement" class="action-btn">减少</button>
        <button @click="reset" class="action-btn secondary">重置</button>
      </div>
      
      <div class="input-section">
        <input 
          v-model="inputValue" 
          type="text" 
          placeholder="输入一些内容..."
          class="custom-input"
        />
        <p v-if="inputValue" class="input-display">
          你输入了：<strong>{{ inputValue }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Props
const props = defineProps<{
  title?: string;
  initialCount?: number;
  onClose?: () => void;
}>();

// State
const count = ref(props.initialCount || 0);
const currentTime = ref('');
const inputValue = ref('');
let timer: number | undefined;

// Methods
const increment = () => {
  count.value++;
};

const decrement = () => {
  count.value--;
};

const reset = () => {
  count.value = 0;
  inputValue.value = '';
};

const handleClose = () => {
  if (props.onClose) {
    props.onClose();
  }
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('zh-CN');
};

// Lifecycle
onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped>
.custom-vue-panel {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.panel-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.info-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.info-section p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.control-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.action-btn {
  flex: 1;
  padding: 10px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.3);
}

.action-btn.secondary {
  background: #6c757d;
}

.action-btn.secondary:hover {
  background: #5a6268;
}

.input-section {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.custom-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.custom-input:focus {
  outline: none;
  border-color: #667eea;
}

.input-display {
  margin-top: 12px;
  padding: 8px 12px;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}
</style>

