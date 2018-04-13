var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
    timeline.add('frame1')
        .to('.copy1', 1, {opacity: 1})
		.addDelay(2, 'frame2')
    timeline.add('frame2')
        .to('.background2', 1, {opacity: 1})
        .to('.background1', 0, { opacity: 0 })
		.addDelay(2.7, 'frame3')
    timeline.add('frame3')
        .to('.wipe', 0.8, { width: 810 })
        .to('.wipe-line', 0.8, { left: 810 }, '-=0.8')
        .to('.wipe-line', 0.3, { left: 820 })
		.addDelay(1, 'frame4')
    timeline.add('frame4')
        .to('.cta', 1, { opacity: 1 })
    timeline.add('frame5')
