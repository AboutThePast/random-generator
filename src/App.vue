<script setup>
import { ref } from 'vue'
import { generateMultipleGroups, formatToTxt, downloadTxt } from './utils/randomGenerator'

const baseValuesInput = ref('19.368,18.292')
const countPerGroup = ref(30)
const isGenerating = ref(false)

function handleGenerate() {
  isGenerating.value = true

  try {
    const baseValues = baseValuesInput.value
      .split(',')
      .map(s => parseFloat(s.trim()))
      .filter(n => !isNaN(n))

    if (baseValues.length === 0) {
      alert('请输入有效的基准值')
      return
    }

    const count = parseInt(countPerGroup.value)
    if (isNaN(count) || count <= 0) {
      alert('请输入有效的生成数量')
      return
    }

    const results = generateMultipleGroups(baseValues, count)
    const txtContent = formatToTxt(results)
    downloadTxt(txtContent)
  } catch (error) {
    console.error(error)
    alert('生成失败：' + error.message)
  } finally {
    isGenerating.value = false
  }
}
</script>

<template>
  <div class="app-container">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="icon-wrapper">
          <svg class="dice-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="4" />
            <circle cx="8" cy="8" r="1.5" fill="currentColor" />
            <circle cx="16" cy="8" r="1.5" fill="currentColor" />
            <circle cx="8" cy="16" r="1.5" fill="currentColor" />
            <circle cx="16" cy="16" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>
        <h1>随机数生成器</h1>
        <p class="subtitle">生成符合规则的随机数</p>
      </div>

      <div class="card-body">
        <div class="form-group">
          <label for="baseValues">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            基准值
          </label>
          <input
            id="baseValues"
            v-model="baseValuesInput"
            type="text"
            placeholder="19.368,18.292"
            class="input-field"
          />
          <span class="hint">逗号分隔，支持多个值</span>
        </div>

        <div class="form-group">
          <label for="count">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            每组生成数量
          </label>
          <div class="input-with-hint">
            <input
              id="count"
              v-model.number="countPerGroup"
              type="number"
              min="1"
              max="1000"
              class="input-field"
            />
            <span class="range-hint">1 - 1000</span>
          </div>
        </div>

        <button
          @click="handleGenerate"
          :disabled="isGenerating"
          class="generate-btn"
        >
          <span class="btn-content">
            <svg v-if="!isGenerating" class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <svg v-else class="btn-icon spinning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" stroke-dasharray="40 20" />
            </svg>
            {{ isGenerating ? '生成中...' : '生成并下载' }}
          </span>
          <div class="btn-shine"></div>
        </button>
      </div>
    </div>

    <footer class="footer">
      <p>按 ±1 规则生成 · 小数第 3 位在基准值基础上 ±1 随机</p>
    </footer>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.background-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  left: -50px;
  animation-delay: -7s;
}

.circle-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  animation-delay: -14s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(30px, -30px) scale(1.05);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.95);
  }
  75% {
    transform: translate(20px, 30px) scale(1.02);
  }
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.2),
    0 10px 20px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  width: 100%;
  max-width: 440px;
  overflow: hidden;
  animation: slideUp 0.6s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-header {
  padding: 40px 32px 24px;
  text-align: center;
  background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.dice-icon {
  width: 32px;
  height: 32px;
  color: white;
}

h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

.card-body {
  padding: 32px;
}

.form-group {
  margin-bottom: 24px;
}

label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.input-field {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  color: #1f2937;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow:
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 4px 12px rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.input-field:hover:not(:focus) {
  border-color: #d1d5db;
}

.input-with-hint {
  position: relative;
}

.range-hint {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #9ca3af;
  pointer-events: none;
}

.hint {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #9ca3af;
}

.generate-btn {
  width: 100%;
  padding: 16px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.generate-btn:hover:not(:disabled) .btn-shine {
  left: 100%;
}

.footer {
  margin-top: 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  position: relative;
  z-index: 1;
}

.footer p {
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .app-container {
    padding: 16px;
  }

  .card-header {
    padding: 32px 24px 20px;
  }

  .card-body {
    padding: 24px;
  }

  h1 {
    font-size: 24px;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
  }

  .dice-icon {
    width: 28px;
    height: 28px;
  }
}
</style>
