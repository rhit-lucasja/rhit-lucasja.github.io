// setting relevant variables
const canvas = document.querySelector(".myGame");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight * 0.95);
const ctx = canvas.getContext("2d");
canvas.addEventListener("click", function (e) {
    handleMouseClick(e.clientX - canvas.getBoundingClientRect().x, e.clientY - canvas.getBoundingClientRect().y);
});

class Button {

    constructor(text, x, y, w, h) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    drawButton(fillColor, fontColor) {
        ctx.fillStyle = fillColor;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle = fontColor;
        let fontSize = 36;
        ctx.font = `${fontSize}px arial`;
        while (ctx.measureText(this.text).width > this.w - 10 ||
                ctx.measureText(this.text).actualBoundingBoxAscent + 
                ctx.measureText(this.text).actualBoundingBoxDescent > this.h - 10) {
            fontSize--;
            ctx.font = `${fontSize}px arial`;
        }
        ctx.fillText(this.text,
            this.x + this.w / 2 - ctx.measureText(this.text).width / 2,
            this.y + this.h / 2 + (ctx.measureText(this.text).actualBoundingBoxAscent +
            ctx.measureText(this.text).actualBoundingBoxDescent) / 2);
    }

    contains(clickX, clickY) {
        return (clickX >= this.x && clickX <= this.x + this.w
            && clickY >= this.y && clickY <= this.y + this.h);
    }
}

class Item extends Button {

    constructor(text, row, col) {
        let w = (width - 50) / 4;
        let h = (height - 170) / 10;
        super(text, 10 + col * (w + 10), 10 + row * (h + 10), w, h);
    }

    drawButton() {
        if (selected.has(this)) {
            super.drawButton("rgb(0 0 0)", "rgb(255 255 255)");
        } else {
            super.drawButton("rgb(175 100 100)", "rgb(0 0 0)");
        }
    }

    relocate(row, col) {
        this.x = 10 + col * (this.w + 10);
        this.y = 10 + row * (this.h + 10);
    }
}

class Category extends Set {

    constructor(title, difficulty) {
        super();
        this.title = title;
        // determine color to draw based on difficulty
        switch (difficulty) {
            case "baby":
                this.color = "rgb(175 175 0)";
                break;
            case "easy":
                this.color = "rgb(0 150 0)";
                break;
            case "medium":
                this.color = "rgb(100 100 150)";
                break;
            case "hard":
                this.color = "rgb(150 50 150)";
                break;
            default:
                this.color = "rgb(150 150 150)";
        }
    }

    contains(subset) {
        let count = 0;
        for (const item of subset) {
            if (this.has(item)) {
                count++;
            }
        }
        return count === 4;
    }

    solve() {
        this.num = solved.size;
        solved.add(this);
        for (const item of selected) {
            itemsLeft.delete(item);
            selected.delete(item);
        }
        shuffle();
    }

    drawCategory() {
        ctx.fillStyle = this.color;
        let w = (width - 20);
        let h = (height - 170) / 10;
        ctx.fillRect(10, 10 + this.num * (h + 10), w, h);
        ctx.fillStyle = "rgb(0 0 0)";
        let text = "";
        this.forEach(item => text = text.concat(item.text, ", "));
        text = text.substring(0, text.length - 2);
        let fontSize = 24;
        ctx.font = `${fontSize}px arial`;
        while (ctx.measureText(text).width > w - 10 ||
                ctx.measureText(this.title).width > w - 10 ||
                ctx.measureText(text).actualBoundingBoxAscent +
                ctx.measureText(text).actualBoundingBoxDescent +
                ctx.measureText(this.title).actualBoundingBoxAscent +
                ctx.measureText(this.title).actualBoundingBoxDescent > h - 10) {
            fontSize--;
            ctx.font = `${fontSize}px arial`;
        }
        ctx.fillText(this.title,
            10 + w / 2 - ctx.measureText(this.title).width / 2,
            10 + this.num * (h + 10) + h / 4 + (ctx.measureText(this.title).actualBoundingBoxAscent +
            ctx.measureText(this.title).actualBoundingBoxDescent) / 2);
        ctx.fillText(text,
            10 + w / 2 - ctx.measureText(text).width / 2,
            10 + this.num * (h + 10) + 3 * h / 4 + (ctx.measureText(text).actualBoundingBoxAscent +
            ctx.measureText(text).actualBoundingBoxDescent) / 2);
    }

}

