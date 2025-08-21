---
title: call、apply、bind
tags:
  - 手撕
  - 前端
permalink: /article/shred/1/
createTime: 2025/08/21 22:17:25
---

# call
```js
Function.prototype.myCall = function (context, ...args) {
  const fn = Symbol("fn");
  context[fn] = this;
  const res = context[fn](...args);
  delete context[fn];
  return res;
};

```

# apply
```js
Function.prototype.myApply = function (context, args) {
  const fn = Symbol("fn");
  context[fn] = this;
  const res = context[fn](...args);
  delete context[fn];
  return res;
};
```

# bind
```js
Function.prototype.myBind = function (context, ...args) {
  return (...reArgs) => {
    return this.myCall(context, ...args, ...reArgs);
  };
};
```

