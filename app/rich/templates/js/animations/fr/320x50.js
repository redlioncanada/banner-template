var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .addDelay(2)
            .to('.background2', 1, {opacity: 1})
            .to('.copy2', 1, {opacity: 1}, '-=1')
            .addDelay(2, 'frame2')
        timeline.add('frame2')
            .to('.background3', 1, {opacity: 1})
            .to('.copy3', 1, {opacity: 1}, '-=1')
            .to('.cta', 1, {opacity: 1}, '-=1')
            .addDelay(1, 'frame3')
        timeline.add('frame3')
