var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
var char = null;
var lazers = [];
var enemies = [];
var waveDiff;//number of enemies to spawn

var main_state = {

    preload: function() {
       game.load.image('char', 'assets/robot.png');  
       game.load.image('enemy', 'assets/gay_robot.png');  
       game.load.image('lazer', 'assets/lazer.png');
       game.load.audio('lazer_shoot', 'assets/lazer_shoot.wav');
       game.load.audio('explode', 'assets/explosion.wav');
    },

    create: function() { 
        
        waveDiff = 1;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#736357';
        
        char = game.add.sprite(35, 300, 'char');  
        game.physics.arcade.enable(char);
        
        velocity = -500;
        lazer_velocity = 300;
        lazer_shoot_sound = game.add.audio('lazer_shoot');
        
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.shoot_lazer, this);
        
        score = 0;
        
        scoreText = game.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#123' });
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.moveUp, this);
        
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(this.moveDown, this);
        this.spawnEnemies();
        
        waveTimer = game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnEnemies, this);
    },

    update: function() {
        this.fixCharacterPositionIfOutOfScreenBounds();
        this.updateLazers();
        this.updateEnemies();
        
        for(j = 0; j < lazers.length; j++){
            for(i = 0 ; i < enemies.length; i++){
                game.physics.arcade.collide(lazers[j], enemies[i], this.gameOver, null, this);
            }
        }

        for(i = 0 ; i < enemies.length; i++){
            game.physics.arcade.collide(char, enemies[i], this.gameOver, null, this);
        }
    },
    
    destroyEnemy: function(bullet , enemy){
      console.log("hoorah destroy enemy");
      this.update_score();
      
      bullet.destroy();
      //bullet = null;
      
      enemy.destroy();
      //enemy = null;
    
    },
    
    //gameOver: function(){
        
   // },    
    
    gameOver: function(x , y){
        console.log("gameover");
       // gameOver();
    },
    
    spawnEnemies: function(){
        for(i = 0; i < waveDiff; i++){//waves gotta stay waves .... you gotta lose sometime...
        //random / 1 = x / 600
        var random = Math.random();
        var y = random * 600;
        
        if(y > 600 - char.height){ // pass filter fix for out of bounds | char sprite == enemy sprite
            y -= char.height;
        }
        //random / 1 = x / 300
        
        var enemy = game.add.sprite(800 + char.width, y, 'enemy');  
        game.physics.arcade.enable(enemy); 
        
        enemy.body.velocity.x = -300;
        
        enemies.push(enemy);
        
        }
        waveDiff++;
    },
    
    updateEnemies: function(){
        var newArr = [];
      for (var i = 0; i < enemies.length; i++) {
            if(enemies[i] === null){
                
            }else if(enemies[i].x <= 0){    
                
                enemies[i].destroy();
                enemies[i] = null;
                this.gameOver();
                
            }else{
                newArr.push(enemies[i]);
            }
       }
       
       enemies = newArr;
       
    },
    
    updateLazers: function(){
        var newArr = [];
      for (var i = 0; i < lazers.length; i++) {
          
            if(lazers[i] === null){
          
            }else if(lazers[i].x > 800){
                lazers[i].destroy();
            }else{
                newArr.push(lazers[i]);
            }
       }
       
       lazers = newArr;
       
    },
    
    moveUp: function(){
        char.body.velocity.y = velocity;
    },
    
    moveDown: function(){
        char.body.velocity.y = -velocity;
    },
    
    fixCharacterPositionIfOutOfScreenBounds: function(){//TODO
        if(char.y < 0){
            char.y = 0;
            char.body.velocity.y = 0;
            return true;
        }else if(char.y + char.height > 600){
            char.y = 600 - char.height;
            char.body.velocity.y = 0;
            return true;
        }else{
            return false;
        }
        
    },
    
    shoot_lazer: function(){
      var a = Math.random();
      var offset_y = 0;
      
      if(a <= 0.5){
          offset_y = 18;
      }else{
          offset_y = 13;
      }
      
      var lazer = game.add.sprite(char.x + char.width + 3, char.y + offset_y, 'lazer'); 
      game.physics.arcade.enable(lazer);
      
      lazer.body.velocity.x = lazer_velocity;
      lazer_shoot_sound.play();  
      lazers.push(lazer);

    },
    
    update_score: function(){
        this.score += 10;
        this.scoreText.text = "Score: " + this.score;
    },

    
}

game.state.add('main', main_state);  
game.state.start('main');  
