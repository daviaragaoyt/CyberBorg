// js/classes/Sprite.js
class Sprite {
    constructor({ position, imageSrc, frameRate = 1, animations, frameBuffer = 2, loop = true, autoplay = true, scale = 1 }) {
        this.position = position
        this.scale = scale
        this.loaded = false
        this.image = new Image()
        this.image.src = imageSrc
        this.image.onload = () => {
            this.width = (this.image.width / this.frameRate)
            this.height = this.image.height
            this.loaded = true
        }
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapsedFrames = 0
        this.loop = loop
        this.autoplay = autoplay
        this.animations = animations
        this.currentAnimation = null
        this.isDebugging = false

        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc
                this.animations[key].image = image
            }
        }
    }

    draw() {
        if (!this.loaded) return

        const cropbox = {
            position: {
                x: this.currentFrame * (this.image.width / this.frameRate),
                y: 0,
            },
            width: this.image.width / this.frameRate,
            height: this.image.height,
        }

        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            this.position.x,
            this.position.y,
            this.width * this.scale,
            this.height * this.scale
        )

        // Se for uma porta e o jogador estiver próximo, mostra o indicador "Pressione E"
        if (this.frameRate === 5 && player.checkDoorCollision(this)) { // frameRate 5 identifica que é uma porta
            c.fillStyle = '#00f7ff'
            c.font = '24px Courier New'
            c.textAlign = 'center'
            c.fillText(
                'Pressione E',
                this.position.x + (this.width * this.scale) / 2,
                this.position.y - 10
            )
        }

        this.updateFrames()
    }

    play() {
        this.autoplay = true
    }

    updateFrames() {
        if (!this.autoplay) return

        this.elapsedFrames++

        if (this.elapsedFrames % this.frameBuffer === 0) {
            if (this.currentFrame < this.frameRate - 1) {
                this.currentFrame++
            } else if (this.loop) {
                this.currentFrame = 0
            } else if (this.currentAnimation?.onComplete) {
                this.currentAnimation.onComplete()
            }
        }
    }
}