import './style.css'
import * as echarts from 'echarts'
import { months, salesValues } from './data.js'

const chartDom = document.getElementById('chart')
const chart = echarts.init(chartDom)

const option = {
  title: {
    text: '肖式电商集团 · 运动鞋月度销售额',
    subtext: '单位：百万元',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    valueFormatter: (value) => `${value} 百万`,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    data: months,
    axisTick: {
      alignWithLabel: true,
    },
  },
  yAxis: {
    type: 'value',
    name: '销售额（百万元）',
  },
  series: [
    {
      name: '销售额',
      type: 'bar',
      barWidth: '60%',
      data: salesValues,
      itemStyle: {
        borderRadius: [6, 6, 0, 0],
      },
      label: {
        show: true,
        position: 'top',
      },
    },
  ],
}

chart.setOption(option)

window.addEventListener('resize', () => chart.resize())
