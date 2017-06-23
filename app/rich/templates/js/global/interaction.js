(function() {
	var element = function(selector) {
		var el = $(selector);

		return {
			element: el,
			hide: function(needle) {
				if (typeof needle !== 'undefined') {
					var target = el.find(needle);
					target.stop(true).animate({
						opacity: 0
					}, 400, function() {
						if (target.css('opacity') === 0) target.css('visibility', 'hidden');
					});
				} else {
					el.stop(true).animate({
						opacity: 0
					}, 400, function() {
						if (el.css('opacity') === 0) el.css('visibility', 'hidden');
					});
				}
			},
			show: function(needle) {
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

		function model(model) {
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
			parent.cta.hide('.model');
			parent.cta.show(modelSelector)

			//toggle car selector to the correct model
			parent.carSelector.element.find('.active').removeClass('active');
			parent.carSelector.element.find(modelSelector).addClass('active');
		}

		function feature(feature, index) {
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
				controlsHidden = false;
				parent.galleryControls.show();
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
			toggle.model(model);
		});

		parentElements.copySelector.element.find('.selector').click(function(event) {
			var target = $(event.currentTarget),
				feature = target.attr('data-feature');

			if (target.hasClass('active')) return;
			toggle.feature(feature);
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
