var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.logo', 0, {opacity:1}, 'start')
        timeline.add('frame2')
            .to('.masks .top', 1, {width:86})
            .to('.masks .left', 1, {width:75})
            .addDelay(0.5, 'frame3')
        timeline.add('frame3')
            .to('.copy1', 2, {opacity:1, ease:easeOut})
        timeline.add('frame4')
            .to('.cta', 2, {opacity:1, ease:easeOut})
        //     .to('.copy1', 1.5, {opacity: 0, ease: easeOut}, 'frame2')
        //     .to('.copy2', 1.5, {opacity:1, ease:easeIn}, 'frame2')
        //     .addDelay(1, 'frame3')
        // timeline.add('frame3')
        //     .to('.cta', 1.5, {opacity:1, ease:easeIn}, 'frame3')
        // timeline.add('frame4').add('end');