import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ background: '#997755', resizeTo: window });

document.body.appendChild(app.view);
globalThis.__PIXI_APP__ = app;

const container = new PIXI.Container();

app.stage.addChild(container);

const texture = PIXI.Texture.from('https://pixijs.com/assets/bunny.png');

for (let i = 0; i < 25; i++) {
  const bunny = new PIXI.Sprite(texture);

  // WHAT DOES NEXT LINE DO?
  bunny.anchor.set(4, 4);

  bunny.x = (i % 5) * 40;
  bunny.y = Math.floor(i / 5) * 40;
  container.addChild(bunny);
}

container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;

app.ticker.add((delta) => {
  container.rotation += 0.001 * delta;
});