<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AboutMeName from "./AboutMeName.vue";
import AboutMeText from "./AboutMeText.vue";
import AboutMeSkill from "./AboutMeSkill.vue";
import AboutMeCharacter from "./AboutMeCharacter.vue";
import AboutMeLife from "./AboutMeLife.vue";
import AboutMeFriendLink from "./AboutMeFriendLink.vue";
import { useTransition } from "@vueuse/core";

interface Comet {
  direction: "horizontal" | "vertical";
  position: number;
  progress: number;
  speed: number;
}

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const linesGap = 80;
const comets = ref<Comet[]>([]);
const mouseX = ref(-1);
const mouseY = ref(-1);
let animationFrameId: number;

const pv = ref(0);
const uv = ref(0);

const initCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx.value = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx.value) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

const drawGrid = () => {
  const canvas = canvasRef.value;
  const context = ctx.value;
  if (!canvas || !context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 1;

  // 绘制带渐变效果的网格
  const radius = 100; // 颜色影响半径
  const hasMouse = mouseX.value >= 0 && mouseY.value >= 0;

  // 水平线
  for (let y = 0; y < canvas.height; y += linesGap) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);

    let alpha = 0.1;
    if (hasMouse) {
      const dy = Math.abs(y - mouseY.value);
      if (dy < radius) {
        alpha = 0.1 + (1 - dy / radius) * 0.9;
      }
    }
    context.strokeStyle = `rgba(80, 134, 161, ${alpha})`;
    context.stroke();
  }

  // 垂直线
  for (let x = 0; x < canvas.width; x += linesGap) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);

    let alpha = 0.1;
    if (hasMouse) {
      const dx = Math.abs(x - mouseX.value);
      if (dx < radius) {
        alpha = 0.1 + (1 - dx / radius) * 0.9;
      }
    }
    context.strokeStyle = `rgba(80, 134, 161, ${alpha})`;
    context.stroke();
  }
};

// 彗星函数
const createComet = () => {
  const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
  const maxPosition =
    direction === "horizontal"
      ? Math.floor(window.innerHeight / linesGap)
      : Math.floor(window.innerWidth / linesGap);

  const position = Math.floor(Math.random() * maxPosition) * linesGap;

  comets.value.push({
    direction,
    position,
    progress: 0,
    speed: Math.random() * 0.005 + 0.002,
  });
};

const drawComet = (comet: Comet) => {
  const context = ctx.value;
  const canvas = canvasRef.value;
  if (!context || !canvas) return;

  const length = 80;
  const { direction, position, progress } = comet;

  if (direction === "horizontal") {
    const x = progress * canvas.width;
    const y = position;

    const gradient = context.createLinearGradient(x - length, y, x, y);
    gradient.addColorStop(0, "rgba(80, 134, 161, 0)");
    gradient.addColorStop(0.4, "rgba(80,134,161,0.3)");
    gradient.addColorStop(1, "#4483a2");

    context.strokeStyle = gradient;
    context.beginPath();
    context.moveTo(x - length, y);
    context.lineTo(x, y);
    context.stroke();
  } else {
    const x = position;
    const y = progress * canvas.height;

    const gradient = context.createLinearGradient(x, y - length, x, y);
    gradient.addColorStop(0, "rgba(80, 134, 161, 0)");
    gradient.addColorStop(0.4, "rgba(80,134,161,0.3)");
    gradient.addColorStop(1, "#4483a2");

    context.strokeStyle = gradient;
    context.beginPath();
    context.moveTo(x, y - length);
    context.lineTo(x, y);
    context.stroke();
  }
};

const animate = () => {
  const canvas = canvasRef.value;
  const context = ctx.value;
  if (!canvas || !context) return;

  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  comets.value = comets.value.filter((comet) => {
    comet.progress += comet.speed;
    drawComet(comet);
    return comet.progress < 1.2;
  });

  animationFrameId = requestAnimationFrame(animate);
};

