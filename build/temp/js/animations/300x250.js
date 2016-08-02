var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
       timeline.add('frame1').add('start')
          .to('.bg1,.stars', 1, {opacity: 1, ease: easeIn})
          .to('.test', 1, {opacity:1, ease:easeIn})
          .to('.legal', 1, {opacity:1, ease:easeIn})
          timeline.add('frame2')
          .to('.backgroundfade', 1, {opacity:0, ease:easeOut});
//             .addDelay(0.7, 'frame3')
//         timeline.add('frame3')
//             .to('.copy2,.cta', 1, {opacity:1, ease:easeIn})
//         timeline.add('frame4').add('end');