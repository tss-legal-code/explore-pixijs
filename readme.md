# learning pixi js and writing a simple game

# build remarks

each `chunk` in the `chunks` folder is built separately

you may select which chunk to build by `chunkSelectionRules` in the `webpack.config.js`

> NOTE assets are all merged together during build phase (webpack limitations i did not overcome )
> so it is recommentded to avoid using same filenames for different files

# grenerate chunk

command:

`yarn grenerate <CHUNK_NAME>`

creates an initial playground for next 'learning step'

# start project

command:

`yarn dev`

# pixijs resources

https://pixijs.com/guides
https://pixijs.download/release/docs/PIXI.DisplayObject.html
https://api.pixijs.io/@pixi/sprite/PIXI/Sprite.html
