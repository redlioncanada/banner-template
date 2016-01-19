var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .addDelay(2, 'frame1');
        timeline.add('frame2')
            .to('#gradient, #copy1', 1, {opacity:1, ease:easeIn})
            .addDelay(2, 'frame3');
        timeline.add('frame3')
            .to('#copy1', 1, {opacity:0, ease:easeOut})
            .to('#copy2', 1, {opacity:1, ease:easeIn})
            .addDelay(2, 'frame4');
        timeline.add('frame4')
            .to('#copy2', 1, {opacity:0, ease:easeOut})
            .to('#background2', 1, {opacity:1, ease:easeIn})
            .to('#copy3, #cta', 1, {opacity:1, ease:easeIn});
        timeline.add('frame5').add('end');