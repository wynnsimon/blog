// live2d配置
import { oml2dPlugin } from "vuepress-plugin-oh-my-live2d";

export const live2dConfig = oml2dPlugin({
  models: [
    {
      name: "shizuku",
      path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/shizuku/shizuku.model.json",
      scale: 0.2,
      volume: 0.5,
      position: [70, 70],
      stageStyle: {
        height: 360,
        width: 400,
      },
    },
    {
      name: "senko",
      path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Senko_Normals/senko.model3.json",
      scale: 0.1,
      volume: 0.5,
      position: [0, 70],
      stageStyle: {
        height: 360,
        width: 400,
      },
    },
    {
      name: "pio",
      path: "https://registry.npmmirror.com/oml2d-models/latest/files/models/Pio/model.json",
      scale: 0.4,
      volume: 0,
      position: [0, 0],
      stageStyle: {
        height: 360,
        width: 400,
      },
    },
  ],
  menus: (currentModel) => {
    switch (currentModel.name) {
      case "shizuku":
        return {
          style: {
            left: 0,
          },
        };
      default:
        return {
          items: (defaultItem) => {
            return [defaultItem[1]];
          },
        };
    }
  },
});
