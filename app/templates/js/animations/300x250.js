var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
        timeline.add('frame2')
            .to('#gradient', 1, {left:70})
            .addDelay(1.5, 'frame3');
        timeline.add('frame3').add('start')
            .to('#copy1-prefix', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame3-highlight')
            .to('#copy1-highlight', 0.8, {opacity:1, ease:easeIn}).add('frame3-highlight')
            .addDelay(1.5, 'frame3-suffix')
            .to('#copy1-suffix', 0.8, {opacity:1, ease:easeIn}).add('frame3-suffix')
            .addDelay(2, 'frame4');
        timeline.add('frame4')
            .to('#copy1-prefix,#copy1-highlight,#copy1-suffix', 0.8, {opacity:0, ease:easeOut})
            .to('#copy2', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame5');
        timeline.add('frame5')
            .to('#gradient', 0.8, {left:-({width} - 70), ease:easeIn}, 'frame5')
            .to('#background3', 0.8, {left:0, ease:easeIn}, 'frame5')
            .to('#copy2', 0.8, {opacity:0, ease:easeOut}, 'frame5')
            .to('#background2', 0.8, {opacity:1, ease:easeIn})
            .to('#copy3, #cta', 0.8, {opacity:1, ease:easeIn});
        timeline.add('frame6').add('end');