
var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy1', 1.2, {left:0})
            .addDelay(3, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 0.6, {left:-{width}})
            .to('.copy2', 0.6, {left:0})
            .addDelay(3, 'frame3')
        timeline.add('frame3')
            .to('.copy2', 0.6, {opacity:0})
            .to('.cta', 0.6, {opacity:1})
            .addDelay(2, 'frame4')
        timeline.add('frame4')
            .to('.cta', 0.8, {opacity:1})
timeline.add('frame5')


