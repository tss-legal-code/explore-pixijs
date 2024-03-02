import * as PIXI from 'pixi.js';
import { generateRandomColor as grc } from '../../shared/utils';
const app = new PIXI.Application({ background: grc(), resizeTo: window });
globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const sprite = PIXI.Sprite.from('./assets/bunny.png');

sprite.anchor.set(0.5);
sprite.x = app.screen.width / 2;
sprite.y = app.screen.height / 2;

sprite.eventMode = 'static';

sprite.cursor = 'pointer';

function onClick(event) {
  if (event.ctrlKey) {
    sprite.scale.x /= 1.25;
    sprite.scale.y /= 1.25;
  } else {
    sprite.scale.x *= 1.25;
    sprite.scale.y *= 1.25;
  }
}

sprite.on('pointerdown', onClick);

app.stage.addChild(sprite);

const text = new PIXI.Text('do [click] to upscale or [ctrl+click] to downscale', {
  fontSize: 24,
  fill: grc(),
});

text.x = 100;
text.y = 100;

app.stage.addChild(text);


console.log('Hello from 070_click');