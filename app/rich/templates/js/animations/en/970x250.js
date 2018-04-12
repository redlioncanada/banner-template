var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy1', 1, {opacity: 1})        
            .addDelay(2.7, 'frame2')
        timeline.add('frame2')
            .to('.background2', 1, {opacity:1})
            .to('.copy1', 0.5, {opacity: 0},'-=1')
            .to('.copy2', 0.5, {opacity: 1},'-=1')
            .addDelay(2, 'frame3')
        timeline.add('frame3')
            .to('.background3', 0.5, {opacity:1})
            .to('.cta', 1, {opacity: 1},'-=0.5')
        timeline.add('frame4')
