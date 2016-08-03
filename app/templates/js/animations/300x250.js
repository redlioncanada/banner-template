var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
       timeline.add('frame1').add('start')
        .to('.bg1,.stars', 1.5, {opacity: 1, ease: easeIn})
          .to('.test', 1.5, {opacity:1, ease:easeIn})
          .to('.legal', 1.5, {opacity:1, ease:easeIn})
          .addDelay(2, 'frame2')
          timeline.add('frame2')
          .to('#backgroundfade,.stars,.test,.legal', 2, {opacity:0, ease:easeOut})
          .to('#bg2', 1, {opacity:1, ease:easeIn})
          .to('.test2', 1, {opacity:1, ease:easeIn}) 
          .to('.cta', 1, {opacity:1, ease:easeIn})
         timeline.add('frame3').add('end');