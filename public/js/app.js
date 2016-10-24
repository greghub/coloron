"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.speed = 50;
        this.screen = $(window).width(); // screen width
        this.steps = Math.floor(this.screen / 180); // how many steps (stick width + margin) it takes from one end to another
        this.timeline = new TimelineMax({ smoothChildTiming: true });
        this.time = 2 - this.speed / 100;
        //this.time = 0.5;
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.colorsRGBA = ["rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)"];
        this.color = this.colors[0];
        this.prevColor = null;
        this.prevEffect = null;

        $('#sticks').width((this.steps + 3) * 180);
    }

    _createClass(Game, [{
        key: "getTime",
        value: function getTime() {
            return 2 - this.speed / 100;
        }
    }, {
        key: "generateSticks",
        value: function generateSticks() {
            for (var i = 0; i <= this.steps; i++) {
                new Stick();
            }
        }
    }, {
        key: "generateBall",
        value: function generateBall() {
            this.balltween = new TimelineMax({ repeat: -1, paused: 1 });
            $('.scene .ball-holder').append('<div class="ball" id="ball"></div>');
            this.bounce();
        }
    }, {
        key: "intro",
        value: function intro() {
            var _this = this;

            $('.start-game').css('display', 'flex');
            var intro = new TimelineMax();
            var ball = new TimelineMax({ repeat: -1, delay: 3 });
            intro.fromTo('.start-game .logo-holder', 0.9, { opacity: 0 }, { opacity: 1 }).staggerFromTo('.start-game .logo span', 0.5, { opacity: 0 }, { opacity: 1 }, 0.08).staggerFromTo('.start-game .bar', 1.6, { y: '+100%' }, { y: '0%', ease: Elastic.easeOut.config(1, 0.3) }, 0.08).staggerFromTo('.start-game .ball-demo', 1, { scale: 0 }, { scale: 1, ease: Elastic.easeOut.config(1, 0.3) }, 0.8, 2);

            ball.to('.start-game .section-1 .ball-demo', 0.5, { y: "100px", scaleY: 1.1, transformOrigin: "bottom", ease: Power2.easeIn }).to('.start-game .section-1 .ball-demo', 0.5, { y: "0px", scaleY: 1, transformOrigin: "bottom", ease: Power2.easeOut,
                onStart: function onStart() {
                    while (_this.prevColor == _this.color) {
                        _this.color = new Color().getRandomColor();
                    }
                    _this.prevColor = _this.color;
                    TweenMax.to('.start-game .section-1 .ball-demo', 0.5, { backgroundColor: _this.color });
                } });
        }
    }, {
        key: "start",
        value: function start() {

            this.stop();

            $('.start-game').css('display', 'none');

            new Game();

            $('#sticks, .scene .ball-holder').html('');
            this.generateSticks();
            this.generateBall();

            Animation.sceneAnimation();
            this.moveToStart();
            this.moveScene();

            // reset timescale to normal as the game speeds up
            this.timeline.timeScale(1);
            this.balltween.timeScale(1);
        }
    }, {
        key: "stop",
        value: function stop() {
            $('#sticks, .scene .ball-holder').html('');
            TweenMax.killAll();
        }
    }, {
        key: "moveToStart",
        value: function moveToStart() {
            var _this2 = this;

            TweenMax.fromTo('#ball', this.time, {
                scale: 0
            }, {
                scale: 1,
                delay: this.time * (this.steps - 3 - 1.5),
                onComplete: function onComplete() {
                    _this2.balltween.play();
                }
            });

            this.timeline.add(TweenMax.fromTo('#sticks', this.time * this.steps, { x: this.screen }, { x: 0, ease: Power0.easeNone }));
        }
    }, {
        key: "moveScene",
        value: function moveScene() {
            var _this3 = this;

            this.timeline.add(TweenMax.to('#sticks', this.time, { x: '-=180px', ease: Power0.easeNone, repeat: -1, onRepeat: function onRepeat() {
                    _this3.rearrange();
                } }));
        }

        /**
         * removes the first stick and adds one the the end
         * this gives the sticks an infinite movement
         */

    }, {
        key: "rearrange",
        value: function rearrange() {

            this.timeline.timeScale(2);
            this.balltween.timeScale(2);
            $('#sticks .stick').first().remove();
            new Stick();
        }
    }, {
        key: "bounce",
        value: function bounce() {
            var _this4 = this;

            this.balltween.to('#ball', this.time / 2, { y: '+=200px', scaleY: 0.7, transformOrigin: "bottom", ease: Power2.easeIn, onComplete: this.checkColor }).to('#ball', this.time / 2, { y: '-=200px', scaleY: 1.1, transformOrigin: "bottom", ease: Power2.easeOut,
                onStart: function onStart() {
                    while (_this4.prevColor == _this4.color) {
                        _this4.color = new Color().getRandomColor();
                    }
                    _this4.prevColor = _this4.color;
                    TweenMax.to('#ball', 0.5, { backgroundColor: _this4.color });
                }
            });
        }
    }]);

    return Game;
}();

