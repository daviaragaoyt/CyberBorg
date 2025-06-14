// js/classes/Hologram.js
class Hologram {
    constructor({ position, title, text, imageSrc, audioTrack = null }) {
        this.position = position
        this.title = title
        this.text = text
        this.imageSrc = imageSrc
        this.audioTrack = audioTrack
        this.audioPlayed = false

        // Configurações da sprite
        this.loaded = false
        this.sprite = new Image()
        this.sprite.src = './assets/objects/holograma-audio.png'
        this.sprite.onload = () => {
            this.loaded = true
        }

        this.frameWidth = 100
        this.frameHeight = 128
        this.currentFrame = 1
        this.frameCount = 1
        this.frameTimer = 1
        this.frameInterval = 100
        this.scale = 1
        this.width = this.frameWidth * this.scale
        this.height = this.frameHeight * this.scale

        // Estado do holograma
        this.isActive = false
    }

    draw() {
        // Só desenha se a sprite estiver carregada
        if (!this.loaded) {
            // Desenha um placeholder enquanto a sprite carrega
            c.fillStyle = 'rgba(0, 247, 255, 0.3)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
            return
        }

        // Atualiza o frame da animação
        const now = Date.now()
        if (now - this.frameTimer > this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount
            this.frameTimer = now
        }

        try {
            // Desenha a sprite
            c.drawImage(
                this.sprite,
                this.currentFrame * this.frameWidth,
                0,
                this.frameWidth,
                this.frameHeight,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )

            // Se o jogador estiver próximo, mostra a dica "Pressione E"
            if (this.isActive) {
                c.fillStyle = '#00f7ff'
                c.font = '24px Courier New'
                c.textAlign = 'center'
                c.fillText(
                    'Pressione E',
                    this.position.x + this.width / 2,
                    this.position.y - 10
                )

                // Efeito de brilho
                c.beginPath()
                c.arc(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / 2,
                    30,
                    0,
                    Math.PI * 2
                )
                c.fillStyle = 'rgba(0, 247, 255, 0.2)'
                c.fill()
            }
        } catch (error) {
            console.error('Erro ao desenhar holograma:', error)
            // Desenha um placeholder em caso de erro
            c.fillStyle = 'rgba(0, 247, 255, 0.3)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }
    }

    checkPlayerCollision(player) {
        return (
            player.hitbox.position.x + player.hitbox.width >= this.position.x &&
            player.hitbox.position.x <= this.position.x + this.width &&
            player.hitbox.position.y + player.hitbox.height >= this.position.y &&
            player.hitbox.position.y <= this.position.y + this.height
        )
    }

    showModal() {
        const modal = document.getElementById('holo-modal')
        const modalTitle = document.getElementById('modal-title')
        const modalText = document.getElementById('modal-text')

        modalTitle.textContent = this.title
        modalText.innerHTML = `
            <div class="hologram-content">
                <img src="${this.imageSrc}" alt="Holograma" class="hologram-image">
                <p>${this.text}</p>
            </div>
        `
        modal.style.display = 'block'

        // Adicione esta verificação para os hologramas específicos
        if ((level === 1 && this === holograms[0]) || (level === 2 && this === holograms[0])) {
            if (!this.audioPlayed) { // Verifica se o áudio já foi tocado
                this.audioPlayed = true
                audioManager.stopMusic() // Para a música
                audioManager.playSound(level === 1 ? 'hologramAudio1' : 'hologramAudio2', () => {
                    audioManager.playLevelMusic(level) // Retoma a música após o áudio
                })
            }
        }
    }
}