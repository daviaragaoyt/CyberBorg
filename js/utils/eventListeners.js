// js/utils/eventListeners.js
window.addEventListener('keydown', (event) => {
    if (player.preventInput) return

    switch (event.key) {
        case 'w':
            if (player.velocity.y === 0) {
                player.velocity.y = player.jumpForce
                audioManager.playSound('jump')
            }
            break

        case 'e':
            // Verifica interação com portas
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]
                if (door.checkPlayerCollision(player)) {
                    player.velocity.x = 0
                    player.velocity.y = 0
                    player.preventInput = true
                    player.switchSprite('enterDoor')
                    switchLevel()
                    return
                }
            }

            // Verifica interação com hologramas
            for (let i = 0; i < holograms.length; i++) {
                const hologram = holograms[i]
                if (hologram.isActive) {
                    // Verifica se é o primeiro holograma do level 1 ou 2
                    if ((level === 1 || level === 2) && i === 0 && !hologram.audioPlayed) {
                        hologram.audioPlayed = true
                        audioManager.playHologramAudio(level)
                    }
                    hologram.showModal()
                    return
                }
            }

            if (level === 3 && computer && computer.isActive && !computer.isSolved) {
                computer.showDecodeModal()
                return
            }
            break

        case 'Escape': // Adiciona caso para tecla ESC
            const modal = document.getElementById('holo-modal')
            if (modal.style.display === 'block') {
                modal.style.display = 'none'
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

// Fechar modal ao clicar fora
window.addEventListener('click', (event) => {
    const modal = document.getElementById('holo-modal')
    if (event.target === modal) {
        modal.style.display = 'none'
    }
})

// Prevenir comportamento padrão da tecla espaço
window.addEventListener('keydown', function (e) {
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
    }
})