var Stick = function () {
    function Stick() {
        _classCallCheck(this, Stick);

        this.stick = this.addStick();
    }

    _createClass(Stick, [{
        key: "addStick",
        value: function addStick() {
            this.stick = $('#sticks').append('<div class="stick inactive"></div>');
            return this.stick;
        }
    }, {
        key: "setHeight",
        value: function setHeight() {
            this.stick.css('height', '50px');
        }
    }]);

    return Stick;
}();

var Color = function () {
    function Color() {
        _classCallCheck(this, Color);

        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.effects = ["bubble", "triangle", "block"];
    }

    _createClass(Color, [{
        key: "getRandomColor",
        value: function getRandomColor() {
            var colorIndex = Math.random() * 2;
            var color = this.colors[Math.round(colorIndex)];
            return color;
        }
    }, {
        key: "colorcodeToName",
        value: function colorcodeToName(color) {
            var colors = ["#FF4571", "#FFD145", "#8260F6"];
            var names = ["red", "yellow", "purple"];
            var index = colors.indexOf(color);
            if (index == -1) return false;
            return names[index];
        }
    }, {
        key: "changeColor",
        value: function changeColor(el) {
            var index = el.data("index");
            if (index === undefined) {
                index = 0;
            } else {
                index += 1;
            }
            if (index == 3) index = 0;
            el.css('background-color', this.colors[index]).data('index', index);

            el.removeClass('red').removeClass('yellow').removeClass('purple').addClass(this.colorcodeToName(this.colors[index]));

            if (el.hasClass('inactive')) {
                this.setEffect(el);
                el.addClass('no-effect');
            }

            el.removeClass('inactive');
        }
    }, {
        key: "checkColor",
        value: function checkColor() {

            var ballPos = $('#ball').offset().left + $('#ball').width() / 2;
            var stickWidth = $('.stick').width();

            $('#sticks .stick').each(function () {
                if ($(this).offset().left < ballPos && $(this).offset().left > ballPos - stickWidth) {

                    //

                }
            });
        }
    }, {
        key: "getRandomEffect",
        value: function getRandomEffect() {
            var effectIndex = Math.random() * 2;
            return this.effects[Math.round(effectIndex)];
        }
    }, {
        key: "setEffect",
        value: function setEffect(el) {
            var effect = this.getRandomEffect();
            el.addClass(effect + '-stick');
            for (var i = 1; i <= 14; i++) {
                if (effect == 'block') {
                    el.append("<div class=\"" + effect + " " + effect + "-" + i + "\"><div class=\"inner\"></div><div class=\"inner inner-2\"></div></div>");
                } else {
                    el.append("<div class=\"" + effect + " " + effect + "-" + i + "\"></div>");
                }
            }
        }
    }]);

    return Color;
}();

