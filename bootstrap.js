const { classes: Cc, interfaces: Ci, utils: Cu } = Components;
Cu.import('resource://gre/modules/Services.jsm');

function startup(data, reason) {};

function shutdown(data, reason) {};

function install(data, reason) {
    let windows = Services.wm.getEnumerator("Komodo");
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    
    var prefs = domWindow.require("ko/prefs");
    prefs.setString('colorpicker_cid', '@babobski.com/rgbaColorPicker;1');
};

function uninstall(data, reason) {
    let windows = Services.wm.getEnumerator("Komodo");
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
    
    var prefs = domWindow.require("ko/prefs");
    prefs.deletePref('colorpicker_cid');
};