var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
       timeline.add('frame1').add('start')
        .to('.stars', 1.5, {opacity: 1, ease: easeIn})
        .addDelay(2)
        .to('.stars', 1.5, {opacity: 0, ease: easeOut})
        .to('.test,.legal', 1.5, {opacity:1, ease:easeIn})
        .addDelay(3, 'frame2')
        timeline.add('frame2')
        .to('#backgroundfade,.stars,.test,.legal', 2, {opacity:0, ease:easeOut})
        .to('#bg2', 1, {opacity:1, ease:easeIn})
        .to('.logo',.5, {top:19, ease:easeIn})
        .to('.cta,.test2', 1, {opacity:1, ease:easeIn}, '-=.25')
         timeline.add('frame3').add('end');