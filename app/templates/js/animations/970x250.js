var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
            .to('.copy1,.logo', 2, {opacity:1, ease:easeIn}, 'start')
            .addDelay(1, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 1.5, {opacity: 0, ease: easeOut}, 'frame2')
            .to('.copy2', 1.5, {opacity:1, ease:easeIn}, 'frame2')
            .addDelay(1, 'frame3')
        timeline.add('frame3')
            .to('.cta', 1.5, {opacity:1, ease:easeIn}, 'frame3')
        timeline.add('frame4').add('end');


        timeline.add('masks')
            .to('.masks .top', 2, {width:0,left:"+=70"}, 'start')
            .to('.masks .left', 2, {height:0,top:"+=60"}, 'start')
            .to('.masks .bottom-right', 2, {width:0,left:"+=100"}, 'start')
            .to('.masks .bottom-bottom', 2, {height:0,top:"+=50"}, 'start')
        timeline.add('frame3Background')
            .to('.background1', 1.5, {opacity:0, ease:easeIn}, 'frame2')
            .to('.background2', 1.5, {opacity:1, ease:easeIn}, 'frame2')