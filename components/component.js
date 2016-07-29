/* Copyright (c) 2009 ActiveState
   See the file LICENSE.txt for licensing information. */

/**
 * This is a simple XPCOM wrapper around John Dyers excellent JavaScript
 * color picker:
 * http://johndyer.name/post/2007/09/PhotoShop-like-JavaScript-Color-Picker.aspx
 */

const Cc = Components.classes;
const Ci = Components.interfaces;
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

/***********************************************************
 *              XPCOM class definition                     *
 ***********************************************************/

// Class constructor.
function rgbaColorPicker() {}

// Class definition.
rgbaColorPicker.prototype = {
    
    // properties required for XPCOM registration:
    classDescription: "RGBA Colorpicker",
    
    classID:          Components.ID("{ab5e2112-d8ac-4794-8145-b3c4a5cd5ab7}"),

    QueryInterface: XPCOMUtils.generateQI([Ci.koIColorPicker,
                                           Ci.koIColorPickerAsync]),

    chromeURL: "chrome://rgba-colorpicker/content/wrapper.xul",

    /**
     * Select a color from the Komodo color picker dialog.
     * @deprecated since Komodo 7.0b1 - use pickColorAsync instead
     * 
     * @param {string} hexColor - The initial color.
     */
    pickColor: function(hexColor) {
        return this.pickColorWithPositioning(hexColor, -1, -1);
    },

    /**
     * Select a color from the Komodo color picker dialog, attempting to
     * position the dialog at the given coordinates.
     *
     * @param   {String} hexColor - The initial color, as "#nnnnnn".
     * @param   {Number} screenX  - The initial X position, or null.
     * @param   {Number} screenY  - The initial Y position, or nul.
     *
     * @returns {String} The picked color, as "#nnnnnn", or null.
     */
    pickColorWithPositioning: function(hexColor, screenX, screenY) {
        /**
         * @type {Components.interfaces.koIPreferenceSet}
         */
        var prefs = Components.classes["@activestate.com/koPrefService;1"].
                        getService(Components.interfaces.koIPrefService).prefs;
        var colorMode = prefs.getString("colorpicker.colorMode", "h");

        var args = {
            hexColor: hexColor,
            colorMode: colorMode,
            retval: 0
        };
        args.wrappedJSObject = args;

        var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
                      .getService(Components.interfaces.nsIWindowMediator)
                      .getMostRecentWindow(null);
        var windowFeatures = 'modal,,resizable=no';
        if (screenX >= 0)
            windowFeatures += ",left=" + screenX;
        if (screenY >= 0)
            windowFeatures += ",top=" + screenY;
        win.openDialog(this.chromeURL, 'Color Picker',
                       windowFeatures, args);

        if (args.retval) {
            // Remember the last color mode used, for next time.
            prefs.setStringPref("colorpicker.colorMode", args.colorMode);
            return args.hexColor;
        }
        return null;
    },

    /**
     * Select a color from the Komodo color picker dialog.  The picking may be
     * asynchronous.
     *
     * @param   {koIColorPickerAsyncCallback} aCallback - the callback to invoke
     *              When the color has been chosen.
     * @param   {String} aStartingColor - The initial color, as a hex string of
     *              #rrggbb.
     * @param   {double} aStartingAlpha - The initial alpha component, as a
     *              number between 0.0 and 1.0 inclusive.
     * @param   {Number} aScreenX - The initial dialog X position, or null.
     * @param   {Number} aScreenY - The initial dialog Y position, or null.
     */
    pickColorAsync: function koColorPicker_pickColorAsync(aCallback,
                                                          aStartingColor,
                                                          aStartingAlpha,
                                                          aScreenX, aScreenY)
    {
        if (!aCallback || !(aCallback instanceof Ci.koIColorPickerAsyncCallback)) {
            throw Components.results.NS_ERROR_INVALID_ARG;
        }
		
		
        var colorString = aStartingColor.replace(/^#/, "");
        if (!/^[0-9a-f]{6}$/i.test(colorString)) {
            throw Components.results.NS_ERROR_INVALID_ARG;
        }
        /**
         * @type {Components.interfaces.koIPreferenceSet}
         */
        var prefs = Components.classes["@activestate.com/koPrefService;1"].
                        getService(Components.interfaces.koIPrefService).prefs;
        var colorMode = prefs.getString("colorpicker.colorMode", "h");

        var args = {
            hexColor: colorString,
            colorMode: colorMode,
			opacity: aStartingAlpha,
            retval: 0
        };
        args.wrappedJSObject = args;

        var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
                      .getService(Components.interfaces.nsIWindowMediator)
                      .getMostRecentWindow(null);
        var windowFeatures = 'modal,resizable=no';
        if (aScreenX !== 0 || aScreenY !== 0) {
            windowFeatures += ",left=" + aScreenX + ",top=" + aScreenY;
        }
        win.openDialog(this.chromeURL, 'Color Picker',
                       windowFeatures, args);

        if (args.retval) {
            // Remember the last color mode used, for next time.
            prefs.setStringPref("colorpicker.colorMode", args.colorMode);
            colorString = "#" + args.hexColor.replace(/^#/, "");
			colorAlpha = args.opacity;
            aCallback.handleResult(colorString, colorAlpha);
        } else {
            aCallback.handleResult(null, aStartingAlpha);
        }
    },
};

// XPCOM registration of class.
if ("generateNSGetFactory" in XPCOMUtils) {
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([rgbaColorPicker]);
} else if ("generateNSGetModule" in XPCOMUtils) {
    var NSGetModule = XPCOMUtils.generateNSGetModule([rgbaColorPicker]);
}
