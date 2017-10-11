var easeIn = Power1.easeIn;
var easeOut = Power1.easeOut;
var timeline = new TimelineLite({onComplete: onComplete});
        timeline.add('frame1')
             .to('.copy1', 1, {opacity: 1})
            .addDelay(2, 'frame2')
        timeline.add('frame2')
            .to('.copy1', 1, {opacity: 0})
            .to('.background1', 1, {opacity: 0})
            .to('.masks .mask1, .masks .mask2, .masks .mask3 ', 0.1, {opacity: 1})
            .to('.logo', 1, {opacity: 1})
            .to('.copy2', 1, {opacity: 1})
            .addDelay(1, 'frame3')
        timeline.add('frame3')
            .to('.masks .mask1', 2, {left: 250}, '-=1')
            .to('.masks .mask2', 2, {left: 270}, '-=1')
            .to('.masks .mask3', 2, {left: 270}, '-=1')
            .addDelay(2, 'frame4')
        timeline.add('frame4')            