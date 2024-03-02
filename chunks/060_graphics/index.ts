console.log('Hello from 060_graphics');

import * as PIXI from 'pixi.js';
import '@pixi/graphics-extras';
import { generateRandomColor as grc } from '../../shared/utils';


const app = new PIXI.Application({ antialias: true, resizeTo: window });
globalThis.__PIXI_APP__ = app;

document.body.appendChild(app.view);

const g = new PIXI.Graphics();

// rectangle
g.beginFill(grc());
g.drawRect(50, 50, 100, 100);
g.endFill();

// rectangle + line style 1
g.lineStyle(2, grc(), 1);
g.beginFill(grc());
g.drawRect(200, 50, 100, 100);
g.endFill();

// Rectangle + line style 2
g.lineStyle(10, grc(), 1);
g.beginFill(grc());
g.drawRect(350, 50, 100, 100);
g.endFill();

// Rectangle2
g.lineStyle(2, grc(), 1);
g.beginFill(grc());
g.drawRect(530, 50, 140, 100);
g.endFill();

// circle
g.lineStyle(0); // no outline
g.beginFill(grc(), 1);
g.drawCircle(100, 250, 50);
g.endFill();

// Circle + line style 1
g.lineStyle(2, grc(), 1);
g.beginFill(grc(), 1);
g.drawCircle(250, 250, 50);
g.endFill();

// Circle + line style 2
g.lineStyle(10, grc(), 1);
g.beginFill(grc(), 1);
g.drawCircle(400, 250, 50);
g.endFill();

// Ellipse + line style 2
g.lineStyle(2, grc(), 1);
g.beginFill(grc(), 1);
g.drawEllipse(600, 250, 80, 50);
g.endFill();

// draw a shape
g.beginFill(grc());
g.lineStyle(4, grc(), 1);
g.moveTo(50, 350);
g.lineTo(250, 350);
g.lineTo(100, 400);
g.lineTo(50, 350);
g.closePath();
g.endFill();

// draw a rounded rectangle
g.lineStyle(2, grc(), 1);
g.beginFill(grc(), 0.25);
g.drawRoundedRect(50, 440, 100, 100, 16);

// draw star
g.lineStyle(2, grc());
g.beginFill(grc(), 1);
g.drawStar(360, 370, 5, 50, 10, 23);
g.endFill();

// draw star 2
g.lineStyle(2, grc());
g.beginFill(grc(), 1);
g.drawStar(280, 510, 7, 50);
g.endFill();

// draw star 3
g.lineStyle(4, grc());
g.beginFill(grc(), 1);
g.drawStar(470, 450, 4, 50);
g.endFill();

// draw polygon
const path = [600, 370, 700, 460, 780, 420, 730, 570, 590, 520];

g.lineStyle(0);
g.beginFill(grc(), 1);
g.drawPolygon(path);
g.endFill();



app.stage.addChild(g);