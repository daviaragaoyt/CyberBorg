class Hologram extends Sprite {
    constructor({ position, title, text }) {
        super({
            position,
            imageSrc: './assets/hologram.png', // Certifique-se de ter esta imagem
            frameRate: 4,
            frameBuffer: 5,
            scale: 2,
            loop: true,
            autoplay: true
        })
        this.title = title
        this.text = text
        this.width = 32
        this.height = 32
        this.isActive = false
        this.modal = document.getElementById('holo-modal')
        this.modalTitle = document.getElementById('modal-title')
        this.modalText = document.getElementById('modal-text')
    }

    showModal() {
        if (this.modal && this.modalTitle && this.modalText) {
            this.modalTitle.textContent = this.title
            this.modalText.textContent = this.text
            this.modal.style.display = 'block'
        }
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none'
        }
    }

    draw() {
        super.draw()

        if (this.isActive && this.loaded) {
            c.beginPath()
            c.arc(
                this.position.x + (this.width * this.scale) / 2,
                this.position.y + (this.height * this.scale) / 2,
                30,
                0,
                Math.PI * 2
            )
            c.fillStyle = 'rgba(0, 247, 255, 0.2)'
            c.fill()
        }
    }
}