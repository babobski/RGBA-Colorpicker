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
			Cu.reportError("Commando: Exception while registering component for Colorpicker");
			Cu.reportError(e);
		}
	}
	
};

function shutdown(data, reason) {};

function install(data, reason) {
	let windows = Services.wm.getEnumerator("Komodo");
	let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
	
	var prefs = domWindow.require("ko/prefs");
	var koLess = domWindow.require("ko/less");
	var defaultColors = '[{"r":17,"g":17,"b":17,"a":1},{"r":255,"g":255,"b":255,"a":1},{"r":170,"g":170,"b":170,"a":1},{"r":221,"g":221,"b":221,"a":1},{"r":46,"g":204,"b":64,"a":1},{"r":255,"g":65,"b":54,"a":1},{"r":255,"g":220,"b":0,"a":1},{"r":0,"g":116,"b":217,"a":1}]';
	prefs.setString('colorpicker_cid', '@babobski.com/rgbaColorPicker;1');
	prefs.setString('colorpicker.savedColors', defaultColors);
	koLess.loadSheet('less://rgba-colorpicker/skin/colorpicker.less');
	koLess.reload(true);
};

function uninstall(data, reason) {
	let windows = Services.wm.getEnumerator("Komodo");
	let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);
	
	var prefs = domWindow.require("ko/prefs");
	prefs.deletePref('colorpicker_cid');
	prefs.deletePref('colorpicker.savedColors');
};

