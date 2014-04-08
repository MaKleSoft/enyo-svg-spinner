# SvgSpinner

**SvgSpinner** is a spinner control based on animated svgs. It is highly customizable and can double as a progress indicator.

Check out the [live demo](http://maklesoft.github.io/enyo-svg-spinner)!

## Requirements

**SvgSpinner** requires Enyo 2.3.0-pre.10 or higher and only works in [Browsers](http://caniuse.com/svg-smil) that support [SVG SMIL animation](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL).

## Installation

If you are using the [Bootplate](https://github.com/enyojs/enyo/wiki/Bootplate) application structure, the best way to include SvgSpinner in your app is to add it as a submodule to your *libs* folder.

    git submodule add https://github.com/MaKleSoft/enyo-svg-spinner.git lib/svg-spinner

Then add the module to your **package.json**.

    enyo.depends(
        ..
        "$lib/svg-spinner"
    );


## Usage

    enyo.kind({
        name: "MyApp",
        components: [
            {kind: "Spinner", spinning: true}
        ]
    });

## Published properties

    {
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
    }

## Methods

`start: function()`

Convenience method for starting the spinner. Equivalent to `set("spinning", true)`

`stop: function()`

Convenience method for stopping the spinner. Equivalent to `set("spinning", false)`