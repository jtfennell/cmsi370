(function ( $ ){
    $.fn.slider = function (options) {
        var $receivingInput = this;
        var LEFT_ARROW_KEY = 37;
        var RIGHT_ARROW_KEY = 39;
        var DEFAULT_MIN = 0;
        var DEFAULT_MAX = 100;
        var DEFAULT_KNOB_COLOR = '#70DB70';

        var settings = $.extend({
            min:DEFAULT_MIN,
            max: DEFAULT_MAX,
            color: DEFAULT_KNOB_COLOR
        }, options)
        
        var checkForArrowKey = function (event) {
            if (event.keyCode === LEFT_ARROW_KEY) {
                //decrease input, adjust position of slider knob
                
            }else if (event.keyCode === RIGHT_ARROW_KEY) {
                //increment input, adjust position of slider knob
                
            }
        }

        //change the type of input 
        $receivingInput.attr('type', 'number');

        //handler to receive right and left arrow button presses to adjust slider
        $receivingInput.on('keydown',checkForArrowKey);

        $sliderContainer = $('<div></div>').addClass('slider-container');
        $sliderTrack = $('<div></div>').addClass('slider-track');
        $sliderContainer.append($sliderTrack);

        //append the slider beneath the input
        $receivingInput.parent().append($sliderContainer);
        
        this.text('Slider');
        return this;
    }
} (jQuery));