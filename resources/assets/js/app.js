class Game {

    constructor() {


        this.score = 0;
        this.isRunning = 0;

        this.calculateScale();

        this.timeline = new TimelineMax({smoothChildTiming: true});
        this.time = 1; // initial speed
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.colorsRGBA = ["rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)"];
        this.color = this.colors[0];
        this.prevColor = null;
    }

    calculateScale() {
        this.screen = $(window).width(); // screen width
        this.screenHeight = $(window).height();
        this.scale = (this.screen > this.screenHeight) ? this.screenHeight/800 : this.screen/1200;
        this.stickWidth = 180*this.scale;
        this.steps = this.screen/this.stickWidth; // how many steps (stick width + margin) it takes from one end to another
    }

    generateSticks() {
        let numberOfSticks = Math.ceil(this.steps);
        for(let i = 0; i <= numberOfSticks; i++)
            new Stick();
    }

    generateBall() {
        this.balltween = new TimelineMax({repeat: -1, paused: 1});
        $('.scene .ball-holder').append('<div class="ball red" id="ball"></div>');
        this.bounce();
    }

    generateTweet() {
        let top = $(window).height() / 2 - 150;
        let left = $(window).width() / 2 - 300;
        window.open("https://twitter.com/intent/tweet?url=http://codepen.io/greghvns/&amp;text=I scored "+ this.score +" points on Coloron! Can you beat my score? @friends_names&amp;via=greghvns&amp;hashtags=coloron", "TweetWindow", "width=600px,height=300px,top=" + top + ",left=" + left);
    }

    intro() {

        $('.stop-game').css('display', 'none');
        $('.start-game').css('display', 'flex');
        let intro = new TimelineMax();
        let ball = new TimelineMax({repeat: -1, delay: 3})
        intro
            .fromTo('.start-game .logo-holder', 0.9, { opacity: 0 }, { opacity: 1 })
            .staggerFromTo('.start-game .logo span', 0.5, { opacity: 0 }, { opacity: 1 }, 0.08)
            .staggerFromTo('.start-game .bar', 1.6, { y: '+100%' }, { y: '0%', ease: Elastic.easeOut.config(1, 0.3) }, 0.08)
            .staggerFromTo('.start-game .ball-demo', 1, { scale: 0 }, { scale: 1, ease: Elastic.easeOut.config(1, 0.3) }, 0.8, 2)


        ball.to('.start-game .section-1 .ball-demo', 0.5, { y: "100px", scaleY: 1.1, transformOrigin: "bottom", ease: Power2.easeIn})
            .to('.start-game .section-1 .ball-demo', 0.5, { y: "0px", scaleY: 1, transformOrigin: "bottom", ease: Power2.easeOut,  
                    onStart: () => {
                        while(this.prevColor==this.color) {
                            this.color = (new Color).getRandomColor();
                        }
                        this.prevColor = this.color;
                        TweenMax.to('.start-game .section-1 .ball-demo', 0.5, {backgroundColor: this.color});
                    } 
                });
    }

    showResult() {
        let score = this.score;
        $('.stop-game').css('display', 'flex');
        $('.stop-game .final-score').text(score + '!');
        $('.stop-game .result').text(this.showGrade(score));

        let resultTimeline = new TimelineMax();
        resultTimeline
            .fromTo('.stop-game .score-container', 0.7, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, ease: Elastic.easeOut.config(1.25, 0.5)})
            .fromTo('.stop-game .final-score', 2, { scale: 0.5 }, { scale: 1, ease: Elastic.easeOut.config(2, 0.5)}, 0)
            .fromTo('.stop-game .result', 1, { scale: 0.5 }, { scale: 1, ease: Elastic.easeOut.config(1.5, 0.5)}, 0.3)
            ;

    }

    showGrade(score) {
        if(score > 30) return "Chuck Norris?";
        else if(score > 25) return "You're da man";
        else if(score > 20) return "Awesome";
        else if(score > 15) return "Great!";
        else if(score > 13) return "Nice!";
        else if(score > 10) return "Good Job!";
        else if(score > 5) return "Really?";
        else return "Poor...";
    }

    start() {

        this.stop();

        $('.start-game, .stop-game').css('display', 'none');

        new Game();

        this.isRunning = 1;

        this.score = 0;
        $('#sticks, .scene .ball-holder').html('');
        $('#score').text(this.score);
        this.generateSticks();
        this.generateBall();

        if( !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent) ) {
            Animation.sceneAnimation();
        }
        this.moveToStart();
        this.moveScene();

        // reset timescale to normal as the game speeds up
        this.timeline.timeScale(1);
        this.balltween.timeScale(1);
    }

    stop() {

        this.isRunning = 0;

        $('.start-game, .stop-game').css('display', 'none');
        $('#sticks, .scene .ball-holder, #score').html('');
        TweenMax.killAll();
        
        this.showResult();
    }

    scaleScreen() {

        TweenMax.killAll(); // prevent multiple calls on resize

        let height = $(window).height();
        let width = $(window).width();

        this.calculateScale();

        $('.container')
                .css('transform', 'scale(' + this.scale + ')')
                .css('height', height/this.scale)
                .css('width', width/this.scale)
                .css('transformOrigin', 'left top');



        $('#sticks').width(this.screen/this.scale + 3 * this.stickWidth/this.scale);

    }

    scaleScreenAndRun() {


        this.scaleScreen();

        if(this.isRunning) {
            this.stop();
        } else {
            this.intro();
        }

    }


    moveToStart() {        

        TweenMax.fromTo('#ball', this.time,
                        { 
                            scale: 0 
                        },
                        { 
                            scale: 1,
                            delay: this.time * ((this.steps - 3) - 1.5), 
                            onComplete: () => {
                                this.balltween.play();
                            }
                        });

        this.timeline.add(
            TweenMax.fromTo('#sticks', this.time * this.steps, { x: this.screen / this.scale }, { x: 0, ease: Power0.easeNone})
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

        let scale = this.speedUp();

        this.timeline.timeScale(scale);
        this.balltween.timeScale(scale);

        $('#sticks .stick').first().remove();
        new Stick();

    }

    speedUp() {
        if(this.score > 30) {
            return 1.8;
        }
        if(this.score > 20) {
            return 1.7;
        }
        if(this.score > 15) {
            return 1.5;
        }
        else if(this.score > 12) {
            return 1.4;
        }
        else if(this.score > 10) {
            return 1.3;
        }
        else if(this.score > 8) {
            return 1.2;
        }
        else if(this.score > 5) {
            return 1.1;
        }
        return 1;
    }

    bounce() {

        this.balltween
                .to('#ball', this.time/2, {y: '+=250px', scaleY: 0.7, transformOrigin: "bottom", ease: Power2.easeIn,
                    onComplete: () => {
                        this.checkColor();
                    }
                }).to('#ball', this.time/2, {y: '-=250px', scaleY: 1.1, transformOrigin: "bottom", ease: Power2.easeOut, 
                    onStart: () => {
                        while(this.prevColor==this.color) {
                            this.color = (new Color).getRandomColor();
                        }
                        this.prevColor = this.color;
                        TweenMax.to('#ball', 0.5, {backgroundColor: this.color});
                        $('#ball').removeClass('red')
                                  .removeClass('yellow')
                                  .removeClass('purple')
                                  .addClass((new Color).colorcodeToName(this.color));
                    }
                })    
    }    

    checkColor() {

        let ballPos = $('#ball').offset().left + $('#ball').width()/2;
        let stickWidth = $('.stick').width();
        let score = this.score;

        $('#sticks .stick').each(function(){
            if($(this).offset().left < ballPos && $(this).offset().left > (ballPos - stickWidth)) {
                
                if( Color.getColorFromClass($(this)) == Color.getColorFromClass('#ball') ) {
                    score++;
                    $('#score').text(score);
                    TweenMax.fromTo('#score', 0.5, { scale: 1.5 }, { scale: 1, ease: Elastic.easeOut.config(1.5, 0.5) });
                } else {

                    // you loose
                    game.stop();

                }

            }
        })

        this.score = score;
    }

}

