var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy-event-1', 1, {left: -170})
            .to('.copy-event-2', 0.5, {left: -170}, '-=0.3')
            .to('.copy-event-3', 0.5, {left: -170}, '-=0.3')
            .addDelay(2.7, 'frame2')
        timeline.add('frame2')
            .to('.copy-event', 1, {opacity: 0})
            .to('.copy1', 1, {top: 0})
            .to('.copy2', 1, {opacity: 1})
            .addDelay(2, 'frame3')
        timeline.add('frame3')
            .to('.copy2', 1, {opacity: 0})
            .to('.copy3', 1, {opacity: 1})
            .to('.copy4', 1, {opacity: 1})
            .to('.cta', 0.8, {opacity: 1})
        timeline.add('frame4')