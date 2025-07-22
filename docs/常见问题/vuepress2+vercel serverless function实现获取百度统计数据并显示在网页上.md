---
title: vuepress2+vercel serverless function实现获取百度统计数据并显示在网页上
createTime: 2025/07/15 22:34:16
tags:
  - vercel
  - vuepress
permalink: /article/question/4/
---
**前言**
主包使用vuepress2做自己的博客，想要添加从百度统计中获取数据并显示在页面中，如果直接向百度发送请求会有跨域问题，自己实现一个后端有点大材小用，毕竟我可能只需要一个接口。经过查阅发现可以使用vercel serverless function实现，只需要写一个转发代码即可。

1. 注册[百度统计](https://tongji.baidu.com/web/welcome/login)账号

2. 将百度给的脚本放在页面中
vuepress项目需要放在config文件中的head字段
```ts
export default defineUserConfig({
  head: [
    [
      "script",
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?xxxxxxxxxxxxxxxxxxxxxx";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
  ],
})
```
浏览器调试工具中看到有hm.js和hm.gif请求后就算成功了，可以等半小时左右在百度统计中查看数据
![](attachments/Pasted%20image%2020250715224205.png)

3. 开通百度统计导出功能
阅读[百度统计的文档](https://tongji.baidu.com/api/manual/Chapter2/openapi.html)开通数据api
开通需要前一天网站的阅读量超过100，可以自己刷
![](attachments/Pasted%20image%2020250715224414.png)

4. 通过api key 获取 code
- `{CLIENT_ID}`填写`API Key`
```
http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri=oob&scope=basic&display=popup
```

5. 通过身份验证获取`ACCESS_TOKEN`
- `{CLIENT_ID}`填写您的`API Key`
- `{CLIENT_SECRET}`填写您的`Secret Key`
- `{CODE}`填写您刚才拿到的`CODE`
```
http://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code={CODE}&client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&redirect_uri=oob
```
返回如下：
```
{
    "expires_in": 2592000,
    "refresh_token":"2.385d55f8615fdfd9edb7c4b5ebdc3e39.604800.1293440400-2346678-124328",
    "access_token":"1.a6b7dbd428f731035f771b8d15063f61.86400.1292922000-2346678-124328",
    "session_secret":"ANXxSNjwQDugf8615OnqeikRMu2bKaXCdlLxn",
    "session_key":" 248APxvxjCZ0VEC43EYrvxqaK4oZExMB",
    "scope":"basic"
}
```

6. 获取site_id
- `ACCESS_TOKEN`获取到的access_token
```
https://openapi.baidu.com/rest/2.0/tongji/config/getSiteList?access_token=${ACCESS_TOKEN}
```

7. 填写参数
在开通数据导出服务页面点击 [Tongji API调试工具](https://tongji.baidu.com/api/debug/)
按自己需求填写参数获取请求url

8. 设置vercel function
vercel项目会自动检测根目录下的api文件夹，并且将api文件夹中的所有文件以其相对于项目根目录的路径拼接到项目启动服务器url后面就是请求路径
如：
data.js默认导出的函数请求路径就是url/api/data

![](attachments/Pasted%20image%2020250715225235.png)

在url填从api调试工具中获取到的url，向这个url发送请求并转发出去
```js
export default async (req, res) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json(); // 确保将响应转换为 JSON
    res.status(200).json(data); // 返回实际数据
  } catch (error) {
    console.error("Error fetching data from Baidu:", error);
    res.status(500).json({ error: "Failed to fetch data from Baidu" });
  }
};
```

9. 在需要获取数据的页面发送请求并对结果进行处理
```ts
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
```
