/**
 * Lightbox build guide is available here:
 * https://support.google.com/richmedia/answer/6081524
 */
// Reference to the creative's various properties and elements.
var creative = {};


/**
 * Update the line below to specify all counter events in the expanded state
 * of the ad that are triggered by user interaction.
 */
var chargeableInterstitialEvents = ['Background Click'];


/**
 * Add additional studio modules you want to load to this list.
 * Do not remove the GDN module.
 */
var modulesToLoad = [studio.module.ModuleId.GDN];


/**
 * Called on the window load event.
 */
function preInit() {
  // Do not change these lines.
  internalPreInit();
  setupDom();
}

/**
 * Set up references to DOM elements.
 */
function setupDom() {
  creative.dom = {};
  creative.dom.mainContainer = document.getElementById('main-container');
  creative.dom.lightboxExit = document.getElementById('lightbox-exit');
  creative.dom.lightboxState = document.getElementById('lightbox-state');
  creative.dom.lightboxFeature = document.getElementById('lightbox-feature');
  creative.dom.invitationState = document.getElementById('invitation-state');
  creative.dom.expandHoverCta = document.getElementById('invitation-hover-cta');
  creative.dom.expandTapCta = document.getElementById('invitation-tap-cta');
  creative.dom.xt5Exit = document.getElementById('xt5-exit');
  creative.dom.atsExit = document.getElementById('ats-exit');
  creative.dom.escaladeExit = document.getElementById('escalade-exit');

  // It is not safe to use other creative.* fields until after the init()
  // method has been called which indicates the Enabler has initialized
  // and loaded its additional modules.
  if (creative.isTouchable) {
    creative.dom.expandHoverCta.style.display = 'none';
    creative.dom.expandTapCta.style.display = 'block';
  } else {
    creative.dom.expandHoverCta.style.display = 'block';
    creative.dom.expandTapCta.style.display = 'none';
  }
  creative.dom.image0 = document.getElementById('invitation-background');

}

/**
 * The Enabler is now initialized and any extra modules have been loaded.
 */
function init() {
  console.log('init')
  // Do not change these lines.
  internalInit();
  addListeners();
  show();
  aload();
}

/**
 * Add appropriate listeners after the creative's DOM has been set up.
 */
function addListeners() {
  // Add listeners on the expanded state to report interactions.
  creative.dom.lightboxFeature.addEventListener('click', function() {
    Enabler.counter('Background Click');
  }, false);

  // Add more listeners to the expanded state elements.
  // creative.dom.lightboxExit.addEventListener('click', function() {exitClickHandler('Background');});
  creative.dom.xt5Exit.addEventListener('click', function(){exitClickHandler('XT5');});
  creative.dom.atsExit.addEventListener('click', function(){exitClickHandler('ATS');});
  creative.dom.escaladeExit.addEventListener('click', function(){exitClickHandler('Escalade');});

  if (creative.isFullscreenSupported) {
    if (creative.isTouchable) {
      // Do not use the touchstart or touchend events to trigger
      // expansion on touch devices. Creatives using those events trigger
      // expansion when users touch the ad while scrolling past, which is a
      // violation of lightbox creative policies. Instead, use the click event,
      // which will not fire when the user touches the ad while scrolling.
      creative.dom.invitationState.addEventListener(
          'click', onExpandHandler, false);
    } else {
      creative.dom.invitationState.addEventListener(
          'mouseover', onExpandHandler, false);
    }

    internalAddFullscreenExpansionListeners();
  }
}

/**
 *  Shows the ad.
 */
function show() {
    internalShow();
}

// ---------------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------------

/**
 * Calculate the creative's expanded dimensions from available dimensions.
 */
function calculateCustomDimensions(availableWidth, availableHeight) {
  // If the screen is taller than it is wide we use the portrait aspect ratio.
  var portrait = availableWidth < availableHeight;

  // The aspect ratio that the creative will maintain when expanded.
  // In landscape mode we use a 16:9 aspect ratio and in portrait we use 9:16.
  // Edit the numeric values in the 2 rows below to change the ratio.
  var landscapeAspectRatio = 16 / 9;
  var portraitAspectRatio = 9 / 16;

  // Choose which aspect ratio to use, portrait or landscape.
  var aspectRatio = landscapeAspectRatio;
  if (portrait) {
    aspectRatio = portraitAspectRatio;
  }
  var width, height;

  // Find the dimensions which will fill the most pixels in the screen given the
  // selected aspect ratio.
  if (aspectRatio > (availableWidth / availableHeight)) {
    width = availableWidth;
    height = 1 / aspectRatio * width;
  } else {
    height = availableHeight;
    width = aspectRatio * height;
  }

  // Optionally perform any extra calculations.

  // When served in-app, creatives will ignore these width/height values and
  // expand to the dimensions of the screen.
  var dimensions = {
    'width': width,
    'height': height
  };
  return dimensions;
}


