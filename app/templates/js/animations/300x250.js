var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var speed = 1.5;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1').add('start')
        timeline.add('frame2')
            .fromTo('#copy1', speed, {left:'+=100'}, {left:'-=100'}, 'frame2')
            .to('#copy1', speed, {opacity: 1, ease:easeIn}, 'frame2')
            .addDelay(2, 'frame3');
        timeline.add('frame3')
            .to('#copy1', speed, {opacity:0, ease:easeOut}, 'frame3')
            .fromTo('#copy2', speed, {left:'+=100'}, {left:'-=100'}, 'frame3')
            .to('#copy2', speed, {opacity:1, ease:easeIn}, 'frame3')
            .addDelay(2.5, 'frame4');
        timeline.add('frame4')
            .to('#background1,#copy2', speed, {opacity:0, ease:easeOut},'frame4')
            .to('#copy3,#background2', speed, {opacity:1, ease:easeIn},'frame4')
            .fromTo('#copy3', speed, {left:'+=100'}, {left:'-=100'}, 'frame4')
            .addDelay(3, 'frame5');
        timeline.add('frame5')
            .to('#copy3,#yellowbar', speed, {opacity:0, ease:easeOut})
            .to('#everydaycare', speed, {opacity:1, ease:easeIn})
            .addDelay(2.5, 'frame6');
        timeline.add('frame6')
            .to('#everydaycare,#background2', speed, {opacity:0, ease:easeOut}, 'frame6')
            .to('#copy4,#cta,#background3', speed, {opacity:1, ease:easeIn}, 'frame6')
            .addDelay(2.5, 'frame6');
        timeline.add('frame7').add('end');