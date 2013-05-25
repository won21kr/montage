/*global require, exports, document, Error*/

/**
 * It's dangerous to go alone! Take this.
 */
var Montage = require("montage").Montage,
    AbstractControl = require("ui/base/abstract-control").AbstractControl,
    PressComposer = require("composer/press-composer").PressComposer;

var CLASS_PREFIX = "montage-Link";

/**
 * @class AbstractLink
 * @extends AbstractControl
 */
var AbstractLink = exports.AbstractLink = AbstractControl.specialize(
/* @lends AbstractLink# */
{
    /**
     * Dispatched when the link is activated through a mouse click,
     * finger tap.
     * @event action
     * @memberof AbstractLink
     * @param {Event} event
     */

    /**
     * private
     */
    constructor: {
        value: function AbstractLink() {
            if(this.constructor ===  AbstractLink) {
                throw new Error("AbstractLink cannot be instantiated.");
            }
            AbstractControl.didCreate.call(this); // super
            this._pressComposer = new PressComposer();
            this.addComposer(this._pressComposer);

            this.defineBindings({
                // classList management
                "classList.has('montage--disabled')": {
                    "<-": "!enabled"
                },
                "classList.has('montage--active')": {
                    "<-": "active"
                }
            });
        }
    },

    hasTemplate: {
        value: false
    },

    active: {
        value: false
    },

    enabled: {
        value: true
    },

    _pressComposer: {
        value: null
    },

    _src: {
        value: null
    },

    src: {
        set: function(value) {
            this._src = value;
            this.needsDraw = true;
        },
        get: function() {
            return this._src;
        }
    },

    _label: {
        value: null
    },

    label: {
        set: function(value) {
            this._label = value;
            this.needsDraw = true;
        },
        get: function() {
            return this._label;
        }
    },

    handlePressStart: {
        value: function(event) {
            this.active = true;

            if (event.touch) {
                // Prevent default on touchmove so that if we are inside a scroller,
                // it scrolls and not the webpage
                document.addEventListener("touchmove", this, false);
            }
        }
    },

    /**
     Handle press event from press composer
     */
    handlePress: {
        value: function(/* event */) {
            this.active = false;

            if (!this.enabled) {
                return;
            }

            this.dispatchActionEvent();
            this.checked = !this.checked;
        }
    },

    /**
     Called when all interaction is over.
     @private
     */
    handlePressCancel: {
        value: function(/* event */) {
            this.active = false;
            document.removeEventListener("touchmove", this, false);
        }
    },

    prepareForActivationEvents: {
        value: function() {
            this._pressComposer.addEventListener("pressStart", this, false);
            this._pressComposer.addEventListener("press", this, false);
            this._pressComposer.addEventListener("pressCancel", this, false);
        }
    }
});
