var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');
var char = null;

var main_state = {

    preload: function() {
       game.load.image('char', 'assets/hello.png');  
       game.load.audio('lazer_shoot', ['assets/lazer_shoot.wav']);
    },

    create: function() { 
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#736357';
        
        char = game.add.sprite(35, 300, 'char');  
        
        game.physics.arcade.enable(char);
        
        velocity = -100;
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
        
    },
    
    moveUp: function(){
        char.body.velocity.y = velocity;
    },
    
    moveDown: function(){
        char.body.velocity.y = -velocity;
    },
    
    fixCharacterPositionIfOutOfScreenBounds: function(){
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
      lazer_shoot_sound.play();  
    },
    
    update_score: function(){
        this.score += 10;
        this.scoreText.text = "Score: " + this.score;
    }
}

game.state.add('main', main_state);  
game.state.start('main');  
