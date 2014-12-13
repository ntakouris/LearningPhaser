//IKR this kind of var declaration may be against that JS code style but im a java guy
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
var char = null;
var lazers = [];
var enemies = [];
var waveDiff;//number of enemies to spawn
var score;
var scoreText;
var isOver;
var bigScore = null;//too lazy to add dynamic calc of position based on value
var waveTimer = null;



var main_state = {
    
    startGame: function(){
        this.isOver = false;
        this.score = 0;
        
        waveDiff = 1;
        
        this.char = game.add.sprite(35, 300, 'char');  
        game.physics.arcade.enable(this.char);
        
        this.scoreText = game.add.text(600, 16, 'Score: 0', { fontSize: '32px', fill: '#123' });
        
        if(this.waveTimer === null){
            this.waveTimer = game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnEnemies, this);
        }
    },

    preload: function() {
       game.load.image('char', 'assets/robot.png');  
       game.load.image('enemy', 'assets/gay_robot.png');  
       game.load.image('lazer', 'assets/lazer.png');
       game.load.audio('lazer_shoot', 'assets/lazer_shoot.wav');
       game.load.audio('explode', 'assets/explosion.wav');
    },

    create: function() { 
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#736357';
        
        velocity = -500;
        lazer_velocity = 300;
        lazer_shoot_sound = game.add.audio('lazer_shoot');
        
        boom_sound = game.add.audio('explode');
        
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.shoot_lazer, this);
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        upKey.onDown.add(this.moveUp, this);
        
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        downKey.onDown.add(this.moveDown, this);
        
        this.startGame();
    },

    update: function() {
        if(!this.isOver){
        this.fixCharacterPositionIfOutOfScreenBounds();
        this.updateLazers();
        this.updateEnemies();
        
        for(j = 0; j < lazers.length; j++){
            for(i = 0 ; i < enemies.length; i++){
                if(game.physics.arcade.collide(lazers[j], enemies[i], this.destroyEnemy, null, this)){
                
                }
            }
        }

        for(i = 0 ; i < enemies.length; i++){
            game.physics.arcade.collide(this.char, enemies[i], this.gameOver, null, this);
        }
        }else{
            //idk
        }
    },
    
    destroyEnemy: function(lazer , enemy){
      this.update_score();
      
      lazer.destroy();
      
      enemy.destroy();
      
      boom_sound.play();
    
    },
    
    gameOver: function(){
       
       this.isOver = true;
       this.char.destroy();
       this.char = null;
       for(j = 0; j < lazers.length; j++){
           if(lazers[i] !== null){
            lazers[j].destroy();
           }
       }
       lazers = [];
       for(i = 0 ; i < enemies.length; i++){
           if(enemies[i] !== null){
               enemies[i].destroy();
           }
       }
       enemies = [];
       this.scoreText.destroy();
       this.scoreText = null;
       
       this.bigScore = game.add.text(50, 300 - 32, 'Total Score: ' + this.score , { fontSize: '32px', fill: '#123' });
    },
    
    spawnEnemies: function(){
        if(!this.isOver){
        
        for(i = 0; i < waveDiff; i++){//waves gotta stay waves .... you gotta lose sometime...
        //random / 1 = x / 600
        var random = Math.random();
        var y = random * 600;
        
        if(y > 600 - this.char.height){ // pass filter fix for out of bounds | char sprite == enemy sprite
            y -= this.char.height;
        }
        //random / 1 = x / 300
        
        var enemy = game.add.sprite(800 + this.char.width, y, 'enemy');  
        game.physics.arcade.enable(enemy); 
        
        enemy.body.velocity.x = -300;
        
        enemies.push(enemy);
        
        }
        waveDiff++;
        }
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
        if(!this.isOver){
            this.char.body.velocity.y = velocity;
        }
    },
    
    moveDown: function(){
        if(!this.isOver){
            this.char.body.velocity.y = -velocity;
        }
    },
    
    fixCharacterPositionIfOutOfScreenBounds: function(){//TODO
        if(this.char.y < 0){
            this.char.y = 0;
            this.char.body.velocity.y = 0;
            return true;
        }else if(this.char.y + this.char.height > 600){
            this.char.y = 600 - this.char.height;
            this.char.body.velocity.y = 0;
            return true;
        }else{
            return false;
        }
        
    },
    
    shoot_lazer: function(){
        if(!this.isOver){
            var a = Math.random();
            var offset_y = 0;
      
         if(a <= 0.5){
             offset_y = 18;
        }else{
            offset_y = 13;
        }
      
         var lazer = game.add.sprite(this.char.x + this.char.width + 3, this.char.y + offset_y, 'lazer'); 
        game.physics.arcade.enable(lazer);
      
        lazer.body.velocity.x = lazer_velocity;
        lazer_shoot_sound.play();  
        lazers.push(lazer);
      
        }else{
            this.bigScore.destroy();
            this.startGame();
        }

    },
    
    update_score: function(){
        this.score += 10;
        this.scoreText.text = "Score: " + this.score;
    },
}
game.state.add('main', main_state);  
game.state.start('main');    
