"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Game = function () {
    function Game() {
        _classCallCheck(this, Game);

        this.speed = 50;
        this.screen = $(window).width(); // screen width
        this.steps = Math.floor(this.screen / 180); // how many steps (stick width + margin) it takes from one end to another
        this.timeline = new TimelineMax();
        this.balltween = new TimelineMax({ repeat: -1 });
        this.time = 2 - this.speed / 100;
        this.colors = ["#FF4571", "#FFD145", "#8260F6"];
        this.colorsRGBA = ["rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)", "rgba(255, 69, 113, 1)"];
        this.color = this.colors[0];
        this.prevColor = null;
        this.effects = ["bubble", "triangle", "block"];
        this.effects = ["bubble", "bubble", "bubble"];

        for (var i = 0; i <= this.steps; i++) {
            new Stick();
        } //this.bounce();
        this.start();
        //console.log(this.getRandomColor());
    }

    _createClass(Game, [{
        key: "start",
        value: function start() {
            this.moveToStart();
            this.moveScene();
        }
    }, {
        key: "getRandomColor",
        value: function getRandomColor() {
            var colorIndex = Math.random() * 2;
            var color = this.colors[Math.round(colorIndex)];
            console.log(color);
            return color;
        }
    }, {
        key: "getRandomEffect",
        value: function getRandomEffect() {
            var effectIndex = Math.random() * 2;
            return this.effects[Math.round(effectIndex)];
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

            if (el.hasClass('inactive')) this.setEffect(el);

            el.removeClass('inactive');
            el.addClass('no-effect');
        }
    }, {
        key: "setEffect",
        value: function setEffect(el) {
            var effect = this.getRandomEffect();
            el.addClass(effect + '-stick');
            for (var i = 1; i <= 14; i++) {
                el.append('<div class="' + effect + ' ' + effect + '-' + i + '"></div>');
            }
        }
    }, {
        key: "moveToStart",
        value: function moveToStart() {
            var _this = this;

            TweenMax.to('#ball', this.time, { bezier: [{ left: 340, top: 70 }, { left: 378, top: 241 }], ease: Power1.easeIn, delay: this.time * (this.steps - 2) - this.time, onComplete: function onComplete() {
                    _this.bounce();
                } });

            this.timeline.add(TweenMax.fromTo('#sticks', this.time * this.steps, { x: this.screen }, { x: 0, ease: Power0.easeNone }));
        }
    }, {
        key: "moveScene",
        value: function moveScene() {
            var _this2 = this;

            this.timeline.add(TweenMax.to('#sticks', this.time, { x: '-=180px', ease: Power0.easeNone, repeat: -1, onRepeat: function onRepeat() {
                    _this2.rearrange();
                } }));
        }

        /**
         * removes the first stick and adds one the the end
         * this gives the sticks an infinite movement
         */

    }, {
        key: "rearrange",
        value: function rearrange() {

            $('#sticks .stick').first().remove();
            new Stick();
        }
    }, {
        key: "bounce",
        value: function bounce() {
            var _this3 = this;

            this.balltween.to('#ball', this.time / 2, { y: '-=200px', scaleY: 1.1, transformOrigin: "bottom", ease: Power2.easeOut, onStart: function onStart() {
                    while (_this3.prevColor == _this3.color) {
                        _this3.color = _this3.getRandomColor();
                    }
                    _this3.prevColor = _this3.color;
                    TweenMax.to('#ball', 0.5, { backgroundColor: _this3.color });
                } }).to('#ball', this.time / 2, { y: '+=200px', scaleY: 0.7, transformOrigin: "bottom", ease: Power2.easeIn, onComplete: this.checkColor });
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
    }]);

    return Game;
}();

var Stick = function () {
    function Stick() {
        _classCallCheck(this, Stick);

        this.stick = this.addStick();
        //this.setHeight();
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