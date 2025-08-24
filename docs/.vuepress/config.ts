import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";
import { plumeTheme } from "vuepress-theme-plume";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";
import { copyrightPlugin } from "@vuepress/plugin-copyright";
import { live2dConfig } from "./config/live2d";
import { socialSharePlugin } from "vuepress-plugin-social-share";
import path, { resolve } from "node:path";
import "dotenv/config";

console.log(
  process.env.VITE_REPO_ID,
  process.env.VITE_CATEGORY_ID,
  process.env.VITE_GOOGLE_SITE_ID,
  process.env.VITE_BAIDU_SITE_ID
);
export default defineUserConfig({
  head: [
    [
      "script",
      {},
      `
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?${process.env.VITE_BAIDU_SITE_ID}";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
      `,
    ],
  ],
  base: "/",
  lang: "zh-CN",
  title: "wynnsimon",
  description: "wynnsimon blog.",
  bundler: viteBundler({
    viteOptions: {
      envDir: resolve(__dirname, "../../"),
    },
  }),
  plugins: [
    // 谷歌网站数据分析插件
    googleAnalyticsPlugin({
      id: process.env.VITE_GOOGLE_SITE_ID || '',
    }),
    // 复制时添加版权信息
    copyrightPlugin({
      global: true,
      triggerLength: 60,
      author: "呆虫仙尊",
      canonical: "https://w20241204.dpdns.org/",
      license: "CC-BY-4.0",
    }),
    // live2d配置
    live2dConfig,
    // 分享插件
    socialSharePlugin({
      networks: [
        "qq",
        "wechat",
        "weibo",
        "douban",
        "telegram",
        "x",
        "facebook",
        "line",
        "qrcode",
        "email",
      ],
    }),
  ],
  theme: plumeTheme({
    hostname: "https://w20241204.dpdns.org/",
    contributors: {
      mode: "block",
    },
    plugins: {
      // 如果您在此处直接声明为 true，则表示开发环境和生产环境都启用该功能
      git: true,
      seo: {
        author: {
          name: "wynnsimon",
          url: "https://github.com/wynnsimon",
          email: "pinkdopeybug@163.com",
        },
        autoDescription: true,
      },
      sitemap: {
        devServer: true,
      },
    },
    // markdown 增强
    markdown: {
      imageSize: true, // 图片优化
      demo: true, // 启用新的代码演示功能
      markmap: true, // 启用 Markmap 图表嵌入语法
      codeTree: true, // 启用代码树
    },

    // 代码高亮
    codeHighlighter: {
      themes: { light: "vitesse-light", dark: "vitesse-dark" },
      notationDiff: true,
      notationErrorLevel: true,
      notationFocus: true, // 启用代码块聚焦
      notationHighlight: true,
      notationWordHighlight: true, // 词高亮
      highlightLines: true, // 启用行高亮
      collapsedLines: true, // 全局启用 代码折叠
      lineNumbers: true, // 启用行号
    },
    // 评论
    comment: {
      // 服务提供商
      provider: "Giscus",
      // 是否默认启用评论
      comment: true,
      repo: "wynnsimon/blog",
      repoId: process.env.VITE_REPO_ID || "",
      category: "Announcements",
      categoryId: process.env.VITE_CATEGORY_ID || "",
    },
    // 公告
    bulletin: {
      layout: "top-right",
      title: "公告",
      lifetime: "once",
      contentType: "markdown",
      contentFile: path.resolve(__dirname, "../notes/more/bulletin.md"),
    },
    // 版权
    copyright: {
      license: "CC-BY-4.0",
      author: "wynnsimon",
    },
  }),
});
