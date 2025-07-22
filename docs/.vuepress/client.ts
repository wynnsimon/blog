import { defineClientConfig } from "vuepress/client";
import "./theme/styles/index.css";
import RepoCard from "vuepress-theme-plume/features/RepoCard.vue";
import AllFriendContent from "./components/AllFriendContent.vue";
import "./theme/styles/custom.css";
import Custom from "./components/Custom.vue";

export default defineClientConfig({
  enhance({ app}) {
    // 注册组件
    app.component("RepoCard", RepoCard);
    app.component("Custom", Custom);
    app.component("AllFriendContent", AllFriendContent);
  },
});
