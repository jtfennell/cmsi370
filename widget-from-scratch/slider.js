(function ( $ ){
    $.fn.slider = function (options) {
        var $receivingInput = this;
        var LEFT_ARROW_KEY = 37;
        var RIGHT_ARROW_KEY = 39;
        var LEFT_MOUSE_BUTTON = 1;
        var DEFAULT_MIN = 0;
        var DEFAULT_MAX = 100;
        var DEFAULT_KNOB_COLOR = 'black';
        var sliderInitialPosition;

        var settings = $.extend({
            min:DEFAULT_MIN,
            max: DEFAULT_MAX,
            color: DEFAULT_KNOB_COLOR
        }, options)
        
        var sliderInfo = {}

        var checkForArrowKey = function (event) {
            if (event.keyCode === LEFT_ARROW_KEY) {
                //decrease input, adjust position of slider knob
                alert('left arrow key pressed');
            }else if (event.keyCode === RIGHT_ARROW_KEY) {
                //increment input, adjust position of slider knob
                alert('right arrow key pressed');
            }
        }

        var startDrag = function(event) {
            if (event.which === LEFT_MOUSE_BUTTON) {
               
                //record initial position of slider
                sliderInfo.initialPosition = ($(this).offset().left);
                sliderInfo.active = true;
            }; 
        }

        var endDrag = function () {
            sliderInfo.active = false;
        }

        var pointerGrab = function (event) {
            if (event.which === LEFT_MOUSE_BUTTON) {
                this.classList.add('grabbing');
            };
            
        }

        var trackDrag = function () {
            if (sliderInfo.active) {
                console.log($(this));
                $(this).offset({
                    top: $(this).offset().top,
                    left: event.pageX
                })
            };
        }

        var pointerHand = function () {
            this.classList.remove('grabbing');
        }

        //change the type of input 
        $receivingInput.attr('type', 'number');

        //handler to receive right and left arrow button presses to adjust slider
        $receivingInput.on('keydown',checkForArrowKey);

        //create components for slider
        $sliderContainer = $('<div></div>').addClass('slider-container');
        $sliderTrack = $('<div></div>').addClass('slider-track absolute-center');
        $sliderGlyph = $('<span></span>').addClass('glyphicon glyphicon-transfer arrow-glyph')
        $sliderKnob = $('<div></div>').addClass('slider-knob').css('border', '2px solid ' + settings.color);
        $sliderContainer.append($sliderTrack.append($sliderKnob.append($sliderGlyph)));

        //append the slider beneath the input
        $receivingInput.parent().append($sliderContainer);
        
        $sliderKnob.on('mousedown', startDrag);
        $sliderKnob.on('mousedown', pointerGrab);
        $sliderKnob.on('mouseup', pointerHand);
        $sliderKnob.on('mouseup', endDrag);
        $sliderKnob.on('mousemove', trackDrag);

        this.text('Slider');
        return this;
    }
} (jQuery));