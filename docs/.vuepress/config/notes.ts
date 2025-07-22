import { defineNoteConfig, defineNotesConfig } from "vuepress-theme-plume";

const noteBase = defineNoteConfig({
  dir: "基础",
  link: "/base/",
  sidebar: "auto",
});

const noteFront = defineNoteConfig({
  dir: "前端",
  link: "/front/",
  sidebar: "auto",
});

const noteBack = defineNoteConfig({
  dir: "后端",
  link: "/back/",
  sidebar: "auto",
});

const noteCPP = defineNoteConfig({
  dir: "C++",
  link: "/cpp/",
  sidebar: "auto",
});

const notePython = defineNoteConfig({
  dir: "Python",
  link: "/python/",
  sidebar: "auto",
});

const noteGame = defineNoteConfig({
  dir: "游戏",
  link: "/game/",
  sidebar: "auto",
});

const noteTools = defineNoteConfig({
  dir: "工具",
  link: "/tools/",
  sidebar: "auto",
});

const noteMore = defineNoteConfig({
  dir: "more",
  link: "/more/",
});

export const notes = defineNotesConfig({
  dir: "notes",
  link: "/",
  notes: [
    noteBase,
    noteFront,
    noteBack,
    noteCPP,
    notePython,
    noteGame,
    noteTools,
    noteMore,
  ],
});