// setup
const shuffler = new Button("Shuffle", width / 2 - 160, height - 60, 100, 50);
const deselect = new Button("Deselect All", width / 2 - 50, height - 60, 100, 50);
const submit = new Button("Submit", width / 2 + 60, height - 60, 100, 50);
const start = new Button("Start", width / 2 - 50, height - getMsgBoxY(getMsgBoxH()) - 60, 100, 50);
// add four items to each categorical set
const foodGroups = new Category("THE FOUR MAIN FOOD GROUPS", "baby");
foodGroups.add(new Item("CANDY", 0, 0));
foodGroups.add(new Item("CANDY CANES", 0, 1));
foodGroups.add(new Item("CANDY CORN", 0, 2));
foodGroups.add(new Item("SYRUP", 0, 3));
const kevinsFamily = new Category("MCCALLISTER FAMILY MEMBERS", "hard");
kevinsFamily.add(new Item("KEVIN", 1, 0));
kevinsFamily.add(new Item("BUZZ", 1, 1));
kevinsFamily.add(new Item("FRANK", 1, 2));
kevinsFamily.add(new Item("FULLER", 1, 3));
const singers = new Category("CLASSICAL CHRISTMAS SINGERS", "easy");
singers.add(new Item("COLE", 2, 0));
singers.add(new Item("CROSBY", 2, 1));
singers.add(new Item("SINATRA", 2, 2));
singers.add(new Item("COMO", 2, 3));
const elves = new Category("ELVES IN CHRISTMAS MOVIES", "medium");
elves.add(new Item("BUDDY", 3, 0));
elves.add(new Item("WILLIE", 3, 1));
elves.add(new Item("HERMEY", 3, 2));
elves.add(new Item("MING MING", 3, 3));
const threes = new Category("COME IN SETS OF THREE", "hard");
threes.add(new Item("SHIPS", 4, 0));
threes.add(new Item("WISE MEN", 4, 1));
threes.add(new Item("LET IT SNOW", 4, 2));
threes.add(new Item("GHOSTS", 4, 3))
const elfPlaces = new Category("PLACES IN \'ELF\'", "medium");
elfPlaces.add(new Item("GIMBELS", 5, 0));
elfPlaces.add(new Item("LINCOLN TUNNEL", 5, 1));
elfPlaces.add(new Item("NORTH POLE", 5, 2));
elfPlaces.add(new Item("CENTRAL PARK", 5, 3))
const cookies = new Category("TYPES OF CHRISTMAS COOKIES", "easy");
cookies.add(new Item("SUGAR", 6, 0));
cookies.add(new Item("GINGERBREAD", 6, 1));
cookies.add(new Item("MOLASSES", 6, 2));
cookies.add(new Item("DATE", 6, 3));
const blankChristmas = new Category("_____ CHRISTMAS", "easy");
blankChristmas.add(new Item("MERRY", 7, 0));
blankChristmas.add(new Item("WHITE", 7, 1));
blankChristmas.add(new Item("LAST", 7, 2));
blankChristmas.add(new Item("BLUE", 7, 3));
const movieStars = new Category("FEATURED IN MULTIPLE CHRISTMAS MOVIES", "medium");
movieStars.add(new Item("ALLEN", 8, 0));
movieStars.add(new Item("VAUGHN", 8, 1));
movieStars.add(new Item("BILLINGSLEY", 8, 2));
movieStars.add(new Item("FAVREAU", 8, 3));
const advent = new Category("ADVENT CANDLE THEMES", "baby");
advent.add(new Item("HOPE", 9, 0));
advent.add(new Item("PEACE", 9, 1));
advent.add(new Item("JOY", 9, 2));
advent.add(new Item("LOVE", 9, 3));
// add all to the main gameplay set
const itemsLeft = new Set();
foodGroups.forEach(item => itemsLeft.add(item));
kevinsFamily.forEach(item => itemsLeft.add(item));
singers.forEach(item => itemsLeft.add(item));
elves.forEach(item => itemsLeft.add(item));
threes.forEach(item => itemsLeft.add(item));
elfPlaces.forEach(item => itemsLeft.add(item));
cookies.forEach(item => itemsLeft.add(item));
blankChristmas.forEach(item => itemsLeft.add(item));
movieStars.forEach(item => itemsLeft.add(item));
advent.forEach(item => itemsLeft.add(item));
// set for the 0-4 selected items, initially empty
const selected = new Set();
// set for the solved categories, initially empty
const solved = new Set();

function handleMouseClick(clickX, clickY) {
    if (active) {
        if (deselect.contains(clickX, clickY)) {
            deselectAll();
        } else if (submit.contains(clickX, clickY)) {
            submitGuess();
        } else if (shuffler.contains(clickX, clickY)) {
            shuffle();
        } else {
            itemsLeft.forEach(item => {
                if (item.contains(clickX, clickY)) {
                    clickItem(item);
                }
            });
        }
    } else {
        if (start.contains(clickX, clickY)) {
            active = true;
        }
    }
}

function clickItem(item) {
    if (selected.has(item)) {
        selected.delete(item);
    } else if (selected.size < 4) {
        selected.add(item);
    }
}

