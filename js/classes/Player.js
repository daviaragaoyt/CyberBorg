// Player.js
class Player extends Sprite {
    constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
        super({
            imageSrc,
            frameRate,
            animations,
            loop,
            scale: 1
        })

        this.position = {
            x: 200,
            y: 200
        }

        this.velocity = {
            x: 0,
            y: 0
        }

        this.hitbox = {
            position: {
                x: this.position.x + 35,
                y: this.position.y + 26
            },
            width: 14,
            height: 27
        }

        this.gravity = 1
        this.speed = 6
        this.jumpForce = -25
        this.collisionBlocks = collisionBlocks
        this.preventInput = false
        this.lastDirection = 'right'
        this.scale = 4.0
        this.frameBuffer = 5
    }

    switchSprite(name) {
        if (this.image === this.animations[name].image) return

        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = 20
        this.elapsedFrames = 4
        this.loop = this.animations[name].loop

        if (this.animations[name].onComplete && !this.loop) {
            this.currentAnimation = this.animations[name]
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

        c.save()

        if (this.lastDirection === 'left') {
            c.translate(this.position.x + this.width * this.scale, this.position.y)
            c.scale(-1, 1)
        } else {
            c.translate(this.position.x, this.position.y)
        }

        c.drawImage(
            this.image,
            cropbox.position.x,
            cropbox.position.y,
            cropbox.width,
            cropbox.height,
            0,
            0,
            this.width * this.scale,
            this.height * this.scale
        )

        c.restore()

        this.updateFrames()
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + (35 * this.scale),
                y: this.position.y + (26 * this.scale)
            },
            width: 14 * this.scale,
            height: 27 * this.scale
        }
    }

    checkDoorCollision(door) {
        return (
            this.hitbox.position.x + this.hitbox.width <= door.position.x + door.width &&
            this.hitbox.position.x >= door.position.x &&
            this.hitbox.position.y + this.hitbox.height >= door.position.y &&
            this.hitbox.position.y <= door.position.y + door.height
        )
    }

    handleInput(keys) {
        if (this.preventInput) return

        this.velocity.x = 0

        if (keys.d.pressed) {
            this.velocity.x = this.speed
            this.lastDirection = 'right'
            this.switchSprite('runRight')
        } else if (keys.a.pressed) {
            this.velocity.x = -this.speed
            this.lastDirection = 'left'
            this.switchSprite('runRight')
        } else {
            this.switchSprite('idleRight')
        }

        // Colisão com os limites do mapa
        if (this.position.x < 0) {
            this.position.x = 0
        }
        if (this.position.x + this.width * this.scale > 4100) {
            this.position.x = 4100 - this.width * this.scale
        }
    }

    update() {
        this.updateHitbox()
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
    }

    applyGravity() {
        this.velocity.y += this.gravity
        this.position.y += this.velocity.y
    }

    checkForHorizontalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                if (this.velocity.x < 0) {
                    const offset = this.hitbox.position.x - this.position.x
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }

                if (this.velocity.x > 0) {
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width
                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
            }
        }
    }

    checkForVerticalCollisions() {
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]

            if (
                this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height
            ) {
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    break
                }

                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }
            }
        }
    }
}