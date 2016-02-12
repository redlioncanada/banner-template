var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('#copy1 .highlight', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'copy1-prefix')
            .to('#copy1 span, #copy1-prefix span', 0.8, {opacity:1, ease:easeIn}).add('copy1-prefix')
            .addDelay(2, 'frame2');
        timeline.add('frame2')
            .to('#copy1,#copy1-prefix', 0.8, {opacity:0, ease:easeOut})
            .to('#copy2 .highlight', 0.8, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'copy2-prefix')
            .to('#copy2 span, #copy2-prefix span', 0.8, {opacity:1, ease:easeIn}).add('copy2-prefix')
            .addDelay(2.5, 'frame3');
        timeline.add('frame3')
            .to('#gradient', 0.8, {bottom:"-=134", ease:easeIn}, 'frame3')
            .to('#gradient1', 0.8, {height: 134, ease:easeIn}, 'frame3')
            .to('#background3', 0.8, {bottom: "-=134", ease:easeIn}, 'frame3')
            .to('#copy2,#copy2-prefix', 0.8, {opacity:0, ease:easeOut}, 'frame3')
            .to('#background1,#background3,#gradient,#gradient1', 0, {opacity:0})
            .to('#background2', 0.8, {opacity:1, ease:easeIn})
            .to('#copy3 span, #cta', 0.8, {opacity:1, ease:easeIn});
        timeline.add('frame4').add('end');