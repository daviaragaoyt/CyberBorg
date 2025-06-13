// js/classes/IntroManager.js
class IntroManager {
    constructor() {
        this.createIntroElements()
        this.audioManager = new AudioManager()
    }

    createIntroElements() {
        // Criar elementos da intro
        const introScreen = document.createElement('div')
        introScreen.id = 'introScreen'
        introScreen.className = 'intro-screen'

        const logo = document.createElement('img')
        logo.src = './assets/objects/logo.png'
        logo.id = 'gameLogo'
        logo.className = 'game-logo'

        const title = document.createElement('h1')
        title.textContent = 'The Weverson Corporation Presents'
        title.className = 'intro-title'

        const subtitle = document.createElement('h2')
        subtitle.textContent = 'REBOOT: O ULTIMO PROTOCOLO'
        subtitle.className = 'intro-subtitle'

        const startBtn = document.createElement('button')
        startBtn.textContent = 'Iniciar Jornada'
        startBtn.id = 'startButton'
        startBtn.className = 'start-button'

        introScreen.appendChild(logo)
        introScreen.appendChild(title)
        introScreen.appendChild(subtitle)
        introScreen.appendChild(startBtn)
        document.body.appendChild(introScreen)

        // Adicionar estilos
        this.addIntroStyles()
    }

    addIntroStyles() {
        const styles = `
            .intro-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: black;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }

            .game-logo {
                width: 300px;
                height: 300px;
                opacity: 0;
                transition: opacity 2s;
                margin-bottom: 30px;
            }

            .intro-title {
                color: #00f7ff;
                font-family: 'Courier New', monospace;
                font-size: 36px;
                text-shadow: 0 0 10px #00f7ff;
                margin: 10px 0;
                opacity: 0;
                transition: opacity 2s;
                text-align: center;
            }

            .intro-subtitle {
                color: #00f7ff;
                font-family: 'Courier New', monospace;
                font-size: 48px;
                text-shadow: 0 0 15px #00f7ff;
                margin: 20px 0 40px 0;
                opacity: 0;
                transition: opacity 2s;
                text-align: center;
            }

            .start-button {
                padding: 15px 30px;
                font-size: 24px;
                background: transparent;
                color: #00f7ff;
                border: 2px solid #00f7ff;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                opacity: 0;
                transition: all 0.3s;
                margin-top: 20px;
            }

            .start-button:hover {
                background: #00f7ff;
                color: black;
                box-shadow: 0 0 20px #00f7ff;
                transform: scale(1.05);
            }
        `

        const styleSheet = document.createElement('style')
        styleSheet.textContent = styles
        document.head.appendChild(styleSheet)
    }

    async playIntro() {
        const logo = document.getElementById('gameLogo')
        const title = document.querySelector('.intro-title')
        const subtitle = document.querySelector('.intro-subtitle')
        const startBtn = document.getElementById('startButton')
        const canvas = document.querySelector('canvas')

        // Esconde o canvas inicialmente
        canvas.style.display = 'none'

        // Inicia a música da intro
        this.audioManager.playSound('introMusic')

        // Animações de fade in sequenciais
        setTimeout(() => logo.style.opacity = '1', 500)
        setTimeout(() => title.style.opacity = '1', 2000)
        setTimeout(() => subtitle.style.opacity = '1', 3000)
        setTimeout(() => startBtn.style.opacity = '1', 4000)

        // Evento do botão de início
        startBtn.onclick = () => this.startGame()
    }

    startGame() {
        const introScreen = document.getElementById('introScreen')
        const canvas = document.querySelector('canvas')

        // Fade out da intro
        gsap.to(introScreen, {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                introScreen.remove()
                canvas.style.display = 'block'

                // Inicia o jogo
                this.audioManager.stopSound('introMusic')
                this.audioManager.playLevelMusic(level)
                levels[level].init()
                animate()
            }
        })
    }
}