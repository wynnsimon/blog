import { defineNavbarConfig } from "vuepress-theme-plume";

export const navbar = defineNavbarConfig([
  {
    text: "博客",
    link: "/blog/",
    icon: "akar-icons:reciept",
    activeMatch: "^(/|/notes/tools/)",
  },
  {
    text: "基础",
    items: [
      { text: "Linux", link: "/base/linux/", icon: "logos:linux-tux" },
      {
        text: "操作系统",
        link: "/base/os/",
        icon: "devicon:windows8",
      },
      {
        text: "数据结构与算法",
        link: "/base/dsa/",
        icon: "logos:nanonets",
      },
      { text: "计算机组成原理", link: "/base/co/", icon: "logos:compose" },
      { text: "计算机网络", link: "/base/cn/", icon: "devicon:networkx" },
      { text: "设计模式", link: "/base/dp/", icon: "material-icon-theme:brainfuck" },
    ],
    icon: "akar-icons:augmented-reality",
    activeMatch: "^/base/",
  },
  {
    text: "前端",
    items: [
      { text: "Html", link: "/front/html/", icon: "devicon:html5" },
      { text: "CSS", link: "/front/css/", icon: "devicon:css3" },
      { text: "JavaScript", link: "/front/js/", icon: "material-icon-theme:javascript" },
      { text: "TypeScript", link: "/front/ts/", icon: "material-icon-theme:typescript" },
      { text: "Node", link: "/front/node/", icon: "material-icon-theme:nodejs-alt" },
      { text: "Vue", link: "/front/vue/", icon: "material-icon-theme:vue" },
      { text: "Nuxt", link: "/front/nuxt/", icon: "logos:nuxt-icon" },
      { text: "Vitest", link: "/front/vitest/", icon: "logos:vitest" },
      { text: "React", link: "/front/react/", icon: "material-icon-theme:react" },
      { text: "小程序", link: "/front/mini-program/", icon: "tabler:brand-miniprogram" },
      { text: "工程化", link: "/front/engineering/", icon: "logos:webpack" },
      { text: "正则", link: "/front/regex/", icon: "skill-icons:regex-light" },
      { text: "Electron", link: "/front/electron/", icon: "logos:electron" },
    ],
    icon: "typcn:css3",
    activeMatch: "^/front/",
  },
  {
    text: "后端",
    items: [
      { text: "Java", link: "/back/java/", icon: "logos:java" },
      {
        text: "JUnit",
        link: "/back/junit/",
        icon: "devicon:junit",
      },
      { text: "log4j2", link: "/back/log4j2/", icon: "material-icon-theme:log" },
      { text: "Maven", link: "/back/maven/", icon: "material-icon-theme:maven" },
      { text: "MyBatis", link: "/back/mybatis/", icon: "logos:twitter" },
      { text: "SpringBoot", link: "/back/springboot/", icon: "logos:spring-icon" },
    ],
    icon: "akar-icons:settings-vertical",
    activeMatch: "^/back/",
  },
  {
    text: "C++",
    items: [
      { text: "C语言", link: "/cpp/c/", icon: "skill-icons:c" },
      { text: "C++", link: "/cpp/cpp/", icon: "skill-icons:cpp" },
      { text: "Cmake", link: "/cpp/cmake/", icon: "skill-icons:cmake-light" },
      { text: "QT", link: "/cpp/qt/", icon: "skill-icons:qt-light" },
      {
        text: "现代C++新特性",
        link: "/cpp/modern-cpp/",
        icon: "material-icon-theme:cpp",
      },
    ],
    icon: "file-icons:chapel",
    activeMatch: "^/cpp/",
  },
  {
    text: "Python",
    items: [
      { text: "Python", link: "/python/python/", icon: "material-icon-theme:python" },
      { text: "数据处理", link: "/python/dp/", icon: "material-icon-theme:dependencies-update" },
      { text: "爬虫", link: "/python/crawler/", icon: "logos:bugsee" },
    ],
    icon: "tabler:brand-python",
    activeMatch: "^/python/",
  },
  {
    text: "游戏",
    items: [
      { text: "C#", link: "/game/cs/", icon: "skill-icons:cs" },
      {
        text: "虚幻",
        link: "/game/ue/",
        icon: "logos:unrealengine-icon",
      },
      { text: "Unity", link: "/game/unity/", icon: "logos:unity" },
    ],
    icon: "akar-icons:game-controller",
    activeMatch: "^/game/",
  },
  {
    text: "工具",
    items: [
      { text: "Docker", link: "/tools/docker/", icon: "logos:docker-icon" },
      { text: "Git", link: "/tools/git/", icon: "logos:git-icon" },
      {
        text: "Protobuf",
        link: "/tools/protobuf/",
        icon: "logos:google-developers",
      },
      { text: "Kafka", link: "/tools/kafka/", icon: "logos:kafka-icon" },
      {
        text: "Kubernetes",
        link: "/tools/kubernetes/",
        icon: "logos:kubernetes",
      },
      { text: "Redis", link: "/tools/redis/", icon: "logos:redis" },
      { text: "MySQL", link: "/tools/mysql/", icon: "skill-icons:mysql-light" },
      { text: "MongoDB", link: "/tools/mongodb/", icon: "devicon:mongodb" },
      { text: "vscode", link: "/tools/vscode/", icon: "devicon:vscode" },
    ],
    icon: "gridicons:customize",
    activeMatch: "^/tools/",
  },
  {
    text: "更多",
    items: [
      {
        text: "友人帐",
        link: "/more/friends/",
        icon: "icon-park:friends-circle",
      },
      {
        text: "我的项目",
        link: "/more/projects/",
        icon: "material-icon-theme:folder-project-open",
      },
      {
        text: "网址导航",
        link: "/more/sites-collect/",
        icon: "logos:sitepoint",
      },
      {
        text: "公告",
        link: "/more/bulletin/",
        icon: "unjs:uqr",
      },
    ],
    icon: "mingcute:more-3-line",
    activeMatch: "^/more/",
  },
]);
