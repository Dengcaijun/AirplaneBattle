;
(function() {
    var gamebox = document.querySelector('.gamebox');
    var oEm = document.querySelector('em');
    var zscore = 0;
    //1.让背景运动起来
    var bgposition = 0;
    var bgtimer = setInterval(function() {
        bgposition += 2;
        gamebox.style.backgroundPosition = '0 ' + bgposition + 'px';
    }, 30);


    //2.我方飞机的构造函数
    function Myplane(w, h, x, y, imgurl, boomurl) { //w,h宽高 x,y位置  imgurl和boomurl我方飞机的图片路径
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.imgurl = imgurl;
        this.boomurl = boomurl;
        this.createmyplane()
    }
    //2.1创建我方飞机
    Myplane.prototype.createmyplane = function() {
        this.myplaneimg = document.createElement('img');
        this.myplaneimg.src = this.imgurl;
        this.myplaneimg.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
        gamebox.appendChild(this.myplaneimg);
        //飞机创建完成，执行运动和发射子弹
        this.myplanemove();
        this.myplaneshoot();
    }
    //2.2键盘控制我方飞机移动
    Myplane.prototype.myplanemove = function() {
        var that = this;
        //方向定时器
        var uptimer = null,
            downtimer = null,
            lefttimer = null,
            righttimer = null;
        var uplock = true,
            downlock = true,
            leftlock = true,
            rightlock = true;
        document.addEventListener('keydown', movekey, false); //movekey:事件处理函数
        function movekey(ev) { //W:87 A:65 S:83 D:68  K:75
            var ev = ev || window.event;
            switch (ev.keyCode) {
                case 87:
                    moveup(); // 上
                    break;
                case 83:
                    movedown(); // 下
                    break;
                case 65:
                    moveleft(); // 左
                    break;
                case 68:
                    moveright(); // 右
                    break;
            }

            function moveup() {
                if (uplock) {
                    uplock = false;
                    clearInterval(downtimer);
                    uptimer = setInterval(function() {
                        that.y -= 4;
                        if (that.y <= 0) {
                            that.y = 0;
                        }
                        that.myplaneimg.style.top = that.y + 'px';
                    }, 30);
                }

            }

            function movedown() {
                if (downlock) {
                    downlock = false;
                    clearInterval(uptimer);
                    downtimer = setInterval(function() {
                        that.y += 4;
                        if (that.y >= gamebox.offsetHeight - that.h) {
                            that.y = gamebox.offsetHeight - that.h;
                        }
                        that.myplaneimg.style.top = that.y + 'px';
                    }, 30);
                }

            }

            function moveleft() {
                if (leftlock) {
                    leftlock = false;
                    clearInterval(righttimer);
                    lefttimer = setInterval(function() {
                        that.x -= 4;
                        if (that.x <= 0) {
                            that.x = 0;
                        }
                        that.myplaneimg.style.left = that.x + 'px';
                    }, 30);
                }

            }

            function moveright() {
                if (rightlock) {
                    rightlock = false;
                    clearInterval(lefttimer);
                    righttimer = setInterval(function() {
                        that.x += 4;
                        if (that.x >= gamebox.offsetWidth - that.w) {
                            that.x = gamebox.offsetWidth - that.w;
                        }
                        that.myplaneimg.style.left = that.x + 'px';
                    }, 30);
                }

            }

        }

        document.addEventListener('keyup', function(ev) {
            var ev = ev || window.event;
            if (ev.keyCode == 87) {
                clearInterval(uptimer);
                uplock=true;
            }

            if (ev.keyCode == 83) {
                clearInterval(downtimer);
                downlock=true;
            }

            if (ev.keyCode == 65) {
                clearInterval(lefttimer);
                leftlock=true;
            }

            if (ev.keyCode == 68) {
                clearInterval(righttimer);
                rightlock=true;
            }
        }, false);
    }

    //2.3我方飞机发射子弹
    Myplane.prototype.myplaneshoot = function() {
        var that = this;
        var shoottimer = null;
        var shootlock = true;
        document.addEventListener('keydown', shootbullet, false);

        function shootbullet(ev) {
            var ev = ev || window.event;
            if (ev.keyCode == 75) {
                if (shootlock) {
                    shootlock = false;

                    function shoot() {
                        new Bullet(6, 14, that.x + that.w / 2 - 3, that.y - 14, 'img/bullet.png');
                    }
                    shoot();
                    shoottimer = setInterval(shoot, 200);
                }
            }
        }
        document.addEventListener('keyup', function(ev) {
            var ev = ev || window.event;
            if (ev.keyCode == 75) {
                clearInterval(shoottimer);
                shootlock = true;
            }
        }, false);
    }


    //3.子弹的构造函数
    function Bullet(w, h, x, y, imgurl) { //w,h宽高 x,y位置  imgurl图片路径
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.imgurl = imgurl;
        //创建子弹
        this.createbullet();
    }

    //3.1创建子弹
    Bullet.prototype.createbullet = function() {
        this.bulletimg = document.createElement('img');
        this.bulletimg.src = this.imgurl;
        this.bulletimg.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
        gamebox.appendChild(this.bulletimg);
        //子弹创建完成，执行运动。
        this.bulletmove();
    }
    //3.2子弹运动
    Bullet.prototype.bulletmove = function() {
        var that = this;
        this.timer = setInterval(function() {
            that.y -= 4;
            if (that.y <= -that.h) { //让子弹消失
                clearInterval(that.timer);
                gamebox.removeChild(that.bulletimg);
            }
            that.bulletimg.style.top = that.y + 'px';
            that.bullethit();
        }, 30)

    }
    Bullet.prototype.bullethit = function() {
        var enemys = document.querySelectorAll('.enemy');
        for (var i = 0; i < enemys.length; i++) {
            if (this.x + this.w >= enemys[i].offsetLeft && this.x <= enemys[i].offsetLeft + enemys[i].offsetWidth && this.y + this.h >= enemys[i].offsetTop && this.y <= enemys[i].offsetTop + enemys[i].offsetHeight) {
                clearInterval(this.timer);
                try {
                    gamebox.removeChild(this.bulletimg);
                } catch (e) {
                    return;
                }

                //血量减1
                enemys[i].blood--;
                //监听敌机的血量(给敌机添加方法)
                enemys[i].checkblood();
            }
        }

    }
    //4.敌机的构造函数
    function Enemy(w, h, x, y, imgurl, boomurl, blood, score, speed) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.imgurl = imgurl;
        this.boomurl = boomurl;
        this.blood = blood;
        this.score = score;
        this.speed = speed;
        this.createenemy();
    }

    //4.1创建敌机图片
    Enemy.prototype.createenemy = function() {
        var that = this;
        this.enemyimg = document.createElement('img');
        this.enemyimg.src = this.imgurl;
        this.enemyimg.style.cssText = `width:${this.w}px;height:${this.h}px;position:absolute;left:${this.x}px;top:${this.y}px;`;
        gamebox.appendChild(this.enemyimg);

        this.enemyimg.className = 'enemy'; //给每一架创建的敌机添加类
        this.enemyimg.score = this.score; //给每一架创建的敌机添加分数
        this.enemyimg.blood = this.blood; //给每一架创建的敌机添加自定义的属性--血量
        this.enemyimg.checkblood = function() {
            //this==>this.enemyimg
            if (this.blood <= 0) { //敌机消失爆炸。
                this.className = ''; //去掉类名。
                this.src = that.boomurl;
                clearInterval(that.enemyimg.timer);
                setTimeout(function() {
                    gamebox.removeChild(that.enemyimg);
                }, 300);
                zscore += this.score;
                oEm.innerHTML = zscore;
            }
        }
        //子弹创建完成，执行运动。
        this.enemymove();
    }
    //4.2敌机运动
    Enemy.prototype.enemymove = function() {
        var that = this;
        this.enemyimg.timer = setInterval(function() {
            that.y += that.speed;
            if (that.y >= gamebox.offsetHeight) {
                clearInterval(that.enemyimg.timer);
                gamebox.removeChild(that.enemyimg);
            }
            that.enemyimg.style.top = that.y + 'px';
            that.enemyhit();
        }, 30);
    }

    //4.3敌机碰撞我方飞机
    Enemy.prototype.enemyhit = function() {
        if (!(this.x + this.w < ourplane.x || this.x > ourplane.x + ourplane.w || this.y + this.h < ourplane.y || this.y > ourplane.y + ourplane.h)) {
        	var enemys=document.querySelectorAll('.enemy');
        	for (var i = 0; i < enemys.length; i++) {
        		clearInterval(enemys[i].timer);
        	}
            clearInterval(enemytimer);
            clearInterval(bgtimer);
            ourplane.myplaneimg.src = ourplane.boomurl;
            setTimeout(function() {
                gamebox.removeChild(ourplane.myplaneimg);
                alert('game over!!');
                location.reload();
            }, 300)
        }
    }

    var enemytimer = setInterval(function() {
        for (var i = 0; i < ranNum(1, 3); i++) {
            var num = ranNum(1, 20); //1-20
            if (num < 15) { //小飞机
                new Enemy(34, 24, ranNum(0, gamebox.offsetWidth - 34), -24, 'img/smallplane.png', 'img/smallplaneboom.gif', 1, 1, ranNum(2, 4));
            } else if (num >= 15 && num < 20) {
                new Enemy(46, 60, ranNum(0, gamebox.offsetWidth - 46), -60, 'img/midplane.png', 'img/midplaneboom.gif', 3, 5, ranNum(1, 3));
            } else if (num == 20) {
                new Enemy(110, 164, ranNum(0, gamebox.offsetWidth - 110), -164, 'img/bigplane.png', 'img/bigplaneboom.gif', 10, 10, 1);
            }
        }
    }, 3000);

    function ranNum(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
    //实例化我方飞机
    var ourplane = new Myplane(66, 80, (gamebox.offsetWidth - 66) / 2, gamebox.offsetHeight - 80, 'img/myplane.gif', 'img/myplaneBoom.gif');
})();