/**
 * A combination of spinner and progress indicator[description]
 */
enyo.kind({
    name: "Spinner",
    published: {
        //* color to be used for the spinner
        color: "#000",
        //* width to be used for the lines
        lineWidth: 6,
        //* number of lines
        lineCount: 12,
        //* length of the lines
        lineLength: 15,
        //* spinning speed
        speed: 1,
        //* property for toggling the animation on/off
        spinning: false,
        //* number between 0 and 1. can be used to indicate a progress
        progress: 0
    },
    observers: {
        "updateAttributes": ["color", "lineWidth"],
        "buildLines": ["lineCount", "lineLength", "speed"]
    },
    create: enyo.inherit(function(sup) {
        return function() {
            sup.apply(this, arguments);

            this.updateAttributes();
            this.buildLines();
        };
    }),
    rendered: enyo.inherit(function(sup) {
        return function() {
            sup.apply(this, arguments);
            if (this.spinning) {
                this.spinningChanged();
            }
        };
    }),
    /**
     * Updates relevant svg attributes if any of the corresponding properties changes
     */
    updateAttributes: function() {
        this.$.svg.setAttribute("stroke", this.color);
        this.$.svg.setAttribute("stroke-width", this.lineWidth);
    },
    /**
     * Creates the line elements in the svg, along with their animate elements
     */
    buildLines: function() {
        // Remove any existing elements first
        this.$.lines.destroyClientControls();

        var n = this.lineCount, size = 100, r2 = size/4 + this.lineLength/2, r1 = size/4 - this.lineLength/2,
            dur = 1/this.speed, phi, x1, x2, y1, y2, t;
        for (var i=0; i<n; i++) {
            // Calculate the angle at which this line should be placed. We want to spread the lines
            // evenly along the entire 360 degrees. We're starting at -90 degrees, which is at the top
            phi = 2 * Math.PI / n * i - Math.PI / 2;
            // Calculating the line coordinates is a matter of basic trigonometry
            x1 = Math.cos(phi) * r1;
            y1 = Math.sin(phi) * r1;
            x2 = Math.cos(phi) * r2;
            y2 = Math.sin(phi) * r2;

            // Create the line element along with the animation element
            this.$.lines.createComponent({
                tag: "line", attributes: {x1: x1, y1: y1, x2: x2, y2: y2, opacity: 0}, components: [
                    {tag: "animate", attributes: {attributeName: "opacity", from: "1", to: "0.1", dur: dur + "s", repeatCount: "indefinite", begin: "indefinite"}}
                ]
            });
        }

        // Finally re-render everything to this stuff into the dom
        this.render();
    },
    /**
     * Handler method for changes to the _spinning_ property. Starts or stops the animation accordingly.
     */
    spinningChanged: function() {
        if (!this.preventUpdate && this.hasNode()) {
            var lines = this.$.lines.getClientControls(), n = lines.length, dur = 1/this.speed, animNode;
            for (var i=0; i<n; i++) {
                // We need the actual dom node, not the enyo kind, since we
                // want to access the native api
                animNode = lines[i].getClientControls()[0].hasNode();

                if (this.spinning) {
                    // Start the animation with the appropriate delay
                    animNode.beginElementAt(dur / n * i);
                } else {
                    // Stop the animation
                    animNode.endElementAt(dur / n * i);
                }
            }

            // Throttle animation updates to prevent problems with animation timing
            // In practice this means that changes to the _spinning_ attributes will only
            // ever take effect in intervals equal or bigger than the animation duration
            this.preventUpdate = true;
            setTimeout(function(oldValue) {
                this.preventUpdate = false;
                // If the _spinning_ property has changed in the meantime, apply the changes
                if (this.spinning != oldValue) {
                    this.spinningChanged();
                }
            }.bind(this, this.spinning), dur * 1000);
        }
    },
    /**
     * @public
     *
     * Convenience method for starting the spinner. Equivalent to _set("spinning", true)
     */
    start: function() {
        this.set("spinning", true);
    },
    /**
     * @public
     *
     * Convenience method for stopping the spinner. Equivalent to _set("spinning", false)
     */
    stop: function() {
        this.set("spinning", false);
    },
    /**
     * Handler method for changes to the _progress_ property. Adjusts the opacity attributes
     * of all the lines to represent the progress
     */
    progressChanged: function() {
        var lines = this.$.lines.getClientControls(), n = lines.length;
        for (var i=0; i<n; i++) {
            lines[i].setAttribute("opacity", 1 - Math.max(0, Math.min(1, i + 1 - this.progress * n)));
        }
    },
    components: [
        {name: "svg", tag: "svg", classes: "enyo-fill", attributes: {xmlns: "http://www.w3.org/2000/svg", "stroke-linecap": "round", viewBox: "0 0 100 100"}, components:[
            {tag: "g", name: "lines", attributes: {transform: "translate(50, 50)"}}
        ]}
    ]
});