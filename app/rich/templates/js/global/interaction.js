var Observer = Class.extend({
	constructor: function() {
		this.subjects = {}
	},

	on: function(event, callback) {
		if (typeof callback !== 'function') {
			return
		}

		if (!(event in this.subjects)) {
			this.subjects[event] = []
		}

		this.subjects[event].push({
			callback: callback
		})
	},

	emit: function(event, args) {
		if (event in this.subjects) {
			for (var index in this.subjects[event]) {
				var subject = this.subjects[event][index]
				subject.callback.apply(this, args)
			}
		}
	},

	off: function(event, callback) {
		if (event in this.subjects) {
			if (typeof callback === 'function') {
				for (var index in this.subjects[event]) {
					var subject = this.subjects[event][index]
					if (subject.callback === callback) {
						this.subjects[event].splice(index, 1)
						index--
					}
				}
			} else {
				delete this.subjects[event]
			}
		}
	},
})

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
		this.parent.stop(true).animate({ opacity: 1 }, timeout, function() {
			if (typeof callback === 'function') {
				callback.call()
			}
		}.bind(this))
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

	activate: function(callback) {
		this.elements.layers.activated.parent.addClass('active')
		this.elements.layers.normal.parent.removeClass('active')
		this.elements.slider.indicator.parent.css({
			left: 'initial',
			right: '7px'
		})

		setTimeout(function() {	//animation time defined in css
			this.active = true
			if (typeof callback === 'function') {
				callback.call(this)
			}
		}.bind(this), 400)
	},

	deactivate: function() {
		this.elements.layers.normal.parent.addClass('active')
		this.elements.layers.activated.parent.removeClass('active')
		this.elements.slider.indicator.parent.css({
			left: '7px',
			right: 'initial'
		})

		setTimeout(function() {	//animation time defined in css
			this.active = false
			if (typeof callback === 'function') {
				callback.call(this)
			}
		}.bind(this), 400)
	},

	hide: function(callback, animate) {
		this.elements.base.hide(function() {
			this.hidden = true
			if (typeof callback === 'function') {
				callback.call(this)
			}
		}.bind(this), animate)
	},

	show: function(callback, animate) {
		this.elements.base.show(function() {
			this.hidden = false
			if (typeof callback === 'function') {
				callback.call(this)
			}
		}.bind(this), animate)
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
		if (directionData.distanceFromOrigin >= 20) {
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

var Gallery = Observer.extend({
	constructor: function(target) {
		this.parent = $(target)
		this.slides = []
		this.subjects = {}

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
		this.autoplayTime = 0
		this.animating = false
		this.interval = undefined
		this.autoplayInterval = undefined
		this.enum = {
			CAR_MODELS: {
				ATS: 0,
				XT5: 1,
				ESCALADE: 2
			},
			EVENTS: {
				BEFORE_NAVIGATION: 0,
				AFTER_NAVIGATION: 1,
				AFTER_AUTOPLAY: 2
			},
			MAX_AUTOPLAY_TIME: 30000
		}
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

	goTo: function(nextIndex, userInteracted) {
		if (this.animating) {
			return
		}
		this.animating = true
		var slide = this.slides[this.currentSlide]

		if (nextIndex < 0) {
			nextIndex = this.slideCount - 1
		} else if (nextIndex > this.slideCount - 1) {
			nextIndex = 0
		}

		if (!!userInteracted) {
			this.stopAutoplay()
		}

		this.emit(this.enum.EVENTS.BEFORE_NAVIGATION, [this.currentSlide, nextIndex, slide])

		for (var index = 0; index < this.slides.length; index++) {
			var slide1 = this.slides[index]

			if (index !== nextIndex) {
				slide1.hide()
			}
		}

		this.slides[nextIndex].show(function() {
			for (var index = 0; index < this.slides.length; index++) {
				var slide1 = this.slides[index]

				if (index !== nextIndex) {
					slide1.deactivate()
				}
			}

			this.animating = false
			var previousIndex = this.currentSlide
			this.currentSlide = nextIndex
			slide = this.slides[nextIndex]
			this.emit(this.enum.EVENTS.AFTER_NAVIGATION, [previousIndex, this.currentSlide, slide])
		}.bind(this))
	},

	previous: function(userInteracted) {
		this.goTo(--this.currentSlide, userInteracted)
	},

	next: function(userInteracted) {
		this.goTo(++this.currentSlide, userInteracted)
	},

	autoplay: function(interval, callback) {
		this.stopAutoplay()

		if (typeof interval === 'undefined' && typeof this.interval !== 'undefined') {
			interval = this.interval
		}

		this.autoplayInterval = setInterval(this.onAutoplay.bind(this), interval)
		this.interval = interval
	},

	stopAutoplay: function() {
		if (typeof this.autoplayInterval !== 'undefined') {
			clearInterval(this.autoplayInterval)
			this.autoplayInterval = undefined
		}
		this.autoplayTime = 0
	},

	onAutoplay: function() {
		var slide = this.slides[this.currentSlide]

		if (slide.active) {
			this.next()
		} else {
			slide.activate()
		}

		this.autoplayTime += this.interval
		this.emit(this.enum.EVENTS.AFTER_AUTOPLAY)
	},

	currentCarModel: function() {
		return this.currentSlide
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
		this.gallery.goTo.call(gallery, index, true)
	},

	onArrowClick: function(direction, event) {
		if (direction === this.enum.ARROWS.LEFT) {
			this.gallery.previous(true)
		} else if (direction === this.enum.ARROWS.RIGHT) {
			this.gallery.next(true)
		}
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

gallery.autoplay(5000)

gallery.on(gallery.enum.EVENTS.BEFORE_NAVIGATION, function(previousIndex, currentIndex, slide) {
	controls.activateDot(currentIndex)
})

gallery.on(gallery.enum.EVENTS.AFTER_AUTOPLAY, function() {
	if (this.autoplayTime + this.interval >= this.enum.MAX_AUTOPLAY_TIME) {
		this.stopAutoplay()
	}
})