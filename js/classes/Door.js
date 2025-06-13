// js/classes/Door.js
class Door {
    constructor({ position, scale = 2 }) {
        this.position = position
        this.scale = scale
        this.width = 128
        this.height = 128

        // Carrega a imagem da porta
        this.image = new Image()
        this.image.src = '../assets/door/door1.png'

        // Estado da porta
        this.isActive = false
    }

    draw() {
        if (this.image) {
            c.drawImage(
                this.image,
                this.position.x,
                this.position.y,
                this.width * this.scale,
                this.height * this.scale
            )

            // Se o jogador estiver próximo, mostra o indicador
            if (this.checkPlayerCollision(player)) {
                this.isActive = true

                // Indicador visual
                c.fillStyle = '#00f7ff'
                c.font = '24px Courier New'
                c.textAlign = 'center'
                c.fillText(
                    'Pressione E',
                    this.position.x + (this.width * this.scale) / 2,
                    this.position.y - 10
                )

                // Efeito de brilho
                c.beginPath()
                c.arc(
                    this.position.x + (this.width * this.scale) / 2,
                    this.position.y + (this.height * this.scale) / 2,
                    40,
                    0,
                    Math.PI * 2
                )
                c.fillStyle = 'rgba(0, 247, 255, 0.2)'
                c.fill()
            } else {
                this.isActive = false
            }
        }
    }

    checkPlayerCollision(player) {
        return (
            player.hitbox.position.x + player.hitbox.width >= this.position.x &&
            player.hitbox.position.x <= this.position.x + this.width * this.scale &&
            player.hitbox.position.y + player.hitbox.height >= this.position.y &&
            player.hitbox.position.y <= this.position.y + this.height * this.scale
        )
    }
}