import * as PIXI from 'pixi.js';
import { generateRandomColor as grc } from '../../shared/utils';

const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: grc()
});
app.renderer.view.style.position = "absolute";
globalThis.__PIXI_APP__ = app;
document.body.appendChild(app.view);
console.log('Hello from 080_sprites');