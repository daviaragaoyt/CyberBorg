// js/classes/Puzzle.js
class Puzzle extends Hologram {
    constructor({ position, title, text, imageSrc, puzzleId, question, correctAnswer, explanation, requiresCustomInput = false }) {
        super({ position, title, text, imageSrc })

        this.puzzleId = puzzleId
        this.question = question
        this.correctAnswer = correctAnswer
        this.explanation = explanation
        this.requiresCustomInput = requiresCustomInput

        // Carrega sprite do puzzle
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

        // Estado do puzzle
        this.isAnswered = this.loadStoredState()
        this.isActive = false
    }

    // Método para carregar o estado salvo
    loadStoredState() {
        try {
            const stored = localStorage.getItem(`puzzle_${this.puzzleId}`)
            return stored === 'true'
        } catch (error) {
            console.error('Erro ao carregar estado do puzzle:', error)
            return false
        }
    }

    // Método para salvar o estado
    saveState(isCorrect) {
        try {
            localStorage.setItem(`puzzle_${this.puzzleId}`, isCorrect)
            this.isAnswered = isCorrect
        } catch (error) {
            console.error('Erro ao salvar estado do puzzle:', error)
        }
    }

    draw() {
        if (!this.loaded) {
            c.fillStyle = this.isAnswered ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 247, 255, 0.3)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
            return
        }

        try {
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
        } catch (error) {
            console.error('Erro ao desenhar sprite:', error)
            c.fillStyle = this.isAnswered ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 247, 255, 0.3)'
            c.fillRect(this.position.x, this.position.y, this.width, this.height)
        }

        if (this.isActive) {
            c.fillStyle = this.isAnswered ? '#00ff00' : '#00f7ff'
            c.font = '12px Courier New'
            c.textAlign = 'center'
            c.fillText(
                'Pressione E',
                this.position.x + this.width / 2,
                this.position.y - 10
            )

            c.beginPath()
            c.arc(
                this.position.x + this.width / 2,
                this.position.y + this.height / 2,
                30,
                0,
                Math.PI * 2
            )
            c.fillStyle = this.isAnswered ?
                'rgba(0, 255, 0, 0.2)' :
                'rgba(0, 247, 255, 0.3)'
            c.fill()
        }
    }

    showModal() {
        const modal = document.getElementById('holo-modal')
        const modalTitle = document.getElementById('modal-title')
        const modalText = document.getElementById('modal-text')

        modalTitle.textContent = this.title

        if (!this.isAnswered) {
            if (this.requiresCustomInput) {
                modalText.innerHTML = `
                    <div class="puzzle-content">
                        <img src="${this.imageSrc}" alt="Puzzle" class="hologram-image">
                        <p class="puzzle-question">${this.question}</p>
                        <div class="code-input-container">
                            <input type="text" id="code-input" class="code-input" placeholder="Digite o código">
                            <button onclick="checkPuzzleCode('${this.puzzleId}')" class="code-submit-button">Confirmar</button>
                        </div>
                    </div>
                `
            } else {
                modalText.innerHTML = `
                    <div class="puzzle-content">
                        <img src="${this.imageSrc}" alt="Puzzle" class="hologram-image">
                        <p class="puzzle-question">${this.question}</p>
                        <div class="answer-buttons">
                            <button onclick="checkPuzzleAnswer('${this.puzzleId}', 'a')">A</button>
                            <button onclick="checkPuzzleAnswer('${this.puzzleId}', 'b')">B</button>
                            <button onclick="checkPuzzleAnswer('${this.puzzleId}', 'c')">C</button>
                            <button onclick="checkPuzzleAnswer('${this.puzzleId}', 'd')">D</button>
                        </div>
                    </div>
                `
            }
        } else {
            modalText.innerHTML = `
                <div class="puzzle-content">
                    <img src="${this.imageSrc}" alt="Puzzle" class="hologram-image">
                    <p class="success-text">Enigma resolvido!</p>
                    <p class="explanation-text">${this.explanation}</p>
                    <p class="original-text">${this.text}</p>
                </div>
            `
        }

        modal.style.display = 'block'
    }
}