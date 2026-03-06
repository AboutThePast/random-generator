<script setup>
import { ref } from 'vue'
import { generateMultipleGroups, formatToTxt, downloadTxt } from './utils/randomGenerator'

const baseValuesInput = ref('19.368,18.292')
const countPerGroup = ref(30)
const fixedDigits = ref(2)
const varyRange = ref(1)
const randomDigits = ref(5)
const isGenerating = ref(false)
const showAdvanced = ref(false)

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

    const fixed = parseInt(fixedDigits.value)
    const vary = parseInt(varyRange.value)
    const random = parseInt(randomDigits.value)

    if (isNaN(fixed) || fixed < 0) {
      alert('请输入有效的固定位数')
      return
    }

    if (isNaN(vary) || vary <= 0) {
      alert('请输入有效的变动范围')
      return
    }

    if (isNaN(random) || random <= 0) {
      alert('请输入有效的生成位数')
      return
    }

    const results = generateMultipleGroups(baseValues, count, fixed, vary, random)
    const txtContent = formatToTxt(results)
    downloadTxt(txtContent)
  } catch (error) {
    console.error(error)
    alert('生成失败：' + error.message)
  } finally {
    isGenerating.value = false
  }
}

function toggleAdvanced() {
  showAdvanced.value = !showAdvanced.value
}
</script>

<template>
  <div class="app-container">
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
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
        <p class="subtitle">固定{{fixedDigits}}位 · ±{{varyRange}} · 后{{randomDigits}}位</p>
      </div>

      <div class="card-body">
        <div class="form-group">
          <label for="baseValues">基准值</label>
          <input
            id="baseValues"
            v-model="baseValuesInput"
            type="text"
            placeholder="19.368,18.292"
            class="input-field"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label for="count">生成数量</label>
            <input
              id="count"
              v-model.number="countPerGroup"
              type="number"
              min="1"
              max="1000"
              class="input-field"
            />
          </div>

          <div class="form-group half">
            <label>
              <button type="button" class="advanced-toggle" @click="toggleAdvanced">
                <svg class="chevron" :class="{ rotated: showAdvanced }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                高级规则
              </button>
            </label>
            <input
              v-model.number="countPerGroup"
              type="range"
              min="1"
              max="1000"
              class="slider-field"
            />
          </div>
        </div>

        <transition name="slide">
          <div v-if="showAdvanced" class="advanced-row">
            <div class="form-group third">
              <label for="fixedDigits">固定位</label>
              <input
                id="fixedDigits"
                v-model.number="fixedDigits"
                type="number"
                min="0"
                max="10"
                class="input-field small"
              />
            </div>

            <div class="form-group third">
              <label for="varyRange">±范围</label>
              <input
                id="varyRange"
                v-model.number="varyRange"
                type="number"
                min="1"
                max="9"
                class="input-field small"
              />
            </div>

            <div class="form-group third">
              <label for="randomDigits">生成位</label>
              <input
                id="randomDigits"
                v-model.number="randomDigits"
                type="number"
                min="1"
                max="20"
                class="input-field small"
              />
            </div>
          </div>
        </transition>

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
      <p>例：19.368 → 前 2 位固定 19.36，第 3 位±{{varyRange}}，后{{randomDigits}}位随机</p>
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
  padding: 16px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
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
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%);
  animation: float 20s infinite ease-in-out;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: -60px;
  right: -60px;
}

.circle-2 {
  width: 120px;
  height: 120px;
  bottom: -40px;
  left: -40px;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-15px, 15px) scale(0.95); }
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(25px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  padding: 28px 24px 20px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  border-bottom: 1px solid #e5e7eb;
}

.icon-wrapper {
  width: 52px;
  height: 52px;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.25);
}

.dice-icon {
  width: 28px;
  height: 28px;
  color: white;
}

h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 6px 0;
}

.subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.card-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: flex;
  gap: 12px;
}

.form-group.half {
  flex: 1;
  min-width: 0;
}

.advanced-row {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 12px;
}

.form-group.third {
  flex: 1;
  min-width: 0;
  margin-bottom: 0;
}

label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.advanced-toggle {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #0ea5e9;
  padding: 0;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.2s;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.input-field {
  width: 100%;
  padding: 11px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  font-family: inherit;
  color: #1f2937;
  background: white;
  transition: all 0.25s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.input-field.small {
  padding: 11px 8px;
  font-size: 14px;
  text-align: center;
}

.input-field::placeholder {
  color: #9ca3af;
}

.input-field:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1), 0 3px 10px rgba(14, 165, 233, 0.12);
  transform: translateY(-1px);
}

.slider-field {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
  margin-top: 6px;
}

.slider-field::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #0ea5e9;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.3);
}

.generate-btn {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
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
  gap: 8px;
  position: relative;
  z-index: 1;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.generate-btn:hover:not(:disabled) .btn-shine {
  left: 100%;
}

.footer {
  margin-top: 18px;
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  position: relative;
  z-index: 1;
}

.footer p {
  margin: 0;
}

/* 滑动动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  margin-bottom: 0;
}

.slide-enter-to,
.slide-leave-from {
  max-height: 80px;
  opacity: 1;
}

/* 响应式 */
@media (max-width: 480px) {
  .app-container { padding: 12px; }
  .card-header { padding: 24px 20px 16px; }
  .card-body { padding: 16px; }
  h1 { font-size: 22px; }
  .icon-wrapper { width: 48px; height: 48px; }
  .dice-icon { width: 24px; height: 24px; }
  .advanced-row { flex-wrap: wrap; }
}
</style>
