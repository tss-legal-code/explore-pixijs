console.log('Hello from 02_masking');

import * as PIXI from 'pixi.js';



const app = new PIXI.Application({ width: 640, height: 360 });
globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

const frame = new PIXI.Graphics();

frame.beginFill(0x666666);
frame.lineStyle({ color: 0xffffff, width: 4, alignment: 0 });
frame.drawRect(0, 0, 208, 208);
frame.position.set(320 - 104, 180 - 104);
app.stage.addChild(frame);

const mask = new PIXI.Graphics();
mask.beginFill(0xffffff);
mask.drawRect(0, 0, 200, 200);
mask.endFill();

const maskContainer = new PIXI.Container();
maskContainer.mask = mask;
maskContainer.addChild(mask);
maskContainer.position.set(4, 4);
frame.addChild(maskContainer);

const text = new PIXI.Text('Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ratione id nisi maiores ex error illum, distinctio fugit odio amet alias incidunt tempora asperiores! Reiciendis, veniam explicabo. Sapiente ipsam, iste praesentium eligendi dolorum odio architecto adipisci officia, possimus quibusdam debitis excepturi?', {
  fontSize: 24,
  fill: 0x1010ff,
  wordWrap: true,
  wordWrapWidth: 180,
});

text.x = 10;
maskContainer.addChild(text);

let elapsed = 0.0;
app.ticker.add(delta => {
  elapsed += delta;
  text.y = 10 + -100.0 + Math.cos(elapsed / 30.0) * 100.0;
});