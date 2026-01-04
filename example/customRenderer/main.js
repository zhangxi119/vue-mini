import { createRenderer } from "../../lib/mini-vue.esm.js";
import { App } from "./App.js";

console.log("PIXI", PIXI);

const game = new PIXI.Application({
  width: 500,
  height: 500,
});
document.body.appendChild(game.view);

const renderer = createRenderer({
  createElement(type) {
    if (type === "rect") {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },
  insert(el, parent) {
    parent.addChild(el);
  },
  patchProps(el, key, value) {
    el[key] = value;
  },
});

renderer.createApp(App).mount(game.stage);

// const rootContainer = document.querySelector("#app");
// createApp(App).mount(rootContainer);
