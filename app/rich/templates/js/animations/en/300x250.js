var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete}); 
        timeline.add('frame1')
            .addDelay(2.7)
            .to('.copy1', 1, { opacity: 0 })
            .to('.background1', 13, { scale: 1.1 }, '-=3')
			.to('.copy2', 1, {opacity: 1 }, '-=9')
			.addDelay(2.7)
			.to('.copy2, .copy4, .vertical-bar', 1, {opacity: 0}, '-=7')
			.to('.copy3, .cta', 1, {opacity: 1}, '-=5')
		timeline.add('frame2')