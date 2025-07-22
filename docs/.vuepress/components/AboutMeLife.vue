<template>
  <div class="about-me-card-bg vp-blog-post-item about-me-life">
    <div style="margin-left: 20px">
    <p class="about-me-card-title-normal">technology</p>
    <p class="about-me-card-text-big">技术栈占比</p>
    </div>
  <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script setup>
import { personality } from '../data/data';
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const chartRef = ref(null);


onMounted(() => {
  const myChart = echarts.init(chartRef.value);

  const option = {
    tooltip: {
      trigger: 'item'
      ,
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        name: '性格特征',
        type: 'pie',
        radius: ['50%', '80%'],
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 360,
        data: personality
      }
    ]
  };

  myChart.setOption(option);

  // 响应式调整
  window.addEventListener('resize', () => {
    myChart.resize();
  });
});
</script>

<style scoped>

.about-me-life{
  height: 316px;
  padding: 20px 0;
  overflow: inherit;
}
.chart-container {
  height: 100%;
}
</style>
