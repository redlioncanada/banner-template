var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy1', 1, {opacity: 1})
            .addDelay(2, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 0.5, {opacity: 0})
            .to('.background2', 1, {opacity: 1})
            .addDelay(1, 'frame3')
        timeline.add('frame3')
            .to('.copy2', 1, {opacity: 1})
            .to('.cta', 1, {opacity: 1}, '-=1')
            .addDelay(2, 'frame4')
        timeline.add('frame4')