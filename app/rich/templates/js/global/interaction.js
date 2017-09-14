var AnimatedElement = Class.extend({
	constructor: function(target) {
		this.parent = target
	},

	hide: function(callback, animate) {
		if (typeof animate === 'undefined') {
			animate = true
		}

		var timeout = !!animate ? 400 : 0
		this.parent.stop(true).animate({ opacity: 0 }, timeout, function() {
			this.parent.css('display', 'none')
			if (typeof callback === 'function') {
				callback.call()
			}
		}.bind(this))
	},

	show: function(callback, animate) {
		if (typeof animate === 'undefined') {
			animate = true
		}

		var timeout = !!animate ? 400 : 0
		this.parent.css('display', 'block')
		this.parent.stop(true).animate({ opacity: 1 }, timeout)
		if (typeof callback === 'function') {
			callback.call()
		}
	}
})

var Slide = Class.extend({
	constructor: function(id, target) {
		target = $(target)
		this.id = id
		this.active = false
		this.hidden = true
		this.elements = {
			base: new AnimatedElement(target),
			layers: {
				normal: new AnimatedElement(target.find('.layer.normal')),
				activated: new AnimatedElement(target.find('.layer.activated'))
			},
			slider: {
				base: new AnimatedElement(target.find('.slider .slider-control')),
				hitbox: new AnimatedElement(target.find('.slider .slider-control-hitbox')),
				indicator: new AnimatedElement(target.find('.slider .slider-indicator')),
				background: new AnimatedElement(target.find('.slider .slider-background'))
			}
		}

		var domElement = this.elements.slider.hitbox.parent[0],
			domElement1 = this.elements.slider.base.parent[0],
			zt = new ZingTouch.Region(document.body)

		zt.bind(domElement, new ZingTouch.Pan(), this.onSliderSwipe.bind(this))
		zt.bind(domElement1, new ZingTouch.Pan(), this.onSliderSwipe.bind(this))
		this.elements.slider.base.parent.click(this.onSliderClick.bind(this))
	},

	activate: function() {
		this.elements.layers.activated.parent.addClass('active')
		this.elements.layers.normal.parent.removeClass('active')
		this.elements.slider.indicator.parent.css({
			left: 'initial',
			right: '2px'
		})
		this.active = true
	},

	deactivate: function() {
		this.elements.layers.normal.parent.addClass('active')
		this.elements.layers.activated.parent.removeClass('active')
		this.elements.slider.indicator.parent.css({
			left: '2px',
			right: 'initial'
		})
		this.active = false
	},

	hide: function() {
		this.elements.base.hide()
		this.hidden = true
	},

	show: function() {
		this.elements.base.show()
		this.hidden = false
	},

	onSliderClick: function(event) {
		if (this.active) {
			this.deactivate()
		} else {
			this.activate()
		}
	},

	onSliderSwipe: function(event) {
		var directionData = event.detail.data[0]
		if (directionData.distanceFromOrigin >= 30) {
			if ((directionData.currentDirection >= 0 && directionData.currentDirection <= 90) || (directionData.currentDirection >= 270 && directionData.currentDirection <= 360)) {
				if (!this.active) {	//swiped right
					this.activate()
				}
			} else {
				if (this.active) { //swiped left
					this.deactivate()
				}
			}
		}
	}
})

var Gallery = Class.extend({
	constructor: function(target) {
		this.parent = $(target)
		this.slides = []

		$.each(this.parent.find('.slide'), function(key, value) {
			var slide = new Slide(key, value)
			if (key === 0) {
				slide.show()
			} else {
				slide.hide()
			}
			this.slides.push(slide)
		}.bind(this))

		this.slideCount = this.slides.length
		this.currentSlide = 0
	},

	forEach: function(callback) {
		if (typeof callback !== 'function') {
			return
		}
		for (var index in this.slides) {
			var value = this.slides[index]
			callback.call(callback, Number(index), value, this)
		}
	},

	goTo: function(index) {
		if (index < 0) {
			index = this.slideCount - 1
		} else if (index > this.slideCount - 1) {
			index = 0
		}

		for (var index1 = 0; index1 < this.slides.length; index1++) {
			var slide = this.slides[index1]

			if (index1 === index) {
				slide.show()
			} else {
				slide.hide()
			}
		}
		this.currentSlide = index
	},

	previous: function() {
		this.goTo(--this.currentSlide)
	},

	next: function() {
		this.goTo(++this.currentSlide)
	}
})

var GalleryControls = Class.extend({
	constructor: function(target, gallery) {
		target = $(target)
		this.gallery = gallery
		this.elements = {
			base: new AnimatedElement(target),
			arrows: {
				left: new AnimatedElement(target.find('.arrow-left')),
				right: new AnimatedElement(target.find('.arrow-right'))
			},
			dots: []
		}
		this.enum = {
			ARROWS: {
				LEFT: 0,
				RIGHT: 1
			}
		}

		gallery.forEach(function(index) {
			var element = new AnimatedElement(target.find('.dots .dot').eq(index))

			element.parent.click(function(event) {
				this.onDotClick(index, event)
			}.bind(this))

			this.elements.dots.push(element)
		}.bind(this))

		this.elements.arrows.left.parent.click(function(event) {
			this.onArrowClick(this.enum.ARROWS.LEFT, event)
		}.bind(this))

		this.elements.arrows.right.parent.click(function(event) {
			this.onArrowClick(this.enum.ARROWS.RIGHT, event)
		}.bind(this))
	},

	onDotClick: function(index, event) {
		this.gallery.goTo(index)
		this.activateDot(this.gallery.currentSlide)
	},

	onArrowClick: function(direction, event) {
		if (direction === this.enum.ARROWS.LEFT) {
			this.gallery.previous()
		} else if (direction === this.enum.ARROWS.RIGHT) {
			this.gallery.next()
		}
		this.activateDot(this.gallery.currentSlide)
	},

	activateDot: function(index) {
		for (var index1 = 0; index1 < this.elements.dots.length; index1++) {
			var dot = this.elements.dots[index1]
			if (index1 === index) {
				dot.parent.addClass('active')
			} else {
				dot.parent.removeClass('active')
			}
		}
	}
})

var gallery = new Gallery('.gallery'),
	controls = new GalleryControls('.gallery-controls', gallery)