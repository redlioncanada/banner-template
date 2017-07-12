var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .addDelay(2)
            .to('.background2', 0.5, {left: 0})
            .addDelay(2, 'frame2')
        timeline.add('frame2')
            .to('.background3', 0.5, {left: 0})
            .to('.background4', 0.2, {opacity: 1})
            .addDelay(2, 'frame3')
        timeline.add('frame3')
        .to('.background1, .background2, .background3', 1, {opacity: 0})
            .to('.copy1', 1, {opacity: 0},'-=1')
            .to('.copy2', 1, {opacity: 1},'-=1')
        timeline.add('frame4')
            .to('.cta', 1, {opacity: 1})
        timeline.add('frame5')