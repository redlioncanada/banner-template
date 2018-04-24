var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy1', 1, {opacity: 1})        
            .addDelay(2.7, 'frame2')
        timeline.add('frame2')
            .to('.wipe', 0.5, { width: 300 })
            .to('.wipe-line', 0.5, { left: 300 }, '-=0.5')
            .to('.wipe-line', 0.3, { left: 310 })
            .to('.background1', 0, { opacity: 0 })
            .addDelay(2, 'frame3')
        timeline.add('frame3')
            .to('.cta', 1, {opacity: 1},'-=0.5')
        timeline.add('frame4')
