var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
        timeline.add('frame2')
            .to('#gradient', 1, {left:30})
            .addDelay(1.5, 'frame3');
        timeline.add('frame3')
            .to('#copy1', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame4');
        timeline.add('frame4')
            .to('#gradient', 0.8, {left:-({width}-30), ease:easeIn}, 'frame4')
            .to('#background3', 0.8, {left:0, ease:easeIn}, 'frame4')
            .to('#copy1', 0.8, {opacity:0, ease:easeOut}, 'frame4')
            .to('#background2', 0.8, {opacity:1, ease:easeIn})
            .to('#copy2, #cta', 0.8, {opacity:1, ease:easeIn});
        timeline.add('frame5').add('end');
