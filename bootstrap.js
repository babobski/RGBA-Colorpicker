const { classes: Cc, interfaces: Ci, utils: Cu, manager: Cm } = Components;
Cu.import('resource://gre/modules/Services.jsm');

function startup(data, reason) {
    
    if ( ! ("@babobski.com/rgbaColorPicker;1" in Cc)) {
        try {
            var component = data.installPath.clone();
            component.append("components");
            component.append("component.manifest");
    
            var registrar = Cm.QueryInterface(Ci.nsIComponentRegistrar);
            registrar.autoRegister(component);
        } catch (e) {
            Cu.reportError("Commando: Exception while registering component for 'Files' scope");
            Cu.reportError(e);
        }
    }
    
};

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