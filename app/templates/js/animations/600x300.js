var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.background1', 4, {css:{transform: 'matrix(1.2, 0, 0, 1.2, -30, 0)'}})
            .to('.background1', 1, {opacity: 0, ease:easeOut}, 2)
            .addDelay(2, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 0.8, {opacity: 0, ease: easeOut})
            .addDelay(0.5, 'frame2logo')
            .to('.logo', 0.8, {opacity:1, ease:easeIn}).add('frame2logo')
            .addDelay(1, 'frame3')
        timeline.add('frame3')
            .to('.copy2,.cta', 1.5, {opacity:1, ease:easeIn})
        timeline.add('frame4').add('end');