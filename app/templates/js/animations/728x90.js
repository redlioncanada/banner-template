var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .addDelay(1, 'frame2');
        timeline.add('frame2')
            .to('#copy1,#logo', 0.7, {opacity:1, ease:easeIn})
            .addDelay(2, 'subtitle-frame2')
            .to('#subtitle,#legal', 0.7, {opacity:1, ease:easeIn}).add('subtitle-frame2')
            .addDelay(3.5, 'frame3');
        timeline.add('frame3')
            .to('#copy1,#subtitle,#legal', 0.7, {opacity:0, ease:easeOut})
            .to('#copy2', 0.7, {opacity:1, ease:easeIn})
            .addDelay(3, 'frame4');
        timeline.add('frame4')
            .to('#copy2,#man', 0.7, {opacity:0, ease:easeOut})
            .to('#copy3,#washer,#button', 0.7, {opacity:1, ease:easeIn});
        timeline.add('frame5').add('end');