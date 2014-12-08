var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
var char = null;
var lazers = [];

var main_state = {

    preload: function() {
       game.load.image('char', 'assets/robot.png');  
       game.load.image('lazer', 'assets/lazer.png');
       game.load.audio('lazer_shoot', 'assets/lazer_shoot.wav');
       game.load.audio('explode', 'assets/explosion.wav');
    },

    create: function() { 
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#736357';
        
        char = game.add.sprite(35, 300, 'char');  
        game.physics.arcade.enable(char);
        
        velocity = -200;
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
    },

    update: function() {
        this.fixCharacterPositionIfOutOfScreenBounds();
        this.updateLazers();
    },
    
    updateLazers: function(){
        var newArr = [];
      for (var i = 0; i < lazers.length; i++) {
            if(lazers[i].x > 800){
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
