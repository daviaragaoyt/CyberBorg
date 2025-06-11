window.addEventListener('keydown', (event) => {
    if (player.preventInput) return

    switch (event.key) {
        case 'w':
            // W apenas para entrar na porta
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]
                if (player.checkDoorCollision(door)) {
                    player.velocity.x = 0
                    player.velocity.y = 0
                    player.preventInput = true
                    player.switchSprite('enterDoor')
                    door.play()
                    switchLevel()
                    return
                }
            }
            break

        case ' ': // Espaço apenas para pular
            if (player.velocity.y === 0) {
                player.velocity.y = player.jumpForce
            }
            break

        case 'a':
            keys.a.pressed = true
            break

        case 'd':
            keys.d.pressed = true
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})