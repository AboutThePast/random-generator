/**
 * 根据基准值和规则生成随机数
 * @param {number} baseValue - 基准值（如 19.368）
 * @param {number} count - 生成数量
 * @param {number} fixedDigits - 小数部分固定位数（默认 2）
 * @param {number} varyRange - 最后一位变动范围（默认 1，即±1）
 * @param {number} randomDigits - 随机生成位数（默认 5）
 * @returns {string[]} 生成的随机数数组
 */
export function generateRandomNumbers(baseValue, count, fixedDigits = 2, varyRange = 1, randomDigits = 5) {
  const strVal = baseValue.toFixed(fixedDigits + 1);
  const [intPart, decimalPart] = strVal.split('.');
  const fixedPart = decimalPart.substring(0, fixedDigits);
  const lastDigit = parseInt(decimalPart[fixedDigits]);

  const minDigit = Math.max(0, lastDigit - varyRange);
  const maxDigit = Math.min(9, lastDigit + varyRange);

  const results = [];
  for (let i = 0; i < count; i++) {
    const varyDigit = Math.floor(Math.random() * (maxDigit - minDigit + 1)) + minDigit;
    const randomPart = Math.floor(Math.random() * Math.pow(10, randomDigits));
    const randomPartStr = randomPart.toString().padStart(randomDigits, '0');
    const fullValue = `${intPart}.${fixedPart}${varyDigit}${randomPartStr}`;
    results.push(fullValue);
  }

  return results;
}

/**
 * 生成多组数据
 * @param {number[]} baseValues - 基准值数组
 * @param {number} countPerGroup - 每组生成数量
 * @param {number} fixedDigits - 小数部分固定位数
 * @param {number} varyRange - 最后一位变动范围
 * @param {number} randomDigits - 随机生成位数
 * @returns {Object[]} 每组数据的结果
 */
export function generateMultipleGroups(baseValues, countPerGroup, fixedDigits, varyRange, randomDigits) {
  return baseValues.map(baseValue => ({
    baseValue,
    numbers: generateRandomNumbers(baseValue, countPerGroup, fixedDigits, varyRange, randomDigits)
  }));
}

/**
 * 将结果转换为 TXT 格式
 * @param {Object[]} groups - 多组数据
 * @returns {string} TXT 内容
 */
export function formatToTxt(groups) {
  const lines = [];
  groups.forEach(group => {
    lines.push(`基准值：${group.baseValue}`);
    group.numbers.forEach(num => lines.push(num));
    lines.push('');
  });
  return lines.join('\n');
}

/**
 * 下载 TXT 文件
 * @param {string} content - 文件内容
 * @param {string} filename - 文件名
 */
export function downloadTxt(content, filename = '随机数生成结果.txt') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