/**
 * Handle when the viewport resizes (expansion, collapse, the window
 * changing size while expanded).
 */
function viewportResizeHandler() {
  if (creative.isCollapsing) {
    Enabler.stopTimer('Panel Expansion');
    Enabler.counter('Collapse Ctr');
    renderCollapsedView();
  } else {
    if (!creative.isExpanded) {
      // Optionally animate the expansion before rendering the expanded layout.

      Enabler.startTimer('Panel Expansion');
      Enabler.counter('Expanded Ctr');
    }
    renderExpandedView();
  }
}


/**
 * Render the expanded state of the creative.
 */
function renderExpandedView() {
  creative.dom.lightboxState.style.display = 'block';
  creative.dom.lightboxExit.style.display = 'block';
  creative.dom.invitationState.style.display = 'none';
  creative.isExpanded = true;
}


/**
 * Handle the FULLSCREEN_COLLAPSE_START event.
 */
function collapseStartHandler() {
  // Optionally perform an animation before collapsing.

  // Note the creative is collapsing so the viewportResizeHandler knows how to
  // redraw the creative.
  creative.isCollapsing = true;
  Enabler.finishFullscreenCollapse();
}


/**
 * Render the collapsed (invitation) state of the creative.
 */
function renderCollapsedView() {
  creative.dom.lightboxState.style.display = 'none';
  creative.dom.lightboxExit.style.display = 'none';
  creative.dom.invitationState.style.display = 'block';
  creative.isExpanded = false;
  creative.isCollapsing = false;
}


/**
 * Handle exit clicks.
 */
function exitClickHandler(keyword) {
  // In-app iOS environments known issue: calling collapse on an exit
  // causes the landing page to close immediately so we leave it expanded
  // on exit.
  // In other environments it is required that the ad collapses on exit
  // click per policy.
  if (!(creative.isInApp && isMobile.iOS())) {
    Enabler.requestFullscreenCollapse();
  }
  Enabler.stopTimer('Panel Expansion');

  if (typeof keyword !== 'undefined') {
    Enabler.exit(keyword + ' Exit');
  } else {
    Enabler.exit('Exit');
  }
}

// Add any custom functions here.


// -----------------------------------------------------------------------------
// You should not have to change the code below.
// -----------------------------------------------------------------------------


function internalPreInit() {
  // Initialize state variables such as creative.isExpanded.
  setupCreativeState();

  if (Enabler.isInitialized()) {
    // Load the GDN module before initializing.
    Enabler.loadModules(modulesToLoad, modulesLoadedHandler);
  } else {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, function() {
      Enabler.loadModules(modulesToLoad, modulesLoadedHandler);
    });
  }
}


/**
 * Once modules have been loaded, check if the creative is serving in-app or as
 * an interstitial. This needs to happen before
 * initialization because interstitials require different behavior than normal
 * lightbox creatives.
 */
function modulesLoadedHandler() {
  studio.sdk.gdn.getInitializedConfigByCallback(function(gdnConfig) {
    creative.isInApp =
        (gdnConfig.getClientEnvironment().browserClass ==
         studio.sdk.gdn.BrowserClass.IN_APP);
    // gdnConfig.isInterstitial is set via a callback function.
    gdnConfig.isInterstitial(function(state) {
      creative.isInterstitial = state;
      Enabler.addEventListener(
          studio.events.StudioEvent.FULLSCREEN_SUPPORT, function(e) {
            creative.isFullscreenSupported = e.supported;
            init();
          });
      Enabler.queryFullscreenSupport();
    });
  });
}


function internalInit() {
  // The resize listener is always added in order to support responsive
  // behavior (for example, to resize if the user changes device
  // orientation).
  window.addEventListener('resize', viewportResizeHandler);
}


