var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game_div');

var main_state = {

    preload: function() {
       game.load.image('char', 'assets/hello.png');  
       game.load.audio('lazer_shoot', ['assets/lazer_shoot.wav']);
    },

    create: function() { 
        
        game.stage.backgroundColor = '#736357';
        
        char = game.add.sprite(250, 300, 'char');  
        velocity = -5;
        lazer_shoot_sound = game.add.audio('lazer_shoot');
        
        spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.shoot_lazer, this);
        
        score = 0;
        
        scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#123' });
        
        upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        
        downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    },

    update: function() {
        
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
