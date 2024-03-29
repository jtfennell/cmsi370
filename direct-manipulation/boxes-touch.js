var BoxesTouch = {

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        // Set up any pre-existing box elements for touch behavior.
        jQueryElements
            .addClass("drawing-area")
            
            // Event handler setup must be low-level because jQuery
            // doesn't relay touch-specific event properties.
            .each(function (index, element) {
                element.addEventListener("touchmove", BoxesTouch.trackDrag, false);
                element.addEventListener("touchend", BoxesTouch.endDrag, false);
            })

            .find("div.box").each(function (index, element) {
                element.addEventListener("touchstart", BoxesTouch.startMove, false);
                element.addEventListener("touchend", BoxesTouch.unhighlight, false);
                element.addEventListener("touchend", BoxesTouch.checkDelete, false);
            });

        var drawingArea = document.getElementById("drawing-area"); // JD: 5
        drawingArea.addEventListener("touchstart", BoxesTouch.startDraw, false);
    },

    /**
     * Begins drawing a new box
    */
    startDraw: function (event) {
        // JD: 3
        alert("touched down on drawing area");
         alert(event.pageX); // JD: 6
         alert(event.pageY);
    },

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Don't bother if we aren't tracking anything.
            if (touch.target.movingBox) {
                // Reposition the object.
                touch.target.movingBox.offset({
                    left: touch.pageX - touch.target.deltaX,
                    top: touch.pageY - touch.target.deltaY
                });
                
                //tracks the current box position to see if it is within the drawing area
                // JD: 7
                withinHorizontalBounds = touch.pageX < $('#drawing-area').width();
                withinVerticalBounds = touch.pageY < $('#drawing-area').height();
                
                //displays delete warning feedback if box is dragged outside of drawing area
                if (!(withinVerticalBounds && withinHorizontalBounds)) {
                     $(touch.target).addClass("warning").text('release to delete');

                } else if (withinHorizontalBounds && withinVerticalBounds) {
                    // Highlight the element.
                    $(touch.target).removeClass("warning").text('');
                }
            }
        });
        
        // Don't do any touch scrolling.
        event.preventDefault();
    },

    /**
     * Determines if a box should be deleted.
     */
     checkDelete: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // JD: 8
            if (!(touch.pageX < $('#drawing-area').width() && touch.pageY < $('#drawing-area').height() )) { // JD: 9
               $(touch.target).remove(); // JD: 6
            }
        });
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            if (touch.target.movingBox) {
                // Change state to "not-moving-anything" by clearing out
                // touch.target.movingBox.
                touch.target.movingBox = null;
            }
        });
    },

    /**
     * Indicates that an element is unhighlighted.
     */
    unhighlight: function () {
        $(this).removeClass("box-highlight");
    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        $.each(event.changedTouches, function (index, touch) {
            // Highlight the element.
            $(touch.target).addClass("box-highlight");

            // Take note of the box's current (global) location.
            var jThis = $(touch.target),
                startOffset = jThis.offset();

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            touch.target.movingBox = jThis;
            touch.target.deltaX = touch.pageX - startOffset.left;
            touch.target.deltaY = touch.pageY - startOffset.top;
        });

        // Eat up the event so that the drawing area does not
        // deal with it.
        event.stopPropagation();
    }

};
