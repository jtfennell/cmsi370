(function ( $ ){
    $.fn.slider = function (options) {
        var $receivingInput = this;
        var LEFT_ARROW_KEY = 37;
        var RIGHT_ARROW_KEY = 39;
        var LEFT_MOUSE_BUTTON = 1;
        var DEFAULT_MIN = 0;
        var DEFAULT_MAX = 100;
        var DEFAULT_KNOB_COLOR = 'black';

        var settings = $.extend({
            min:DEFAULT_MIN,
            max: DEFAULT_MAX,
            color: DEFAULT_KNOB_COLOR
        }, options)
        
        var sliderInfo = {}

        var startDrag = function(event) {
            if (event.which === LEFT_MOUSE_BUTTON) {
               
                //record initial position of slider before this move
                sliderInfo.initialPosition = ($(this).offset().left);
                
                sliderInfo.moving = true;
                
                //calculate adjustment for offset based on the click's position 
                //relative to the left edge of the slider
                sliderInfo.offset = event.pageX - sliderInfo.initialPosition;

                //slider stops when the right edge hits the right hand side of the track
                sliderInfo.length = $sliderTrack.width() + $sliderTrack.offset().left - $sliderKnob.width();

                //calculate left and right boundaries of track
                sliderInfo.leftEdgeOfTrack = sliderInfo.startingPosition;
                sliderInfo.rightEdgeOfTrack = sliderInfo.length;
                
            }; 
        }

        var updateInput = function (event) {
            if (sliderInfo.moving) {
                var percentageOfSliderPassed = (event.pageX - sliderInfo.startingPosition) / sliderInfo.length;
                            
                var updatedVal = Math.floor(settings.min + (percentageOfSliderPassed * (settings.max - settings.min)));
                $receivingInput.val(updatedVal);
            }; 
        }

        var endDrag = function () {
            sliderInfo.moving = false;
        }

        var pointerGrab = function (event) {
            if (event.which === LEFT_MOUSE_BUTTON) {
                this.classList.add('grabbing');
            };
        }

        var trackDrag = function (event) {
            if (sliderInfo.moving) {
                var knobPosition = $(this).offset().left;
                console.log(knobPosition);
                console.log(sliderInfo.rightEdgeOfTrack);
                if (knobPosition >= sliderInfo.leftEdgeOfTrack && knobPosition <= sliderInfo.rightEdgeOfTrack) {
                    $(this).offset({
                    top: $(this).offset().top,
                    left: event.pageX - sliderInfo.offset
                })
                }else{
                    endDrag();
                } 
            };
        }

        var pointerHand = function () {
            this.classList.remove('grabbing');
        }

        //change the type of input 
        $receivingInput.attr('type', 'number');

        //create components for slider
        $sliderContainer = $('<div></div>').addClass('slider-container');
        $sliderTrack = $('<div></div>').addClass('slider-track absolute-center');
        $sliderGlyph = $('<span></span>').addClass('glyphicon glyphicon-transfer arrow-glyph')
        $sliderKnob = $('<div></div>').addClass('slider-knob').css('border', '2px solid ' + settings.color);
        $sliderContainer.append($sliderTrack.append($sliderKnob.append($sliderGlyph)));

        //append the slider beneath the input
        $receivingInput.parent().append($sliderContainer);

        //records the starting position of the slider before 
        //it is moved for the first time
        sliderInfo.startingPosition = $sliderKnob.offset().left;
        
        $sliderKnob.on('mousedown', startDrag);
        $sliderKnob.on('mousedown', pointerGrab);
        $sliderKnob.on('mouseup', pointerHand);
        $sliderKnob.on('mouseup', endDrag);
        $sliderKnob.on('mousemove', trackDrag);
        $sliderKnob.on('mousemove', updateInput);

        this.text('Slider');
        return this;
    }
} (jQuery));