var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete}); 
        timeline.add('frame1')
            .addDelay(2)
            .to('.copy1', 1, { opacity: 0 })
            .to('.background1', 13, { scale: 1.1 }, '-=3')
			.to('.copy2', 1, {opacity: 1 }, '-=9')
			.addDelay(1)
			.to('.copy2', 1, {opacity: 0 }, '-=7')
			.to('.copy3', 1, {opacity: 1 }, '-=5')
		timeline.add('frame2')
			.to('.copy4', 0.5, {opacity: 0}, '-=3')
			.to('.cta', 0.5, {opacity: 1}, '-=2')
		timeline.add('frame3')