class Stick {

    constructor() {
        this.stick = this.addStick();
    }

    addStick() {
        this.stick = $('#sticks').append('<div class="stick inactive"></div>');
        return this.stick;
    }

    setHeight() {
        this.stick.css('height', '50px');
    }

}

class Color {

    constructor() {
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.effects = ["bubble", "triangle", "block"];
        this.prevEffect = null;
    }

    getRandomColor() {
        let colorIndex = Math.random()*3;
        let color = this.colors[Math.floor(colorIndex)];
        return color;
    } 

    colorcodeToName(color) {
        let colors = ["#FF4571", "#FFD145", "#8260F6"];
        let names = ["red", "yellow", "purple"];
        let index = colors.indexOf(color);
        if(index == -1) return false;
        return names[index];
    }      

    changeColor(el) {
        let index = el.data("index");
        if(index===undefined) { index = 0; }
        else { index += 1; }
        if(index==3) index = 0;
        el
            .css('background-color', this.colors[index])
            .data('index', index);

        el.removeClass('red')
          .removeClass('yellow')
          .removeClass('purple')
          .addClass(this.colorcodeToName(this.colors[index]));

        if(el.hasClass('inactive')) {
            this.setEffect(el);
            el.addClass('no-effect');
        }
        
        el.removeClass('inactive');
    }

