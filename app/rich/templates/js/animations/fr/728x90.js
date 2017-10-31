var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy1', 1.5, {opacity: 1})
            .addDelay(2.5, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 1, {opacity: 0})
            .to('.copy2', 1, {opacity: 1}, '-=1')
            .addDelay(1, 'frame3')
        timeline.add('frame3')
            .to('.cta', 0.5, {opacity: 1})
        timeline.add('frame4')