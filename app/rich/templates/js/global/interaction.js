(function() {
	var element = function(selector) {
		var el = $(selector),
			hidden = false;

		return {
			element: el,
			hide: function(needle) {
				hidden = true;
				if (typeof needle !== 'undefined') {
					var target = el.find(needle);
					target.stop(true).animate({
						opacity: 0
					}, 400, function() {
						if (hidden) target.css('visibility', 'hidden');
					});
				} else {
					el.stop(true).animate({
						opacity: 0
					}, 400, function() {
						if (hidden) el.css('visibility', 'hidden');
					});
				}
			},
			show: function(needle) {
				hidden = false;
				if (typeof needle !== 'undefined') {
					var target = el.find(needle);
					target.css('visibility', 'visible').stop(true).animate({
						opacity: 1
					}, 400);
				} else {
					el.css('visibility', 'visible').stop(true).animate({
						opacity: 1
					}, 400);
				}
			}
		};
	};

	var toggler = function() {
		var parent = {
			staticCopy: element('.top .copy'),
			hero: element('.middle .hero-images'),
			carSelector: element('.middle .selectors .selectors-inner'),
			copySelector: element('.bottom .selectors'),
			cta: element('.top .cta'),
			galleryControls: element('.gallery-controls')
		};
		var currentFeature = 'technology',
			currentGalleryIndex = 1,
			controlsHidden = true;

		var toggleControls = function(show) {
			if (show) {
				controlsHidden = false;
				parent.galleryControls.show();
			} else {
				controlsHidden = true;
				parent.galleryControls.hide();
			}
		}

		var model = function(model) {
			var modelSelector = model.substring(0, 1) !== '.' ? '.' + model : model;

			//show copy at the top for this model
			parent.staticCopy.hide('.model');
			parent.staticCopy.show(modelSelector);
			parent.staticCopy.element.find('.model.active').removeClass('active');
			parent.staticCopy.element.find(modelSelector).addClass('active');

			//show hero image for this model
			parent.hero.hide('.model');
			parent.hero.show(modelSelector);
			parent.hero.element.find('.model.active').removeClass('active');
			parent.hero.element.find(modelSelector).addClass('active');

			//show the cta for this model
			// parent.cta.hide('.model:not(' + modelSelector + ')');
			parent.cta.element.find('.active').removeClass('active');
			// parent.cta.show(modelSelector);
			parent.cta.element.find(modelSelector).addClass('active');

			//toggle car selector to the correct model
			parent.carSelector.element.find('.active').removeClass('active');
			parent.carSelector.element.find(modelSelector).addClass('active');
		}

		var landing = function(model) {
			var modelSelector = model.substring(0, 1) !== '.' ? '.' + model : model,
				featureSelector = '.feature.landing';

			//show copy for landing for this model
			parent.staticCopy.hide('.model');
			parent.staticCopy.show(modelSelector);
			parent.staticCopy.hide('.feature');
			parent.staticCopy.show(featureSelector);
			parent.staticCopy.element.find('.feature.active,.model.active').removeClass('active');
			parent.staticCopy.element.find(featureSelector + ',' + modelSelector).addClass('active');

			//show hero image for landing for this model
			parent.hero.hide('.model');
			parent.hero.show(modelSelector);
			parent.hero.hide('.feature');
			parent.hero.show(featureSelector);
			parent.hero.element.find('.feature.active,.model.active').removeClass('active');
			parent.hero.element.find(featureSelector + ',' + modelSelector).addClass('active');

			//show the cta for this model
			// parent.cta.hide('.model:not(' + modelSelector + ')');
			parent.cta.element.find('.active').removeClass('active');
			// parent.cta.show(modelSelector);
			parent.cta.element.find(modelSelector).addClass('active');

			//toggle car selector to the correct model
			parent.carSelector.element.find('.active').removeClass('active');
			parent.carSelector.element.find(modelSelector).addClass('active');

			//unhighlight features at bottom
			parent.copySelector.element.find('.active').removeClass('active');

			//reset dots
			currentGalleryIndex = 1;
			parent.galleryControls.element.find('.dots .active').removeClass('active');
			parent.galleryControls.element.find('.dot').eq(0).addClass('active');
			toggleControls(false);
		}

		var feature = function(feature, index) {
			var featureDidChange = false,
				galleryIndexDidChange = false;

			if (typeof index === 'undefined' && typeof feature === 'undefined') return;
			if (typeof index !== 'undefined') {
				currentGalleryIndex = index;
				galleryIndexDidChange = true;
			} else {
				index = currentGalleryIndex;
			}
			if (typeof feature !== 'undefined') {
				currentFeature = feature;
				featureDidChange = true;
			} else {
				feature = currentFeature;
			}

			//show gallery controls on first feature interaction
			if (controlsHidden) {
				toggleControls(true);
			}

			var featureSelector = currentFeature.substring(0, 1) !== '.' ? '.' + feature : currentFeature,
				galleryImageSelector = '.gallery-' + currentGalleryIndex,
				imageSelector = featureSelector + galleryImageSelector;

			//show copy at the top for this feature
			parent.staticCopy.hide('.feature');
			parent.staticCopy.show(imageSelector);
			parent.staticCopy.element.find('.feature.active').removeClass('active');
			parent.staticCopy.element.find(imageSelector).addClass('active');

			//show hero image for this feature
			parent.hero.hide('.feature');
			parent.hero.show(imageSelector);
			parent.hero.element.find('.feature.active').removeClass('active');
			parent.hero.element.find(imageSelector).addClass('active');

			//toggle active copy class at the bottom for this feature
			if (featureDidChange) {
				parent.copySelector.element.find('.active').removeClass('active');
				parent.copySelector.element.find(featureSelector).addClass('active');
			}

			//set gallery dots for this index
			if (galleryIndexDidChange) {
				parent.galleryControls.element.find('.dots .active').removeClass('active');
				parent.galleryControls.element.find('.dot').eq(currentGalleryIndex - 1).addClass('active');
			}
		}

		return {
			parentElements: parent,
			model: model,
			feature: feature,
			landing: landing,
			nextFeatureImage: function() {
				var index = currentGalleryIndex + 1 > 3 ? 1 : currentGalleryIndex + 1;
				feature(currentFeature, index);
			},
			previousFeatureImage: function() {
				var index = currentGalleryIndex - 1 < 1 ? 3 : currentGalleryIndex - 1;
				feature(currentFeature, index);
			}
		}
	};

	$(function() {
		var toggle = toggler(),
			parentElements = toggle.parentElements;

		parentElements.carSelector.element.find('.selector').click(function(event) {
			var target = $(event.currentTarget),
				model = target.attr('data-model');

			if (target.hasClass('active')) return;
			toggle.landing(model);
		});

		parentElements.copySelector.element.find('.selector').click(function(event) {
			var target = $(event.currentTarget),
				feature = target.attr('data-feature');

			if (target.hasClass('active')) return;
			toggle.feature(feature, 1);
		});

		parentElements.galleryControls.element.find('.arrow-left').click(function(event) {
			toggle.previousFeatureImage();
		});

		parentElements.galleryControls.element.find('.arrow-right').click(function(event) {
			toggle.nextFeatureImage();
		});

		parentElements.galleryControls.element.find('.dots .dot').click(function(event) {
			var target = $(event.currentTarget),
				index = Number(target.attr('data-index'));

			toggle.feature(undefined, index);
		});
	});
})();
