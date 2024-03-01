import * as PIXI from 'pixi.js';

let app = new PIXI.Application({ width: 840, height: 840 });
// enable dev tools
globalThis.__PIXI_APP__ = app;
//
document.body.appendChild(app.view);
let sprite = PIXI.Sprite.from("./assets/sample.png");
let sprite2 = PIXI.Sprite.from("./assets/sample.png");
app.stage.addChild(sprite);
app.stage.addChild(sprite2);

// Add a variable to count up the seconds our demo has been running
let elapsed = 0.0;
// Tell our application's ticker to run a new callback every frame, passing
// in the amount of time that has passed since the last tick
app.ticker.add((delta) => {
  // Add the time to our total elapsed time
  elapsed += delta;
  // Update the sprite's X position based on the cosine of our elapsed time.  We divide
  // by 50 to slow the animation down a bit...
  sprite.x = 100.0 + Math.cos(elapsed / 100.0) * 100.0;
  sprite2.x = 100.0 - Math.cos(elapsed / 100.0) * 100.0;
});