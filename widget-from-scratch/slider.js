(function ( $ ){
    $.fn.slider = function (options) {
        var $receivingInput = this;
        var LEFT_ARROW_KEY = 37;
        var RIGHT_ARROW_KEY = 39;

        var settings = $.extend({
            min:0,
            max: 100,
            color: '#70DB70'
        }, options)
        
        var checkForArrowKey = function (event) {
            if (event.which === LEFT_ARROW_KEY) {
                //decrease input, adjust position of slider knob
                alert("left arrow key pressed");
            }else if (event.which === RIGHT_ARROW_KEY) {
                //increment input, adjust position of slider knob
                alert("right arrow key pressed");
            }
        }

        //change the type of input 
        $receivingInput.attr('type', 'number');

        //handler to receive right and left arrow button presses to adjust slider
        $receivingInput.on('keypress', checkForArrowKey);

        //append the slider beneath the input
        $receivingInput.parent().append($('<div></div>').addClass('slider'));
        
        this.text('Slider');
        return this;
    }
} (jQuery));