const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

c.fillRect(0, 0, canvas.width, canvas.height);


const gravity = 0.5;
const speed = 7;
const background = new Sprite({
    position: {
        x: 0,
        y: -200
    },
    imageSrc: 'assats/qrSSM.gif',
    scale: 2.8,
    framesMax: 1
},
)


const shop = new Sprite({
    position: {
        x: 160,
        y: 200,
    },
    imageSrc: 'assats/shop.png',
    scale: 4,
    framesMax: 6
},)




const player = new Fighter({ 
    position: {
        x: 0, 
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 200,
        y: 210,
    },
    color: 'red',
    imageSrc: 'assats/EVil Wizard 2/Sprites/Idle.png',
    framesMax: 8,
    scale: 3,
});

const keys = {
    w: {
        isDown: false
    },
    a: {
        isDown: false
    },
    d: {
        isDown: false
    },

    ArrowUp: {
        isDown: false
    },
    ArrowLeft: {
        isDown: false
    },
    ArrowRight: {
        isDown: false
    },
    Enter:{
        isDown: false
    },
    s:{
        isDown: false
    }
}


const enemy = new Fighter({
    position: {
        x: 800, 
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: -200,
        y: 100,
    },
    color: 'blue',
    imageSrc: 'assats/kenji/Idle.png',
    framesMax: 4,
    scale: 3
});

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movement
    if (keys.a.isDown && player.lastKey === 'a') {
        player.velocity.x = -speed;
    } else if (keys.d.isDown && player.lastKey === 'd') {
        player.velocity.x = speed;
    }

    // Enemy movement
    if (keys.ArrowLeft.isDown && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -speed;
    } else if (keys.ArrowRight.isDown && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = speed;
    }

    // Collision detection
    if (
        rectangularCollision({
            rect1: player,
            rect2: enemy
        }) && player.isAttacking 
    ) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + '%';
    }


    // wall collosion
    if (player.position.x < 0) {
        player.position.x = 0;
    } else if (player.position.x + player.width > canvas.width) {
        player.position.x = canvas.width - player.width;
    }

    if (enemy.position.x < 0) {
        enemy.position.x = 0;
    } else if (enemy.position.x + enemy.width > canvas.width) {
        enemy.position.x = canvas.width - enemy.width;
    }




    if (
        rectangularCollision({
            rect1: enemy,
            rect2: player
        }) && enemy.isAttacking 
    ) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + '%' ;

    }

    if (enemy.health <= 0 || player.health <= 0){
        pickAWinner({player, enemy, timerId})
    }
    

    
}



animate();

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            player.velocity.y = -speed;
            break;
        case 'a':
            keys.a.isDown = true;
            player.lastKey = 'a'
            break;
        case 'd':
            keys.d.isDown = true;
            player.lastKey = 'd'
            break;
        case ' ':
            player.attack()
            break;

        case 'ArrowUp':
            enemy.velocity.y = -speed;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.isDown = true;
            enemy.lastKey = 'ArrowLeft'
            break;
        case 'ArrowRight':
            keys.ArrowRight.isDown = true;
            enemy.lastKey = 'ArrowRight'
            break;
        case 'ArrowDown':
            enemy.attack();

            case 'Enter':
             keys.Enter.isDown = true
            const myTimeoutE = setTimeout(healingEnemy, 500);
            function healingEnemy(){
            if(enemy.health < 100 && keys.Enter.isDown == true){
             enemy.health += 0.3;
            document.querySelector("#enemyHealth").style.width = enemy.health + '%';  }}
            break;

            case 's':
                keys.s.isDown = true
               const myTimeoutP = setTimeout(healingplayer, 500);
               function healingplayer(){
               if(player.health < 100 && keys.s.isDown == true){
                player.health += 0.3;
               document.querySelector("#playerHealth").style.width = player.health + '%';  }
               }
                
               break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.isDown = false;
            break;
        case 'd':
            keys.d.isDown = false;
            break;

        case 'ArrowLeft':
            keys.ArrowLeft.isDown = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.isDown = false;
            break;
        case 'Enter':
        keys.Enter.isDown = false;
        break;

        case 's':
            keys.s.isDown = false;
            break;
            
        
    }
});