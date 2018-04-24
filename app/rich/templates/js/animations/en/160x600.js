
var easeIn = Power1.easeIn;
var easeOut = Power0.easeNone;
var timeline = new TimelineLite({onComplete: onComplete}); 
		timeline.add('frame1')
			.addDelay(2.7)
			.to('.copy1', 1, {opacity: 0})
			.to('.background1', 1, {ease: easeOut, left: 0 }, '-=1')
		timeline.add('frame2')
			.to('.copy2', 1, {opacity: 1})
			.addDelay(2.7)
		timeline.add('frame3')
			.to('.copy2, .copy4, .vertical-bar', 1, {opacity: 0})
			.to('.copy3, .cta', 1, {opacity: 1})
		timeline.add('frame4')