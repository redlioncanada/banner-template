/**
 * Called on the window load event.
 */
function preInit() {
	if (Enabler.isInitialized()) {
			init()
	} else {
		Enabler.addEventListener(
			studio.events.StudioEvent.INIT,
			init
		)
	}
}

/**
 * The Enabler is now initialized and any extra modules have been loaded.
 */
function init() {
	addListeners()
}

/**
 * Add appropriate listeners after the creative's DOM has been set up.
 */
function addListeners() {
	$('#main-container').mousedown(mousedownHandler)
	$('#main-container').mouseup(mouseupHandler)
}


// ---------------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------------

var mousedownShouldExit = true,  //tracks whether a click started on an element we should close on, necessary since we have a swipe event
	exclude = ['yt-close', 'slider-control-hitbox', 'slider-control', 'gallery-controls', 'slider-indicator']
function mouseupHandler(event) {
	if (!mousedownShouldExit) {
		mousedownShouldExit = true
		return
	}

  	if (shouldExit(exclude, event.target)) {
  		var exitName = 'ATSExit'
  		switch(gallery.currentCarModel()) {
			case gallery.enum.CAR_MODELS.ATS:
				exitName = 'ATSExit'
				break
			case gallery.enum.CAR_MODELS.XT5:
				exitName = 'XT5Exit'
				break
			case gallery.enum.CAR_MODELS.ESCALADE:
				exitName = 'EscaladeExit'
				break
		  }
		  
		gallery.stopAutoplay()
		Enabler.exit(exitName);
  	}
}

function mousedownHandler(event) {
	console.log(event.target)
	mousedownShouldExit = shouldExit(exclude, event.target)
}

function shouldExit(classes, target) {
  	for (var index in classes) {
  		var value = classes[index]
  		if (target.className.indexOf(value) > -1 || $(target).closest('.'+value).length) {
  			return false
  		}
  	}
  	return true
  }

/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);