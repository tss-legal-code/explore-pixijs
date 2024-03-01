import * as PIXI from 'pixi.js';

let app = new PIXI.Application({ width: 840, height: 840 });
document.body.appendChild(app.view);
globalThis.__PIXI_APP__ = app;
//
const container = new PIXI.Container();
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

app.stage.addChild(container);

const sprites = [];
let parent = container;
for (let i = 0; i < 3; i++) {
  const sprite = PIXI.Sprite.from("./assets/sample.png");
  sprite.anchor.set(0.5);
  parent.addChild(sprite);
  sprites.push(sprite);
  parent = sprite;
}

let elapsed = 0.0;
app.ticker.add((delta) => {
  elapsed += delta / 10;
  const amount = Math.sin(elapsed);
  const scale = 1 + 0.25 * amount;
  const alpha = 0.75 + 0.25 * amount;
  const angle = 40 * amount;
  const x = 75 * amount;
  for (let i = 0; i < sprites.length; i++) {
    const sprite = sprites[i];
    sprite.scale.set(scale);
    sprite.alpha = alpha;
    sprite.angle = angle;
    sprite.x = x;
  }
});