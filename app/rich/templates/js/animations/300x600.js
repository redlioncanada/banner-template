var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.masks .top', 1, {height:233, ease:easeOut})
            .to('.masks .left', 1, {width:181, ease:easeOut})
            .to('.masks .bottom-right', 1, {width:120, ease:easeOut})
        timeline.add('frame2')
            .to('.copy1', 1, {opacity:1, ease:easeOut}, 'frame2-=0.6')
            .addDelay(2, 'frame3')
        timeline.add('frame3')
            .to('.logo', 1, {opacity:1, ease:easeOut})
            .addDelay(3, 'frame4')
        timeline.add('frame4')
            .to('.copy1', 1, {opacity:0, ease:easeOut})
            .to('.copy2', 1, {opacity:1, ease:easeOut})
            .addDelay(0.5, 'frame3-cta')
            .to('.cta', 1, {opacity:1, ease:easeOut})
        timeline.add('frame5').add('end')