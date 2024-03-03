console.log('Hello from 080_sprites');
import * as PIXI from 'pixi.js';
import { generateRandomColor as grc } from '../../shared/utils';

const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: grc(),
  antialias: true
});

app.renderer.view.style.position = "absolute";
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const bunny = PIXI.Sprite.from('./assets/bunny.png');

bunny.anchor.set(0.5);

bunny.x = app.screen.width / 2;
bunny.y = app.screen.height / 2;

bunny.eventMode = 'static';

bunny.cursor = 'pointer';

function onClick(event) {
  if (event.ctrlKey) {
    bunny.scale.x /= 1.25;
    bunny.scale.y /= 1.25;
  } else {
    bunny.scale.x *= 1.25;
    bunny.scale.y *= 1.25;
  }
}
bunny.on('pointerdown', onClick);

app.stage.addChild(bunny);



app.ticker.add((delta) => {
  bunny.rotation += 0.05 * delta;
});
