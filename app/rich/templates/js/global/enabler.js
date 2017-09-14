
// Reference to the creative's various properties and elements.
var creative = {};


/**
 * Called on the window load event.
 */
function preInit() {
  if (Enabler.isInitialized()) {
    init();
  } else {
    Enabler.addEventListener(
      studio.events.StudioEvent.INIT,
      init
    );
  }
}

/**
 * The Enabler is now initialized and any extra modules have been loaded.
 */
function init() {
  addListeners();
}

/**
 * Add appropriate listeners after the creative's DOM has been set up.
 */
function addListeners() {
  document.addEventListener('click', exitClickHandler);
}


// ---------------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------------

function exitClickHandler(event) {
  	var exclude = ['yt-close', 'slider-control-hitbox', 'slider-control', 'gallery-controls', 'slider-indicator']
  	if (!shouldExit(exclude, event.target)) {
		Enabler.exit('BackgroundExit');
  	}
}

function shouldExit(classes, target) {
  	for (var index in classes) {
  		var value = classes[index]
  		if (target.className.indexOf(value) > -1 || $(target).closest('.'+value).length) {
  			return true
  		}
  	}
  	return false
  }

/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);