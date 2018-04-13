var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
    timeline.add('frame1')
        .to('.copy1', 1, {opacity: 1})
		.addDelay(2, 'frame2')
	timeline.add('frame2')
		.to('.wipe', 0.8, { width: 810 })
		.to('.wipe-line', 0.8, { left: 810 }, '-=0.8')
		.to('.wipe-line', 0.3, { left: 820 })
        .to('.background1', 0, { opacity: 0 })
        .to('.copy2', 0, {opacity: 1})
		.addDelay(1, 'frame3')
	timeline.add('frame3')
		.addDelay(0.5, 'cta')
		.to('.cta', 1, { opacity: 1 }).add('cta')
	timeline.add('frame4')