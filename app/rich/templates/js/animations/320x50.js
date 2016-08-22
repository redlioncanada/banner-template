var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy', 0.8, {left:0})
            .addDelay(3, 'frame2')
        timeline.add('frame2')
            .to('.copy', 0.6, {opacity:0})
            .to('.cta', 0.6, {opacity:1})
            .addDelay(2, 'frame3')
        timeline.add('frame3')
            .to('.cta', 0.8, {opacity:1})
        timeline.add('frame4')