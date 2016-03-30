var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
        timeline.add('frame2')
            .to('#copy1,#subtitle,#man,#legal,#logo', 0.5, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame3');
        timeline.add('frame3')
            .to('#copy1,#subtitle,#legal', 0.5, {opacity:0, ease:easeOut})
            .to('#copy2', 0.5, {opacity:1, ease:easeIn})
            .addDelay(1.5, 'frame4');
        timeline.add('frame4')
            .to('#copy2,#man', 0.5, {opacity:0, ease:easeOut})
            .to('#copy3,#washer,#button', 0.5, {opacity:1, ease:easeIn});
        timeline.add('frame5').add('end');