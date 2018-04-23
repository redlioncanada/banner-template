var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete}); 
		timeline.add('frame1')
			.to('.copy1', 1, {opacity: 0})
		timeline.add('frame2')
			.to('.copy2', 1, {opacity: 1})
			.to('.background1', 1, { left: 0 })
		timeline.add('frame3')
			.to('.copy2', 1, {opacity: 0})
			.to('.copy3', 1, {opacity: 1})
		timeline.add('frame4')
			.to('.copy4, .vertical-bar', 1, {opacity: 0})
			.to('.cta', 1, {opacity: 1})
		timeline.add('frame5')