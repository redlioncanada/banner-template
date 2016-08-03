var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.masks .top', 0.5, {height:232, ease:easeOut})
            .to('.masks .left', 0.5, {width:181, ease:easeOut})
            .to('.masks .bottom-right', 0.5, {width:120, ease:easeOut})
            .addDelay(0.5, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 2, {opacity:1, ease:easeOut})
        timeline.add('frame3')
            .to('.logo', 2, {opacity:1, ease:easeOut})
        timeline.add('frame4')
            .to('.cta', 2, {opacity:1, ease:easeOut})
        timeline.add('end')