    getRandomEffect() {
        let effectIndex = null;
        
        effectIndex = Math.floor(Math.random()*3);
        while(effectIndex == this.prevEffect) {
            effectIndex = Math.floor(Math.random()*3);
        }

        this.prevEffect = effectIndex;
        return this.effects[effectIndex];
    }   

    setEffect(el) {
        let effect = this.getRandomEffect();
        el.addClass(effect + '-stick');
        for(let i = 1; i <= 14; i++) {
            if(effect=='block') {
                el.append(`<div class="${effect} ${effect}-${i}"><div class="inner"></div><div class="inner inner-2"></div></div>`);
            } else {
                el.append(`<div class="${effect} ${effect}-${i}"></div>`);
            }
        }
    }

    static getColorFromClass(el) {
        let classes = $(el).attr('class').split(/\s+/);
        for (var i = 0, len = classes.length; i < len; i++) {          
            if(classes[i] == 'red' || classes[i] == 'yellow' || classes[i] == 'purple') {
                return classes[i];
            }
        }
    }
}

class Animation {

    static generateSmallGlows(number) {
        var h = $(window).height();
        var w = $(window).width();

        for(var i = 0; i < number; i++) {
            var left = Math.floor(Math.random()*w);
            var top = Math.floor(Math.random()*(h/2));
            var size = Math.floor(Math.random()*8) + 4;
            $('.small-glows').prepend('<div class="small-glow"></div>');
            var noise = $('.small-glows .small-glow').first();
            noise.css({left: left, top: top, height: size, width: size});
        }
    }

    playBubble(el) {
        var bubble = new TimelineMax();
        bubble.staggerFromTo(el.find('.bubble'), 0.3, {scale: 0.1}, {scale: 1}, 0.03)
        bubble.staggerTo(el.find('.bubble'), 0.5, {y: '-=60px', yoyo: true, repeat: -1}, 0.03);
    }

    playTriangle(el) {
        var triangle = new TimelineMax();
        triangle.staggerFromTo(el.find('.triangle'), 0.3, {scale: 0.1}, {scale: 1}, 0.03)
                .staggerTo(el.find('.triangle'), 1.5, {
                    cycle:{
                        rotationY: [0, 360],
                        rotationX: [360, 0],
                    },
                    repeat: -1,
                    repeatDelay: 0.1
                }, 0.1);
    }

    playBlock(el) {
        let block = new TimelineMax();
        let block2 = new TimelineMax({delay: 0.69});

        block.staggerFromTo(el.find('.block'), 0.3, {scale: 0.1}, {scale: 1}, 0.03)
             .staggerTo(el.find('.block .inner:not(.inner-2)'), 1, {
                    cycle: {
                        x: ["+200%", "-200%"]
                    },
                    repeat: -1,
                    repeatDelay: 0.6,
                }, 0.1);
        block2.staggerTo(el.find('.block .inner-2'), 1, {
                    cycle: {
                        x: ["+200%", "-200%"]
                    },
                    repeat: -1,
                    repeatDelay: 0.6,
                }, 0.1);
    }

    static sceneAnimation() {

        let speed = 15;

        $('.small-glow').each(function(){
            let speedDelta = Math.floor(Math.random()*8);
            let radius = Math.floor(Math.random()*20)+20;
            TweenMax.to($(this), speed+speedDelta, {rotation: 360, transformOrigin: "-"+radius+"px -"+radius+"px", repeat: -1, ease: Power0.easeNone});
        })

        var wavet = TweenMax.to('.top_wave', speed*1.7/42, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave1 = TweenMax.to('.wave1', speed*1.9/42, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave2 = TweenMax.to('.wave2', speed*2/42, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave3 = TweenMax.to('.wave3', speed*2.2/42, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});
        var wave4 = TweenMax.to('.wave4', speed*2.4/42, {backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone});

        var mount1 = TweenMax.to('.mount1', speed*8, {backgroundPositionX: '-=1760px', repeat: -1, ease: Power0.easeNone});
        var mount2 = TweenMax.to('.mount2', speed*10, {backgroundPositionX: '-=1782px', repeat: -1, ease: Power0.easeNone});

        var clouds = TweenMax.to('.clouds', speed*3, {backgroundPositionX: '-=1001px', repeat: -1, ease: Power0.easeNone});   

    }

}