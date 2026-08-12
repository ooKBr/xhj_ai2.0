// data.js
// 肖式电商集团 · 运动鞋 月度销售额（单位：百万元）

export const MONTHS = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
]

// 各月份的季节系数：2月春节走低、6月(618)与11月(双11)冲高
const SEASONAL = [
  0.8, 0.6, 1.0, 1.1, 1.15, 1.6,
  1.0, 0.95, 0.9, 1.1, 1.8, 1.2,
]

// 可复现的伪随机数生成器（传入 seed 时每次生成结果一致）
function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * 生成运动鞋月度销售额
 * @param {Object} options
 * @param {number} [options.base=40]      基础销售额（百万元）
 * @param {number} [options.volatility=0.15] 随机涨跌幅度（0~1）
 * @param {number} [options.seed]         随机种子，不传则每次不同
 * @returns {{ month: string, value: number }[]}
 */
export function generateSalesData({ base = 40, volatility = 0.15, seed } = {}) {
  const rand = seed != null ? mulberry32(seed) : Math.random

  return MONTHS.map((month, i) => {
    const noise = (rand() - 0.5) * 2 * volatility // -volatility ~ +volatility
    const value = base * SEASONAL[i] * (1 + noise)
    return { month, value: Number(value.toFixed(2)) }
  })
}

// 预生成一份默认数据，可直接用于柱状图绘制
export const monthlySales = generateSalesData({ seed: 2025 })

// 便于 ECharts 直接使用：x 轴标签与数值数组
export const months = monthlySales.map((d) => d.month)
export const salesValues = monthlySales.map((d) => d.value)
