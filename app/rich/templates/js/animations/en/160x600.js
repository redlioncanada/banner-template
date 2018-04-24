var easeIn = Power1.easeIn;
var easeOut = Power0.easeNone;
var timeline = new TimelineLite({onComplete: onComplete}); 
		timeline.add('frame1')
			.addDelay(2.7)
			.to('.copy1', 1, {opacity: 0})
			.to('.background1', 2, {ease: easeOut, left: -55 }, '-=1')
		timeline.add('frame2')
			.to('.copy2', 1, {opacity: 1})
			.addDelay(2.7)
		timeline.add('frame3')
			.to('.copy2', 1, {opacity: 0})
			.to('.copy3', 1, {opacity: 1})
			.addDelay(2.3)
		timeline.add('frame 4')
			.to('.copy4', 0.5, {opacity: 0})
			.to('.cta', 1, {opacity: 1})
		timeline.add('frame 5')