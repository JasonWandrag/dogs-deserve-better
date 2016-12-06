//ninivert, november 2016



/* UTILITY FUNCTIONS */

var rnd = {
    btwn: function(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    choose: function(list) {
        return list[rnd.btwn(0, list.length)];
    }
};



/* SOUP OBJECT */

//create a global object that will contain all of our functions
var Soup;

Soup = {
    //set canvas options
    canvas: document.getElementsByTagName('canvas')[0],
    w: document.body.clientWidth,
    h: document.documentElement.scrollHeight,
    ctx: document.getElementsByTagName('canvas')[0].getContext('2d'),

    //set other options
    imgMode: true, //images can be turned on or off
    baseSize: 20, //base size for letters and images
    charList: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's',
     't', 'u', 'v', 'w', 'x', 'y', 'z'], //list of useable characters
    charColor: ['#fff', '#eee', '#ccc', '#bbb', '#aaa'], //font color
    charFont: 'Courier', //font
    imgList: ['assets/img/mini-blk.png'], //list of images, we will generate the elements on initialisation
    //layer options
    layers: {
        n: [100, 40, 30, 20, 10], //letters or images per layer
        devCoef: [0.1, 0.2, 0.4, 0.6, 0.8], //deviation coefficient
        sizeCoef: [0.4, 0.5, 0.6, 0.8, 1.0] //size coefficient
    },

    objects: [],

    mouseX: document.body.clientWidth/2,
    mouseY: document.body.clientHeight/2
};
//I could add an options to add different layers and automatically change n, devCoef, sizeCoef and charColor, but meh, I'm lazy
//I could add a thing to differentiate text size and image size but still meh, I'm lazy

//intialising function
Soup.init = function () {
    Soup.canvas.width = Soup.w;
    Soup.canvas.height = Soup.h;

    //create the img elements, if enabled
    if (Soup.imgMode) {
        for (var i in Soup.imgList) {
            var img = new Image();
            img.src = Soup.imgList[i];
            Soup.imgList[i] = img;
        }
    }

    //add the elements to the objects array
    for (var i = 0; i < Soup.layers.n.length; i++) {
        for (var j = 0; j < Soup.layers.n[i]; j++) {
            Soup.objects.push({
                x: rnd.btwn(0, Soup.w),
                y: rnd.btwn(0, Soup.h),
                obj: Soup.imgMode ? rnd.choose(Soup.imgList) : rnd.choose(Soup.charList),
                color: Soup.imgMode ? null : Soup.charColor[i],
                font: Soup.imgMode ? null : Soup.charFont,
                layer: i,
                coef: Soup.layers.devCoef[i],
                size: Soup.layers.sizeCoef[i] * Soup.baseSize
            });
        }
    }
}



/* RENDERING */

document.onmousemove = function(ev) {
    //update mouse positions
    Soup.mouseX = ev.pageX - Soup.canvas.offsetLeft;
    Soup.mouseY = ev.pageY - Soup.canvas.offsetTop;

    //request a frame
    if (window.requestAnimationFrame) {
        requestAnimationFrame(function () {
            Soup.update();
        });
    } else {
        Soup.update();
    }
};

Soup.update = function () {
    Soup.clear();
    Soup.render();
};

Soup.clear = function () {
    Soup.ctx.clearRect(0, 0, Soup.w, Soup.h);
};

Soup.render = function () {
    for (var i = 0; i < Soup.objects.length; i++) {
        Soup.drawObj(Soup.objects[i]);
    }
};

Soup.drawObj = function (obj) {
    var x = obj.x + (Soup.mouseX-Soup.w/2)*obj.coef;
    var y = obj.y + (Soup.mouseY-Soup.h/2)*obj.coef;

    if (Soup.imgMode) {
        Soup.ctx.drawImage(obj.obj, x-obj.size/2, y-obj.size/2, obj.size, obj.size);
    } else {
        Soup.ctx.font = obj.size + 'px ' + obj.font;
        Soup.ctx.fillStyle = obj.color;
        Soup.ctx.fillText(obj.obj, x, y);
    }
}



/* LAUNCH THE MACHINE! */

window.onload = function () {
    Soup.init();
    if (window.requestAnimationFrame) {
        requestAnimationFrame(function () {
            Soup.update();
        });
    } else {
        Soup.update();
    }
};
