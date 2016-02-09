var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('#copy1-prefix', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame1-highlight')
            .to('#copy1-highlight', 0.8, {opacity:1, ease:easeIn}).add('frame1-highlight')
            .addDelay(1.5, 'frame1-suffix')
            .to('#copy1-suffix', 0.8, {opacity:1, ease:easeIn}).add('frame1-suffix')
            .addDelay(2, 'frame2');
        timeline.add('frame2')
            .to('#copy1-prefix,#copy1-highlight,#copy1-suffix', 0.8, {opacity:0, ease:easeOut})
            .to('#copy2', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame3');
        timeline.add('frame3')
            .to('#gradient', 0.8, {left:-165, ease:easeIn}, 'frame3')
            .to('#background3', 0.8, {left:0, ease:easeIn}, 'frame3')
            .to('#copy2', 0.8, {opacity:0, ease:easeOut}, 'frame3')
            .to('#background2', 0.8, {opacity:1, ease:easeIn})
            .to('#copy3, #cta', 0.8, {opacity:1, ease:easeIn});
        timeline.add('frame4').add('end');
