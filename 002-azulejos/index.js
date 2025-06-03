// Color schemes
// #2e90e2, #00dfff, #cccccc

const backgroundColor = '#ffffff';
const mainColor = "#2e90e2"
const highlightColor = '#00dfff';
const shadeColor = '#cccccc';

const FPS = 30;

// Different tile types
class Tile {
    constructor(x0, y0, pattern, tile_size) {
      this.container = new PIXI.Container();
      this.pattern = pattern;
      this.tile_size = tile_size;
      this.x0 = x0;
      this.y0 = y0;
      this.frame = 0;
      this.tick = 0;
      this.draw_outline();
    }

    update(){
        this.tick += 1;
        if (this.tick % FPS == 0){ // Slow down animation
            if ( this.frame <= 5 ){
                console.log("tick: "+ this.tick + " | frame: " + this.frame);
                if (this.pattern == 'A') {
                    this.draw_pattern_A();
                }else if (this.pattern == 'B') {
                    // pattern B: 4 triangles in each corner, a flower in the middle with the center dot, and a diamond shaped decoration sprawling from the center of the flower

                }else if (this.pattern = 'C'){

                }else if (this.pattern = 'D'){

                }
                console.log("└── children: " + this.container.children.length);
                this.frame += 1;
            } else {
                // Clear tile and start over
                this.container.removeChildren(1, this.container.children.length)
                this.frame = 0;
            }
        }
    }

    draw_outline (){
        // Draw initial outline
        const outline = new PIXI.Graphics();
        outline.lineStyle({ color: shadeColor , width: 2});
        outline.drawRect(this.x0, this.y0, this.tile_size, this.tile_size);
        this.container.addChild(outline);
    }

    draw_pattern_A(){
        // pattern A: 4 leaf flower decorated with dots halfway through the y and x dots
        const rows = 4;
        const cols = 4;

        const xoffset = 25;
        const yoffset = 25;
        const inner_tile_size = 25

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j <  cols; j++) {

                let x = this.x0 + i * xoffset;
                let y = this.y0 + j * yoffset;

                // frame 0: draw inner grid lines
                if ( this.frame == 0 ){
                    const inner_grid = new PIXI.Container();
                    inner_grid.addChild((
                        new PIXI.Graphics()
                        .lineStyle({ color: shadeColor, width: 0.5 })
                        .drawRect(x, y, inner_tile_size, inner_tile_size)
                    ));
                    this.container.addChild(inner_grid);
                    // console.log("├──  inner grid at: " + this.container.children.length);
                }

                // frame 1: draw first petals in one direction
                if ( this.frame == 1 ){
                    if ( (i+j) % 2 == 0 ){
                        const petal = new PIXI.Graphics();
                        petal.beginFill(mainColor);
                        petal.drawEllipse(0, 0, 6, 12);
                        petal.endFill();
                        petal.x = x + xoffset/2;
                        petal.y = y + yoffset/2;
                        petal.rotation = -Math.PI / 4; // Rotate by -45 degrees

                        this.container.addChild(petal);
                    }
                }

                //frame 2: draw more petals in the other direction
                if ( this.frame == 2 ){
                    if ( (i+j) % 2 == 1 ){
                        const petalinv = new PIXI.Graphics();
                        petalinv.beginFill(mainColor);
                        petalinv.drawEllipse(0, 0, 6, 12);
                        petalinv.endFill();
                        petalinv.x = x + xoffset/2;
                        petalinv.y = y + yoffset/2;
                        petalinv.rotation = Math.PI / 4; // Rotate by -45 degrees

                        this.container.addChild(petalinv);
                    }
                }

                //frame 3: decorate with dots halfway through the y and x dots
                if ( this.frame == 4 ){
                    if ( (i == 2 || j == 2) && i != 0 && j != 0 && i != j ){
                        const dots = new PIXI.Graphics();
                        dots.beginFill(highlightColor);
                        dots.drawCircle(x, y, 3);

                        this.container.addChild(dots)
                    }
                }
            }
        }

        if ( this.frame == 5 ){
            // Remove inner grid outline
            this.container.removeChildren(1, 17);
        }

    }

}

window.addEventListener('DOMContentLoaded', () => {
    // Create a Pixi Application
    const app = new PIXI.Application({
        autoResize: true,
        antialias: true,
        backgroundColor: backgroundColor,
        resizeTo: window,
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Add the canvas to the HTML document
    document.body.appendChild(app.view);

    // Create the grid
    const cols = 20;
    const rows = 40;
    // const cols = 0;
    // const rows = 0;
    const azulejos = [];

    const xoffset = 100;
    const yoffset = 100;
    const tile_size = 100;

    const ticker = new PIXI.Ticker();
    ticker.autoStart = false;

    // Draw entire screen
    for (let i = 0; i <= rows; i++) {
        for (let j = 0; j <= cols; j++) {

            const x = i * xoffset;
            const y = j * yoffset;

            const tile = new Tile(x, y, 'A', tile_size);
            azulejos.push(tile);

            // Add tile to the scene
            app.stage.addChild(tile.container);

            ticker.add((ticker) => {
                tile.update();
            });
        }
    }
    ticker.start();

});