var Animation = function () {
    function Animation() {
        _classCallCheck(this, Animation);
    }

    _createClass(Animation, [{
        key: "playBubble",
        value: function playBubble(el) {
            var bubble = new TimelineMax();
            bubble.staggerFromTo(el.find('.bubble'), 0.3, { scale: 0.1 }, { scale: 1 }, 0.03);
            bubble.staggerTo(el.find('.bubble'), 0.5, { y: '-=60px', yoyo: true, repeat: -1 }, 0.03);
        }
    }, {
        key: "playTriangle",
        value: function playTriangle(el) {
            var triangle = new TimelineMax();
            triangle.staggerFromTo(el.find('.triangle'), 0.3, { scale: 0.1 }, { scale: 1 }, 0.03).staggerTo(el.find('.triangle'), 1.5, {
                cycle: {
                    rotationY: [0, 360],
                    rotationX: [360, 0]
                },
                repeat: -1,
                repeatDelay: 0.1
            }, 0.1);
        }
    }, {
        key: "playBlock",
        value: function playBlock(el) {
            var block = new TimelineMax();
            var block2 = new TimelineMax({ delay: 0.69 });

            block.staggerFromTo(el.find('.block'), 0.3, { scale: 0.1 }, { scale: 1 }, 0.03).staggerTo(el.find('.block .inner:not(.inner-2)'), 1, {
                cycle: {
                    x: ["+200%", "-200%"]
                },
                repeat: -1,
                repeatDelay: 0.6
            }, 0.1);
            block2.staggerTo(el.find('.block .inner-2'), 1, {
                cycle: {
                    x: ["+200%", "-200%"]
                },
                repeat: -1,
                repeatDelay: 0.6
            }, 0.1);
        }
    }], [{
        key: "generateSmallGlows",
        value: function generateSmallGlows(number) {
            var h = $(window).height();
            var w = $(window).width();

            for (var i = 0; i < number; i++) {
                var left = Math.round(Math.random() * w);
                var top = Math.round(Math.random() * (h / 2));
                var size = Math.round(Math.random() * 8) + 4;
                $('.small-glows').prepend('<div class="small-glow"></div>');
                var noise = $('.small-glows .small-glow').first();
                noise.css({ left: left, top: top, height: size, width: size });
            }
        }
    }, {
        key: "sceneAnimation",
        value: function sceneAnimation() {

            var speed = 15;

            $('.small-glow').each(function () {
                var speedDelta = Math.round(Math.random() * 8);
                var radius = Math.round(Math.random() * 20) + 20;
                TweenMax.to($(this), speed + speedDelta, { rotation: 360, transformOrigin: "-" + radius + "px -" + radius + "px", repeat: -1, ease: Power0.easeNone });
            });

            var wavet = TweenMax.to('.top_wave', speed * 1.7 / 42, { backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone });
            var wave1 = TweenMax.to('.wave1', speed * 1.9 / 42, { backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone });
            var wave2 = TweenMax.to('.wave2', speed * 2 / 42, { backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone });
            var wave3 = TweenMax.to('.wave3', speed * 2.2 / 42, { backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone });
            var wave4 = TweenMax.to('.wave4', speed * 2.4 / 42, { backgroundPositionX: '-=54px', repeat: -1, ease: Power0.easeNone });

            var mount1 = TweenMax.to('.mount1', speed * 8, { backgroundPositionX: '-=1760px', repeat: -1, ease: Power0.easeNone });
            var mount2 = TweenMax.to('.mount2', speed * 10, { backgroundPositionX: '-=1782px', repeat: -1, ease: Power0.easeNone });

            var clouds = TweenMax.to('.clouds', speed * 3, { backgroundPositionX: '-=1001px', repeat: -1, ease: Power0.easeNone });
        }
    }]);

    return Animation;
}();