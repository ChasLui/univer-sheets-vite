<template>
  <div class="float-dom-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="header-badge">浮动DOM</div>
    </div>
    
    <div class="card-content">
      <!-- 时间显示区域 -->
      <div class="info-box">
        <div class="info-label">当前时间</div>
        <div class="info-value">{{ currentTime }}</div>
      </div>

      <!-- 计数器区域 -->
      <div class="counter-section">
        <div class="counter-display">
          <span class="counter-label">计数器</span>
          <span class="counter-value">{{ count }}</span>
        </div>
        <div class="counter-controls">
          <button @click="decrement" class="control-btn minus">-</button>
          <button @click="reset" class="control-btn reset">重置</button>
          <button @click="increment" class="control-btn plus">+</button>
        </div>
      </div>

      <!-- 输入框区域 -->
      <div class="input-section">
        <label class="input-label">输入文本</label>
        <input 
          v-model="inputValue" 
          type="text" 
          placeholder="在这里输入..."
          class="text-input"
        />
        <div v-if="inputValue" class="input-preview">
          <span class="preview-icon">📝</span>
          <span>{{ inputValue }}</span>
        </div>
      </div>

      <!-- 状态提示 -->
      <div class="status-tip">
        <span class="tip-icon">💡</span>
        <span class="tip-text">这是一个可拖动的浮动DOM组件</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

// Props
interface Props {
  title?: string;
  initialCount?: number;
  data?: {
    label?: string;
  };
  onUpdate?: (data: { count: number; input: string }) => void;
}

const props = withDefaults(defineProps<Props>(), {
  title: '浮动信息卡片',
  initialCount: 0,
});

// State
const count = ref(props.initialCount);
const currentTime = ref('');
const inputValue = ref('');
let timer: number | undefined;

// Methods
const increment = () => {
  count.value++;
  emitUpdate();
};

const decrement = () => {
  count.value--;
  emitUpdate();
};

const reset = () => {
  count.value = 0;
  inputValue.value = '';
  emitUpdate();
};

const emitUpdate = () => {
  if (props.onUpdate) {
    props.onUpdate({
      count: count.value,
      input: inputValue.value,
    });
  }
};

const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
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
.float-dom-card {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: grab;
  user-select: none;
}

.card-header:active {
  cursor: grabbing;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.header-badge {
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 12px;
  color: white;
  font-weight: 500;
}

.card-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-box {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 16px;
  font-weight: 700;
  color: #667eea;
  font-family: 'Monaco', 'Courier New', monospace;
}

.counter-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
}

.counter-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.counter-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.counter-value {
  font-size: 28px;
  font-weight: 700;
  color: #764ba2;
  font-family: 'Monaco', 'Courier New', monospace;
}

.counter-controls {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}

.control-btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.control-btn.minus {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.control-btn.reset {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.control-btn.plus {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn:active {
  transform: translateY(0);
}

.input-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 16px;
}

.input-label {
  display: block;
  font-size: 14px;
  color: #666;
  font-weight: 500;
  margin-bottom: 8px;
}

.text-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
}

.input-preview {
  margin-top: 10px;
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 6px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-icon {
  font-size: 16px;
}

.status-tip {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tip-icon {
  font-size: 18px;
}

.tip-text {
  font-size: 13px;
  color: white;
  font-weight: 500;
}
</style>

