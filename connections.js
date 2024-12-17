// setting relevant variables
const canvas = document.querySelector(".myGame");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);
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

    constructor(title) {
        super();
        this.title = title;
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
        ctx.fillStyle = "rgb(0 150 0)";
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
// add four items to each categorical set
const foodGroups = new Category("THE FOUR MAIN FOOD GROUPS");
foodGroups.add(new Item("CANDY", 0, 0));
foodGroups.add(new Item("CANDY CANES", 0, 1));
foodGroups.add(new Item("CANDY CORN", 0, 2));
foodGroups.add(new Item("SYRUP", 0, 3));
const kevinsFamily = new Category("FAMILY MEMBERS OF KEVIN MCCALLISTER");
kevinsFamily.add(new Item("BUZZ", 1, 0));
kevinsFamily.add(new Item("FRANK", 1, 1));
kevinsFamily.add(new Item("FULLER", 1, 2));
kevinsFamily.add(new Item("LINNIE", 1, 3));
const singers = new Category("CLASSICAL CHRISTMAS SINGERS");
singers.add(new Item("COLE", 2, 0));
singers.add(new Item("CROSBY", 2, 1));
singers.add(new Item("SINATRA", 2, 2));
singers.add(new Item("COMO", 2, 3));
const elves = new Category("ELVES IN CHRISTMAS MOVIES");
elves.add(new Item("BUDDY", 3, 0));
elves.add(new Item("WILLIE", 3, 1));
elves.add(new Item("HERMEY", 3, 2));
elves.add(new Item("MING MING", 3, 3));
const threes = new Category("COME IN SETS OF THREE");
threes.add(new Item("SHIPS", 4, 0));
threes.add(new Item("WISE MEN", 4, 1));
threes.add(new Item("LET IT SNOW", 4, 2));
threes.add(new Item("GHOSTS", 4, 3))
const elfPlaces = new Category("PLACES BUDDY THE ELF VISITED");
elfPlaces.add(new Item("GIMBELS", 5, 0));
elfPlaces.add(new Item("LINCOLN TUNNEL", 5, 1));
elfPlaces.add(new Item("EMPIRE STATE BUILDING", 5, 2));
elfPlaces.add(new Item("CENTRAL PARK", 5, 3))
const cookies = new Category("TYPES OF CHRISTMAS COOKIES");
cookies.add(new Item("SUGAR", 6, 0));
cookies.add(new Item("GINGERBREAD", 6, 1));
cookies.add(new Item("MOLASSES", 6, 2));
cookies.add(new Item("DATE", 6, 3));
const celebrations = new Category("OTHER CELEBRATIONS NEAR CHRISTMAS");
celebrations.add(new Item("HANNUKAH", 7, 0));
celebrations.add(new Item("KWANZAA", 7, 1));
celebrations.add(new Item("BOXING DAY", 7, 2));
celebrations.add(new Item("NEW YEARS", 7, 3));
const movieStars = new Category("STARS OF MULTIPLE CHRISTMAS MOVIES");
movieStars.add(new Item("ALLEN", 8, 0));
movieStars.add(new Item("VAUGHN", 8, 1));
movieStars.add(new Item("BILLINGSLEY", 8, 2));
movieStars.add(new Item("FAVREAU", 8, 3));
const advent = new Category("ADVENT CANDLE THEMES");
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
celebrations.forEach(item => itemsLeft.add(item));
movieStars.forEach(item => itemsLeft.add(item));
advent.forEach(item => itemsLeft.add(item));
// set for the 0-4 selected items, initially empty
const selected = new Set();
// set for the solved categories, initially empty
const solved = new Set();

function handleMouseClick(clickX, clickY) {
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
        } else if (celebrations.contains(selected)) {
            celebrations.solve();
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

function draw() {
    
    // clear screen
    ctx.fillStyle = "rgb(150 0 0)";
    ctx.fillRect(0, 0, width, height);

    // draw buttons at the bottom
    if (selected.size > 0) {
        deselect.drawButton("rgb(0 0 0)", "rgb(255 255 255)");
    } else {
        deselect.drawButton("rgb(150 150 150)", "rgb(0 0 0)");
    }
    if (selected.size === 4) {
        submit.drawButton("rgb(0 0 0)", "rgb(255 255 255)");
    } else {
        submit.drawButton("rgb(150 150 150)", "rgb(0 0 0)");
    }
    shuffler.drawButton("rgb(0 0 0)", "rgb(255 255 255)");

    // draw item buttons
    itemsLeft.forEach(item => item.drawButton());
    solved.forEach(category => category.drawCategory());

    // refresh
    window.requestAnimationFrame(draw);
}

// start animation
shuffle();
draw()