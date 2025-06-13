// js/classes/Computer.js
class Computer extends Sprite {
    constructor({ position }) {
        super({
            position,
            imageSrc: '../../assets/objects/comput-1.png',
            scale: 2
        })

        // Configurações da sprite
        this.loaded = false
        this.sprite = new Image()
        this.sprite.src = '../../assets/objects/comput-1.png'
        this.sprite.onload = () => {
            this.loaded = true
        }

        this.frameWidth = 128
        this.frameHeight = 128
        this.currentFrame = 0
        this.frameCount = 3 // 3 frames para os 3 estados do computador
        this.frameTimer = 0
        this.frameInterval = 200 // Velocidade da animação
        this.scale = 2
        this.width = this.frameWidth * this.scale
        this.height = this.frameHeight * this.scale

        // Estados
        this.isActive = false
        this.isSolved = false

        // Carregar todas as imagens do computador
        this.frames = [
            '../../assets/objects/comput-1.png',
            '../../assets/objects/comput-2.png',
            '../../assets/objects/comput-3.png'
        ].map(src => {
            const img = new Image()
            img.src = src
            return img
        })
    }

    draw() {
        // Só desenha se a sprite estiver carregada
        if (!this.loaded) {
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
            // Desenha o frame atual
            c.drawImage(
                this.frames[this.currentFrame],
                0,
                0,
                this.frameWidth,
                this.frameHeight,
                this.position.x,
                this.position.y,
                this.width,
                this.height
            )

            // Se o jogador estiver próximo e o computador não estiver resolvido
            if (this.isActive && !this.isSolved) {
                c.fillStyle = '#00f7ff'
                c.font = '24px Courier New'
                c.textAlign = 'center'
                c.fillText(
                    'Pressione E para decodificar',
                    this.position.x + this.width / 2,
                    this.position.y - 10
                )

                // Efeito de brilho
                c.beginPath()
                c.arc(
                    this.position.x + this.width / 2,
                    this.position.y + this.height / 2,
                    40,
                    0,
                    Math.PI * 2
                )
                c.fillStyle = 'rgba(0, 247, 255, 0.2)'
                c.fill()
            }
        } catch (error) {
            console.error('Erro ao desenhar computador:', error)
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

    showDecodeModal() {
        const modal = document.getElementById('holo-modal')
        const modalTitle = document.getElementById('modal-title')
        const modalText = document.getElementById('modal-text')

        modalTitle.textContent = 'TERMINAL DE DECODIFICAÇÃO'
        modalText.innerHTML = `
            <div class="decode-content">
                <p>Derrote a IA e salve o mundo!</p>
                <p>Decodifique a mensagem em binário:</p>
                <p class="binary-text">01010100 01100101 00100000 01110110 01100101 01101010 01101111 00100000 01101110 01101111 00100000 01110000 01110010 01101111 01111000 01101001 01101101 01101111 00100000 01101010 01101111 01100111 01101111 00100000 01000101 01110010 01101111 01101110 00101110 00101110 00101110 00100000 01000100 01110010 00101110 01010111</p>
                <input type="text" id="decode-input" class="decode-input" placeholder="Digite a mensagem decodificada">
                <button onclick="checkDecodedMessage()" class="decode-button">Confirmar</button>
            </div>
        `
        modal.style.display = 'block'
    }
}