function internalShow() {
  if (creative.isInterstitial) {
    // Render the creative in its expanded state within its current ad slot.
    renderExpandedView();
    // Register the chargeable events that have been specified in
    // chargeableInterstitialEvents above with the Enabler.
    registerChargeableInterstitialEvents();
  } else {
    // Polite loading
    if (Enabler.isVisible()) {
      renderCollapsedView();
    } else {
      Enabler.addEventListener(
          studio.events.StudioEvent.VISIBLE, renderCollapsedView);
    }
  }
}


/**
 * Helper method to register all chargeable events when the creative is
 * serving as an interstitial.
 */
function registerChargeableInterstitialEvents() {
  for (var event in chargeableInterstitialEvents) {
    Enabler.registerChargeableEventName(chargeableInterstitialEvents[event]);
  }
}


/**
 * Initializes state variables used to render the creative.
 */
function setupCreativeState() {
  // Whether or not the page supports touch events.
  creative.isTouchable = isMobile.any();
  // If the creative is serving as an interstitial.
  creative.isInterstitial = false;
  // If the creative is serving in an in-app environment.
  creative.isInApp = false;
  // If fullscreen expansion is supported.
  creative.isFullscreenSupported = false;
  // Whether or not the creative should request expansion when it receives the
  // fullscreen dimensions.
  creative.shouldRequestExpansion = false;
  // Whether or not the creative is currently expanded.
  creative.isExpanded = false;
  // Whether or not the creative is in the process of collapsing.
  creative.isCollapsing = false;
}


/**
 * Add listeners required for the expansion lifecycle.
 */
function internalAddFullscreenExpansionListeners() {
  Enabler.addEventListener(
      studio.events.StudioEvent.FULLSCREEN_DIMENSIONS,
      fullscreenDimensionsHandler);
  Enabler.addEventListener(
      studio.events.StudioEvent.FULLSCREEN_EXPAND_START, expandStartHandler);
  Enabler.addEventListener(
      studio.events.StudioEvent.FULLSCREEN_COLLAPSE_START,
      collapseStartHandler);

  // The ad responds to viewport changes by providing new expanded dimensions.
  // This should be set after listeners are set up, but before requesting
  // expansion for the first time.
  Enabler.setResponsiveExpanding(true);
}


/**
 * Handle a user interaction causing expansion (could be click or hover).
 */
function onExpandHandler() {
  if (creative.isExpanded) {
    // If the creative is already expanded, do nothing.
    return;
  }

  // Request the available dimensions to use for expanding.
  creative.shouldRequestExpansion = true;
  Enabler.queryFullscreenDimensions();
}


/**
 * Handles the FULLSCREEN_DIMENSIONS event.
 */
function fullscreenDimensionsHandler(e) {
  // When served in-app creatives will always expand or resize fullscreen, and
  // the custom expanded dimensions determined below will be ignored.
  var availableWidth = e.width;
  var availableHeight = e.height;

  // Calculate custom dimensions.
  var dimensions = calculateCustomDimensions(availableWidth, availableHeight);

  // If we asked for the dimensions in response to a user interaction,
  // expand now.
  // Creatives served in-app will ignore specified width/height values.
  if (creative.shouldRequestExpansion) {
    Enabler.requestFullscreenExpand(dimensions.width, dimensions.height);
    creative.shouldRequestExpansion = false;
  } else {
    // There was a responsive resize event, so update the size of the ad.
    Enabler.setResponsiveSize(dimensions.width, dimensions.height);
  }
}


/**
 * Handle the FULLSCREEN_EXPAND_START event.
 */
function expandStartHandler() {
  Enabler.finishFullscreenExpand();
}


/**
 * Mobile detection.
 */
var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
    return !!(isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() ||
            isMobile.Opera() || isMobile.Windows()) &&
        hasTouchScreen();
  }
};


/**
 * Touch screen detection.
 */
var hasTouchScreen = function() {
  var n = !1, o = function(n) {
    return -1 !== window.navigator.userAgent.toLowerCase().indexOf(n);
  };
  return ('ontouchstart' in window || navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0) &&
             (o('NT 5') || o('NT 6.1') || o('NT 6.0') || (n = !0)),
         n;
};


/**
 *  Main onload handler
 */
window.addEventListener('load', preInit);