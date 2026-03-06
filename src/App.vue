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
  <div class="container">
    <h1>随机数生成器</h1>

    <div class="form-group">
      <label for="baseValues">基准值（逗号分隔）</label>
      <input
        id="baseValues"
        v-model="baseValuesInput"
        type="text"
        placeholder="例如：19.368,18.292"
      />
    </div>

    <div class="form-group">
      <label for="count">每组生成数量</label>
      <input
        id="count"
        v-model.number="countPerGroup"
        type="number"
        min="1"
        max="1000"
      />
    </div>

    <button @click="handleGenerate" :disabled="isGenerating">
      {{ isGenerating ? '生成中...' : '生成并下载' }}
    </button>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #42b983;
}

button {
  width: 100%;
  padding: 14px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background-color: #369970;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
