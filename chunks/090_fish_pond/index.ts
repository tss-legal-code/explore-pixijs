import { generateRandomColor as grc } from '../../shared/utils';
import { Application, Assets, Container, Sprite } from 'pixi.js';

function getApp() {
  const app = new Application({ background: grc(), resizeTo: window });
  (app.view as HTMLCanvasElement).classList.add("main-app-view");
  document.body.appendChild(app.view as HTMLCanvasElement);
  return app;
}

async function preloadAssets() {
  const assets = [
    { alias: 'background', src: 'https://pixijs.com/assets/tutorials/fish-pond/pond_background.jpg' },
    { alias: 'fish1', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish1.png' },
    { alias: 'fish2', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish2.png' },
    { alias: 'fish3', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish3.png' },
    { alias: 'fish4', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish4.png' },
    { alias: 'fish5', src: 'https://pixijs.com/assets/tutorials/fish-pond/fish5.png' },
    { alias: 'overlay', src: 'https://pixijs.com/assets/tutorials/fish-pond/wave_overlay.png' },
    { alias: 'displacement', src: 'https://pixijs.com/assets/tutorials/fish-pond/displacement_map.png' },
  ];
  await Assets.load(assets);
}

function addBackground(app) {
  const background = Sprite.from('background');
  background.anchor.set(0.5);

  background.height = app.screen.width > app.screen.height
    ? app.screen.width
    : app.screen.height;
  background.scale.x = background.scale.y;

  background.x = app.screen.width / 2;
  background.y = app.screen.height / 2;

  app.stage.addChild(background);
}

type Fish = Sprite & {
  direction: number;
  speed: number;
  turnSpeed: number;
};

function getFishes(app) {
  const container = new Container();
  app.stage.addChild(container);

  const fishes: Fish[] = [];
  const count = 20;
  const skins = ['fish1', 'fish2', 'fish3', 'fish4', 'fish5'];

  for (let i = 0; i < count; i++) {
    const skin = skins[i % skins.length];
    const fish = Sprite.from(skin) as Fish;
    fish.anchor.set(0.5);

    fish.direction = Math.random() * Math.PI * 2;
    fish.speed = 2 + Math.random() * 2;
    fish.turnSpeed = Math.random() - 0.8;

    fish.x = Math.random() * app.screen.width;
    fish.y = Math.random() * app.screen.height;
    fish.scale.set(0.5 + Math.random() * 0.2);

    container.addChild(fish);
    fishes.push(fish);
  }

  return fishes;
};

function animateFishes(app, fishes, delta) {
  const padding = 100;
  const width = app.screen.width + padding * 2;
  const height = app.screen.height + padding * 2;

  fishes.forEach(fish => {
    fish.direction += fish.turnSpeed * 0.01 * delta;
    fish.x += Math.sin(fish.direction) * fish.speed * delta;
    fish.y += Math.cos(fish.direction) * fish.speed * delta;
    fish.rotation = -fish.direction - Math.PI / 2;
    if (fish.x < -padding) {
      fish.x += width;
    } else if (fish.x > app.screen.width + padding) {
      fish.x -= width;
    }
    if (fish.y < -padding) {
      fish.y += height;
    } else if (fish.y > app.screen.height + padding) {
      fish.y -= height;
    }
  });
};

async function main() {
  const app = getApp();
  await preloadAssets();
  addBackground(app);
  const fishes = getFishes(app);
  app.ticker.add((delta) => {
    animateFishes(app, fishes, delta);
  });
}

main();
console.log('Hello from 090_fish_pond');
