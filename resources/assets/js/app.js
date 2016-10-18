class Game {

    constructor() {

        this.speed = 50;
        this.screen = $(window).width(); // screen width
        this.steps = Math.floor(this.screen/180); // how many steps (stick width + margin) it takes from one end to another
        this.timeline = new TimelineMax();
        this.balltween = new TimelineMax({repeat: -1});
        this.time = 2 - this.speed/100;
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.colorsRGBA = ["rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)"];
        this.color = this.colors[0];
        this.prevColor = null;
        this.effects = ["bubble", "triangle", "block"];
        this.effects = ["bubble", "bubble", "bubble"];

        for(let i = 0; i <= this.steps; i++)
            new Stick();

        //this.bounce();
        this.start();
        //console.log(this.getRandomColor());
    }

    start() {
        this.moveToStart();
        this.moveScene();
    }

    getRandomColor() {
        let colorIndex = Math.random()*2;
        let color = this.colors[Math.round(colorIndex)];
        console.log(color);
        return color;
    }   

    getRandomEffect() {
        let effectIndex = Math.random()*2;
        return this.effects[Math.round(effectIndex)];
    }   

    changeColor(el) {
        let index = el.data("index");
        if(index===undefined) { index = 0; }
        else { index += 1; }
        if(index==3) index = 0;
        el
            .css('background-color', this.colors[index])
            .data('index', index);

        if(el.hasClass('inactive'))
            this.setEffect(el);
        
        el.removeClass('inactive');
        el.addClass('no-effect');
    }

    setEffect(el) {
        let effect = this.getRandomEffect();
        el.addClass(effect + '-stick');
        for(let i = 1; i <= 14; i++) {
            el.append('<div class="'+ effect +' '+ effect +'-'+ i +'"></div>');
        }
    }

    moveToStart() {        

        TweenMax.to('#ball', this.time, {bezier:[{left:340, top:70}, {left:378, top:241}], ease:Power1.easeIn, delay: this.time * (this.steps - 2) - this.time, onComplete: () => {
            this.bounce();
        }});

        this.timeline.add(
            TweenMax.fromTo('#sticks', this.time * this.steps, { x: this.screen }, { x: 0, ease: Power0.easeNone})
        );
    }

    moveScene() {

        this.timeline.add(
            TweenMax.to('#sticks', this.time, { x: '-=180px', ease: Power0.easeNone, repeat: -1, onRepeat: () => { this.rearrange() } })
        );

    }  

    /**
     * removes the first stick and adds one the the end
     * this gives the sticks an infinite movement
     */
    rearrange() {

        $('#sticks .stick').first().remove();
        new Stick();

    }

    bounce() {

        this.balltween
                .to('#ball', this.time/2, {y: '-=200px', scaleY: 1.1, transformOrigin: "bottom", ease: Power2.easeOut, onStart: () => {
                    while(this.prevColor==this.color) {
                        this.color = this.getRandomColor();
                    }
                    this.prevColor = this.color;
                    TweenMax.to('#ball', 0.5, {backgroundColor: this.color});
                }})
                .to('#ball', this.time/2, {y: '+=200px', scaleY: 0.7, transformOrigin: "bottom", ease: Power2.easeIn, onComplete: this.checkColor})    
    }

    checkColor() {

        let ballPos = $('#ball').offset().left + $('#ball').width()/2;
        let stickWidth = $('.stick').width();

        $('#sticks .stick').each(function(){
            if($(this).offset().left < ballPos && $(this).offset().left > (ballPos - stickWidth)) {
                
                //

            }
        })
    }

}

class Stick {

    constructor() {
        this.stick = this.addStick();
        //this.setHeight();
    }

    addStick() {
        this.stick = $('#sticks').append('<div class="stick inactive"></div>');
        return this.stick;
    }

    setHeight() {
        this.stick.css('height', '50px');
    }

}