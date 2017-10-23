var timeline = new TimelineLite();
        timeline.add('frame1')
            .addDelay(1, 'frame2')
        timeline.add('frame2')
            .to('.spring', 0.3, { height: '-=10', top: '+=5' })
            .to('.spring', 0.3, { height: '+=10', top: '-=5' })
            .to('.spring', 0.3, { height: '-=30', top: '+=15' })
            .to('.spring', 0.3, { height: '+=30', top: '-=15' })
            .addDelay(1, 'frame3')
        timeline.add('frame3')
            .to('.wipe', 0.5, { width: 300 })
            .to('.wipe-line', 0.5, { left: 300 }, '-=0.5')
            .to('.wipe-line', 0.3, { left: 310 })
            .to('.background1, .spring', 0, { opacity: 0 })
            .addDelay(3, 'frame4')
        timeline.add('frame4')
            .to('.wipe', 1, { opacity: 0 }).add('frame3-logo')
            .to('.sprite1', 0.3, { top: 0 }).add('sprites')
            .to('.sprite2', 0.3, { top: 0 }, 'sprites+=0.15')
            .to('.sprite3', 0.3, { top: 0 }, 'sprites')
            .to('.sprite4', 0.3, { top: 0 }, 'sprites+=0.3')
            .addDelay(0.5, 'frame3-background')
            .to('.background3', 1, { opacity: 1 }).add('frame3-background')
            .addDelay(0.5, 'cta')
            .to('.cta', 1, { opacity: 1 }).add('cta')
        timeline.add('frame5')