doTheWork = function() {
    // Backgrounds as array of objects. canvas id, speed, image url
    var bgs = [{
        id: 'sky',
        speed: 1,
        src: 'layers/storyboard-bg-v1.jpg'
    }, {
        id: 'middle',
        speed: 3,
        src: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Vegetation_%28middle_layer%29.png'
    }, {
        id: 'front',
        speed: 5,
        src: 'layers/storyboard-foreground-v1.png'
    }];
    
    // Create render background through Scenery
    var Scenery = {
        bgs: [],
        // Initialize individual canvases and set images
        init: function(bgs) {
        var i = bgs.length - 1,j = 0;
        for (; i >= 0; i--,j++) {
            this.bgs[j] = {};
            this.bgs[j].cvs = document.getElementById(bgs[i].id);
            this.bgs[j].ctx = this.bgs[j].cvs.getContext('2d');
            this.bgs[j].img = document.createElement('img');
            this.bgs[j].img.src = bgs[i].src;
            this.bgs[j].left = 0;
            this.bgs[j].speed=bgs[i].speed;
        }
        },
        // According to scroll speed, render images in corresponding canvas
        // To have a seamless effect, render image twice
        scene: function() {
            var i = this.bgs.length - 1,
                left, w, h, bgNow, bgCtx;
            for (; i >= 0; i--) {
                bgNow = this.bgs[i];
                left = bgNow.left;
                w = bgNow.cvs.width;
                h = bgNow.cvs.height;
                bgCtx = bgNow.ctx;
        
                bgCtx.clearRect(0, 0, w, h);
                bgCtx.drawImage(this.bgs[i].img, -left, 0, w, h);
                bgCtx.drawImage(this.bgs[i].img, w - left, 0, w, h);
                this.bgs[i].left = (left + this.bgs[i].speed) % w;
            }
        }
    };
    
    // This handles looping . A wrapper around `window.requestAnimationFrame`
    var Loop = {
        run: function(scene, fps) {
            this.scene = scene;
            this.frameInterval = 1000 / fps;
            this.lastTime = new Date().getTime();
        
            this.loop();
            },
        loop: function() {
            var now = new Date().getTime();
            var elapsed = now - this.lastTime;
            if (elapsed >= this.frameInterval) {
                this.scene();
                this.lastTime = now;
            }
            window.requestAnimationFrame(this.loop.bind(this));
        }
    };
    
    // Initialize scenery and run
    Scenery.init(bgs);
    Loop.run(Scenery.scene.bind(Scenery), 60);
}