function deselectAll() {
    if (selected.size > 0) {
        selected.forEach(item => selected.delete(item));
    }
}

function submitGuess() {
    if (selected.size === 4) {
        if (foodGroups.contains(selected)) {
            foodGroups.solve();
        } else if (kevinsFamily.contains(selected)) {
            kevinsFamily.solve();
        } else if (singers.contains(selected)) {
            singers.solve();
        } else if (elves.contains(selected)) {
            elves.solve();
        } else if (threes.contains(selected)) {
            threes.solve();
        } else if (elfPlaces.contains(selected)) {
            elfPlaces.solve();
        } else if (cookies.contains(selected)) {
            cookies.solve();
        } else if (blankChristmas.contains(selected)) {
            blankChristmas.solve();
        } else if (movieStars.contains(selected)) {
            movieStars.solve();
        } else if (advent.contains(selected)) {
            advent.solve();
        } else {
            wrong();
        }
    }
}

function wrong() {
    for (const item of selected) {
        selected.delete(item);
    }
}

function assignLocations() {
    let i = 4 * solved.size;
    for (const item of itemsLeft) {
        row = Math.floor(i / 4);
        col = i % 4;
        item.relocate(row, col);
        i++;
    }
}

function shuffle() {
    let array = Array.from(itemsLeft);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    itemsLeft.forEach(item => itemsLeft.delete(item));
    array.forEach(item => itemsLeft.add(item));
    assignLocations();
}

function wrapText(string, boxX, boxY, boxW, boxH, size, final) {
    // draw box and setup font with current size
    ctx.fillStyle = "rgb(119 153 119)";
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.fillStyle = "rgb(0 0 0)";
    ctx.font = `${size}px arial`;

    const words = string.split(" ");
    let line = "";
    let n = 1;
    for (let i = 0; i < words.length; i++) {
        let test = line + words[i] + " ";
        if (ctx.measureText(test).width > boxW && i > 0) {
            if (final) {
                line = line.trimEnd();
                ctx.fillText(line, boxX + boxW / 2 - ctx.measureText(line).width / 2,
                    boxY + 10 + n * size);
            }
            n++;
            line = words[i] + " ";
        } else { // keep adding to line
            line = test;
        }
    }
    if (final) {
        line = line.trimEnd();
        ctx.fillText(line, boxX + boxW / 2 - ctx.measureText(line).width / 2,
            boxY + 10 + n * size);
    }
    n++;

    // increase font size if plenty of room to do so
    if (!final) {
        if ((n - 1) * size > boxH - 70) {
            wrapText(string, boxX, boxY, boxW, boxH, size - 3, true);
        } else {
            wrapText(string, boxX, boxY, boxW, boxH, size + 3, false);
        }
    }
}

function getMsgBoxW() {
    return Math.min(width - 100, 800);
}
function getMsgBoxH() {
    return Math.min(height - 100, 600);
}
function getMsgBoxX(bW) {
    return (width - bW) / 2;
}
function getMsgBoxY(bH) {
    return (height - bH) / 2;
}

function draw() {
    
    // clear screen
    ctx.fillStyle = "rgb(150 0 0)";
    ctx.fillRect(0, 0, width, height);

    // draw buttons at the bottom
    if (selected.size > 0) {
        deselect.drawButton("rgb(0 150 0)", "rgb(0 0 0)");
    } else {
        deselect.drawButton("rgb(150 150 150)", "rgb(0 0 0)");
    }
    if (selected.size === 4) {
        submit.drawButton("rgb(0 150 0)", "rgb(0 0 0)");
    } else {
        submit.drawButton("rgb(150 150 150)", "rgb(0 0 0)");
    }
    shuffler.drawButton("rgb(0 150 0)", "rgb(0 0 0)");

    // draw item buttons
    itemsLeft.forEach(item => item.drawButton());
    solved.forEach(category => category.drawCategory());

    // draw message box before game start
    if (!active) {
        let bW = getMsgBoxW();
        let bH = getMsgBoxH();
        let bX = getMsgBoxX(bW);
        let bY = getMsgBoxY(bH);
        // message box and description of the game
        const msgString = "For the past few years, my siblings and I have each created a puzzle or game for Christmas. In a friendly competition, our family races to see who can finish each puzzle first. In 2024, I decided to acquire some new JavaScript knowledge by creating the game (based on the New York Times' Connections) completely online. Click start to try the puzzle for yourself!";
        wrapText(msgString, bX, bY, bW, bH, 10, false);
        // start button
        start.drawButton("rgb(85 119 85", "rgb(0 0 0)");
    }

    // refresh
    window.requestAnimationFrame(draw);
}

// start animated screen
let active = false;
shuffle();
draw();