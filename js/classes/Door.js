class Door extends Sprite {
    constructor({ position, imageSrc }) {
        super({
            position,
            imageSrc,
            frameRate: 1,

        })

        // Posição fixa para a porta em todos os níveis
        this.position = {
            x: canvas.width - 150, // 150 pixels da direita
            y: canvas.height - 200 // 200 pixels do chão
        }
    }
}

// Nova classe Hint.js
class Hint extends Sprite {
    constructor({ position, imageSrc, text }) {
        super({
            position,
            imageSrc,
            frameRate: 1,

        })
        this.text = text
    }


}