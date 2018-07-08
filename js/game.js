//there are more methods in the scene life-cycle (*render,shutdown,destroy*);

// create a new scene named "Game"
let gameScene = new Phaser.Scene('Game');
//life cycle
// Some parameters for our scene ( Our own customer variables - these are NOT part of the Phaser API)
gameScene.init = function () { //  init
    //Place to defined custom var
    this.playerSpeed = 7;
    this.enemySpeed = 1;
    this.enemy2Speed = 1;
    this.enemyMaxY = 660;
    this.enemyMinY = 240;
    this.enemy2MaxX = 1520;
    this.enemy2MinX = 20;
};




gameScene.preload = function() {                                   //preload
   //Load images
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('lobo', 'assets/lobo.png');
    this.load.image('oso', 'assets/oso.png');
    this.load.image('treasure', 'assets/wingame.png');
    this.load.image('backgroundEndCustom', 'assets/backgroundEndCustom.png');
};

//Executed once, after assets were loaded
gameScene.create = function() { //create

 //player is alive
 this.isPlayerAlive = true;

 //Background
 let bg = this.add.sprite(0,0, 'background'); // Origin default center
 //Change origin to the top-left of the sprite
  bg.setOrigin(0,0);


  //Player
  this.player = this.add.sprite(520, this.sys.game.config.height / 2, 'player');
  // Scale down
  this.player.setScale(0.1);
  //treasure goal
    this.treasure = this.add.sprite(this.sys.game.config.width - 215, this.sys.game.config.height / 2 , 'treasure');
    this.treasure.setScale(0.6);
    //Groups of Enemies
    this.enemies = this.add.group({
        key: 'lobo',
        repeat: 2,
        setXY: {
            x: 810,
            y: 650,
            stepX: 280,
            stepY: 20
        }
    });
    this.enemies2 = this.add.group({
        key: 'oso',
        repeat: 0,
        setXY: {
            x: 115,
            y: 550,
            stepX: 80,
            stepY: 1,
            stepY: 1
        }
    });

    //Scale enemies
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.9, -0.9);
    Phaser.Actions.ScaleXY(this.enemies2.getChildren(), -0.8, -0.8);
    //Set Speeds
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
        enemy.speed = Math.random() * 6 + 6;
    }, this);
    //Set Speeds
    Phaser.Actions.Call(this.enemies2.getChildren(), function(enemy) {
        enemy.speed = 4
    }, this);


    //reset camera effects - bottom of the create
    this.cameras.main.resetFX();
};
//Executed on every frame (60 time per second)
gameScene.update = function() {
    //Only if the player is alive
    if(!this.isPlayerAlive) {
        return; // to work, this function most be at the start to Gameover function takes effects
    }

  if(this.input.activePointer.isDown) {
      //Player walks
     this.player.x += this.playerSpeed;
  }
   /* if(this.input.activePointer.isDown) {   we can add multiply of conditions to the same input will change the movement.
        //Player walks
        this.player.x += this.playerSpeed;
    }*/

  if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
      //Background Custom
      let bgEnd = this.add.sprite(0, 0, 'backgroundEndCustom'); // Origin default center
      //Change origin to the top-left of the sprite
      bgEnd.setOrigin(0, 0);
      this.winGame();
  }
  // Enemies Movement
  let enemies = this.enemies.getChildren();
  let numEnemies = enemies.length;

  for(let i = 0; i < numEnemies; i++){

      //Move enemies
      enemies[i].y += enemies[i].speed;

    // Reverse movement if reached the edges
      if(enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
          enemies[i].speed *= -1;
      }
      else if(enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
          enemies[i].speed *= -1;
      }
      //Enemy movement and collision
      if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())){
          this.gameOver();
          break; // ??
      }
  }

 /////////////////////////////////////////////////////////////////////

    // Enemies Movement
    let enemies2 = this.enemies2.getChildren();
    let numEnemies2 = enemies2.length;

    for(let i = 0; i < numEnemies2; i++) {

        //Move enemies
        enemies2[i].x += enemies2[i].speed;

        // Reverse movement if reached the edges
       if(enemies2[i].x >= this.enemy2MaxX && enemies2[i].speed > 0) {
            enemies2[i].speed *= -1;
        }
       else if(enemies2[i].x <= this.enemy2MinX && enemies2[i].speed < 0) {
            enemies2[i].speed *= -1;
        }
        //Enemy movement and collision
        if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies2[i].getBounds())){
            this.gameOver();
            break; // ??
        }
    }






};
// Custom Methods can be outside of the update

//End the game
gameScene.gameOver = function () {
  //Flag to set player is dead
    this.isPlayerAlive = false;

    // shake the camera
    this.cameras.main.shake(500);

    //Fade Camera
    this.time.delayedCall(250, function() { // start of the effect
    /* ?? */ this.cameras.main.fade(250); // time duration of this effect
    }, [], this);



    // restart game
    this.time.delayedCall(500, function() {
     this.scene.restart();
    }, [], this );

};

gameScene.winGame = function () {
    this.time.delayedCall(5200, function() {
        this.scene.restart();
    }, [], this );

};

let height = window.screen.height;
let width = window.screen.width;
//our game's configuration
let config = {
    type: Phaser.AUTO, //Phaser will decide how to render our game (WebGL or Canvas)
    width: width, // game width
    height: height, // game height
    scene: gameScene // our newly created scene
};

//create the game, and pass it the configuration
let game = new Phaser.Game(config);