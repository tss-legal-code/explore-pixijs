import { generateRandomColor as grc } from '../../shared/utils';
import { Application, Assets } from 'pixi.js';

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

async function main() {
  await preloadAssets();
  const app = getApp();
}





main();
console.log('Hello from 090_fish_pond');
