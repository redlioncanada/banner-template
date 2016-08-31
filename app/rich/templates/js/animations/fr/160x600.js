var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var test = test;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
            .to('.copy1,.copy2,.copy3', 0, {opacity: 1})
            .to('.masks .m1', 0.8, {width:83}, 'start')
            .to('.masks .m2', 0.8, {width:78})
            .to('.copy2', 0.8, {left:0})
            .addDelay(2, 'frame2')
        timeline.add('frame2')
            .to('.copy2', 0.8, {left:-{width}}, 'frame2')
            .to('.copy1', 0.8, {top:'-=48'}, 'frame2')
            .to('.copy3', 0.8, {left:0})
            .addDelay(2, 'frame3')
        timeline.add('frame3')
            .to('.cta', 0.8, {opacity:1})
        timeline.add('frame4')