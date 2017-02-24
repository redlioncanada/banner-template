var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .addDelay(1, 'frame1')
            .to('.copy1', 1, {opacity: 0})
            .to('.copy2', 1, {opacity: 1})
            .addDelay(1, 'frame2')
        timeline.add('frame2')
            .to('.copy2', 1, {opacity: 0})
            .to('.copy3', 1, {opacity: 1})
            .addDelay(2.7, 'frame3')
        timeline.add('frame3')
            .to('.copy3', 1, {opacity: 0})
            .to('.cta', 0.8, {opacity: 1})
        timeline.add('frame4')