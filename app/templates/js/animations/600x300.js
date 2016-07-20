var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.background1', 9, {css:{transform: 'matrix(1.3, 0, 0, 1.3, -90, 0)'}})
            .to('.background1', 1, {opacity: 0, ease:easeOut}, 8)
        timeline.add('frame2')
            .addDelay(1.4, 'frame2copy')
            .to('.copy1', 0.8, {opacity: 0, ease: easeOut}).add('frame2copy')
            .to('.logo', 0.8, {opacity:1, ease:easeIn})
            .addDelay(0.7, 'frame3')
        timeline.add('frame3')
            .to('.copy2,.cta', 1, {opacity:1, ease:easeIn})
        timeline.add('frame4').add('end');