/**
 * 根据基准值生成随机数
 * @param {number} baseValue - 基准值（如 19.368）
 * @param {number} count - 生成数量
 * @returns {string[]} 生成的随机数数组
 */
export function generateRandomNumbers(baseValue, count) {
  const strVal = baseValue.toFixed(3);
  const [intPart, decimalPart] = strVal.split('.');
  const decimal2 = decimalPart.substring(0, 2);
  const decimal3 = parseInt(decimalPart[2]);

  const minThird = Math.max(0, decimal3 - 1);
  const maxThird = Math.min(9, decimal3 + 1);

  const results = [];
  for (let i = 0; i < count; i++) {
    const thirdDigit = Math.floor(Math.random() * (maxThird - minThird + 1)) + minThird;
    const last5Digits = Math.floor(Math.random() * 100000);
    const fullValue = `${intPart}.${decimal2}${thirdDigit}${last5Digits.toString().padStart(5, '0')}`;
    results.push(fullValue);
  }

  return results;
}

/**
 * 生成多组数据
 * @param {number[]} baseValues - 基准值数组
 * @param {number} countPerGroup - 每组生成数量
 * @returns {Object[]} 每组数据的结果
 */
export function generateMultipleGroups(baseValues, countPerGroup) {
  return baseValues.map(baseValue => ({
    baseValue,
    numbers: generateRandomNumbers(baseValue, countPerGroup)
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
