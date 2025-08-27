---
title: setTimeout和setInterval
tags:
  - 手撕
  - 前端
permalink: /article/shred/4/
createTime: 2025/08/27 22:00:22
---

# setInterval
```js
/**
 * 使用setTimeout实现setInterval
 * @param {*} fn 回调函数
 * @param {*} delay 延时
 * @returns 停止函数
 */
function mySetInterval(fn, delay) {
  let timer = null;
  function inner() {
    fn();
    timer = setTimeout(inner, delay);
  }
  timer = setTimeout(inner, delay);

  return {
    clear() {
      clearTimeout(timer);
    },
  };
}
```

# setTimeout
```js
/**
 * 使用setInterval实现setTimeout
 * @param {*} fn 回调函数
 * @param {*} delay 延时
 */
function mySetTimeout(fn, delay) {
  let timer = setInterval(() => {
    fn();
    clearInterval(timer);
  }, delay);
}
```