const transitionPV = useTransition(pv, {
  duration: 3000,
  transition: [0.75, 0, 0.25, 1],
});

const transitionUV = useTransition(uv, {
  duration: 3000,
});

onMounted(() => {
  initCanvas();
  animate();
  setInterval(createComet, 1000);

  // getPV().then((res) => {
  //   console.log(res);
  //   pv.value = res.result.sum[0][0];
  //   uv.value = res.result.sum[0][1];
  // });

  fetch("/api/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // 解析 JSON 数据
    })
    .then((data) => {
      console.log(data); // 打印解析后的数据
      pv.value = data.result.sum[0][0]; // 更新 pv 值
      uv.value = data.result.sum[0][1]; // 更新 uv 值
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
  cancelAnimationFrame(animationFrameId);
});
</script>

<template>
  <div class="container">
    <canvas ref="canvasRef"></canvas>
    <div class="head-social">
      <a
        href="https://github.com/PinkDopeyBug"
        target="_blank"
        class="head-social-btn"
      >
        <icon name="mdi:github" />
      </a>
      <router-link to="/blog/" class="head-social-avatar"
        ><img src="/images/avatar.jpg" alt="avatar"
      /></router-link>
      <a
        href="mailto:pinkdopeybug@163.com"
        target="_blank"
        class="head-social-btn"
      >
        <icon class="head-social-btn" name="ic:baseline-email"></icon>
      </a>
    </div>
    <div class="about-me">
      <div class="card-content grid-row-3-2">
        <AboutMeName />
        <AboutMeText>
          <template #motto>
            <slot name="motto">
              <p class="about-me-card-title-normal">statistics</p>
              <p class="about-me-card-text-big">
                总访客数：<span style="color: #d53737">{{
                  Math.round(transitionUV)
                }}</span>
              </p>
              <p class="about-me-card-text-big about-me-card-text-soft">
                网站访问量：<span style="color: #3a5ccc">{{
                  Math.round(transitionPV)
                }}</span>
              </p>
            </slot>
          </template>
        </AboutMeText>
      </div>
      <div class="card-content grid-row-3-2">
        <AboutMeSkill />
        <AboutMeLife />
      </div>
      <div class="card-content grid-row-1-1">
        <AboutMeText>
          <template #motto>
            <slot name="motto">
              <p class="about-me-card-title-normal">maxim</p>
              <p class="about-me-card-text-big">身如柳絮随风扬</p>
              <p class="about-me-card-text-big about-me-card-text-color">
                无论云泥意贯一
              </p>
            </slot>
          </template>
        </AboutMeText>
        <AboutMeCharacter />
      </div>
      <div class="card-content grid-row-1">
        <AboutMeFriendLink />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}

canvas {
  z-index: -1;
  position: fixed;
  top: -1px;
  left: -1px;
  pointer-events: none; /* 允许鼠标事件穿透 */
  overflow: hidden;
}

.head-social {
  display: flex;
  width: fit-content;
  margin: 0 auto;
  align-items: center;

  .head-social-avatar {
    margin: 20px;
    border-radius: 30%;
    overflow: hidden;
    width: 60px;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }

  .head-social-btn {
    cursor: pointer;
    font-size: 30px;
    margin: 0px;
    transition: transform 0.2s, color 0.3s;
    color: var(--vp-c-text-2);

    &:hover {
      color: var(--vp-c-brand-1);
      transform: scale(1.2);
    }
  }
}

.about-me {
  max-width: 1380px;
  margin: 0 auto;
  width: 90%;
  @media screen and (max-width: 770px) {
    width: 94%;
  }
}

.card-content {
  margin-top: 20px;
  display: grid;
  gap: 20px;
  @media screen and (max-width: 770px) {
    display: flex;
    flex-direction: column;
  }
}
.grid-row-3-2 {
  grid-template-columns: 3fr 2fr;
}

.grid-row-1-1 {
  grid-template-columns: 1fr 1fr;
}

.grid-row-1 {
  grid-template-columns: 1fr;
}
</style>
