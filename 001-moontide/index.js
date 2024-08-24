// Color schemes
// #140441, #978faf
// #140441, #dced69 !
// #140441, #fe54bc
// #140441, #d0e85c
// #281861, #e9c202
// #1b709e, #e3fc2e
// #263138, #f68acd
// #230036, #d6794f
// #181b29, #c9a45d

const backgroundColor = '#140441';
const mainColor = '#dced69';

class Moon {
    constructor(phase, moon_graphic) {
      this.phase = phase;
      this.graphic = moon_graphic;
    }

    update (x, y, radius){
        this.graphic.clear();
        this.graphic.lineStyle({ color: mainColor, alpha: 0.40, width: 0.5 });
        // Moon phase cuttout
        if (this.phase == "first_quarter" || this.phase == "third_quarter") {
            this.graphic.beginFill(mainColor)
                .drawCircle(x, y, radius)
                .endFill()
                .beginFill(backgroundColor)
                .lineStyle({ color: backgroundColor, alpha: 0.87, width: 1 });
            if (this.phase == "first_quarter")
                this.graphic.drawRect(x - radius, y - radius, radius, radius * 2);
            if (this.phase == "third_quarter")
                this.graphic.drawRect(x, y - radius, radius, radius * 2);
            this.graphic.endFill()
                .lineStyle({ color: mainColor, alpha: 0.3, width: 2 })
                .drawRect(x, y - radius, 1, radius * 2)
        } else if (this.phase == "new" || this.phase == "full") {
            if (this.phase == "full") { this.graphic.beginFill(mainColor) };
            this.graphic.drawCircle(x, y, radius);
        } else if (this.phase == "waning_gibbous" || this.phase == "waxing_gibbous") {
            this.graphic.beginFill(mainColor, 0.3) //could be background color
                .lineStyle({ color: mainColor, alpha: 0.3, width: 1 })
                .drawCircle(x, y, radius)
                .endFill()
                .beginFill(mainColor);
            if (this.phase == "waning_gibbous")
                this.graphic.drawEllipse(x - radius * 0.2, y, radius * 0.8, radius);
            if (this.phase == "waxing_gibbous")
                this.graphic.drawEllipse(x + radius * 0.2, y, radius * 0.8, radius);
        } else if (this.phase == "waxing_crescent" || this.phase == "waning_crescent") {
            this.graphic.beginFill(mainColor)
                .drawCircle(x, y, radius)
                .endFill()
                .beginFill(backgroundColor) // could be background color
                .lineStyle({ color: backgroundColor, alpha: 0.87, width: 1 });
            if (this.phase == "waxing_crescent")
                this.graphic.drawEllipse(x - radius * 0.9, y, radius * 0.8, radius);
            if (this.phase == "waning_crescent")
                this.graphic.drawEllipse(x + radius * 0.9, y, radius * 0.8, radius);
        }
        this.graphic.endFill();
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
    const moons = [];

    const xoffset = 50;
    const yoffset = 50;

    let idx = 0;

    // Define moon phases
    const phases = [
        "waning_gibbous",
        "full",
        "waxing_gibbous",
        "first_quarter",
        "waxing_crescent",
        "new",
        "waning_crescent",
        "third_quarter",
    ];

    let phase = phases[0 % phases.length];

    // Draw entire screen
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {

            // Tide maths
            const tideLevel = idx * 0.02;
            const radius = Math.sin(tideLevel) * 8 + 10;

            const y = j * xoffset - radius;
            const x = i * yoffset - radius;

            // Create moon instance
            let moon = new Moon(
                phase,
                new PIXI.Graphics()
            );
            moon.update(x, y, radius);
            moons.push(moon);

            // Add moon to the scene
            app.stage.addChild(moon.graphic);

            // Animate tide
            let current_idx = idx;
            app.ticker.add(() => {
                current_idx += 1;
                let updated_tideLevel = current_idx * 0.02;
                let updated_radius = Math.sin(updated_tideLevel) * 8 + 10;
                moon.update(x, y, updated_radius)
            });

            // Increase tide idx
            idx += 1;
            // Move to the next phase
            phase = phases[j % phases.length];
        }
    }

    // #Poetry
    const style = new PIXI.TextStyle({
        fontFamily: "Georgia",
        dropShadow: {
            color: backgroundColor,
            alpha: 0.8,
            angle: 0.2,
            blur: 4,
            distance: 100,
        },
        fill: mainColor,
        wordWrap: true,
        wordWrapWidth: 440
    });
    const text = new PIXI.Text(
        "Our nearest celestial companion. \nIt pulls us as we pull it. \nWe relate to it as it relates to us.",
        style
    );
    text.x = window.innerWidth/3;
    text.y = window.innerHeight/3;
    text.alpha = 0.1;

    app.stage.addChild(text);

    let elapsed = 0;
    app.ticker.add(() => {
        elapsed += 1;
        if (elapsed < 10)
            text.alpha += 0.1;
        if (elapsed > 100)
            text.alpha -= 0.1;
        console.log(elapsed);
    });


});
