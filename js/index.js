// index.js
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 4100
canvas.height = 900

let parsedCollisions
let collisionBlocks
let background
let doors
let holograms
let computer

// Inicializa os gerenciadores
const audioManager = new AudioManager()
const introManager = new IntroManager()

const player = new Player({
    imageSrc: '../assets/player/idle.png',
    frameRate: 4,
    animations: {
        idleRight: {
            frameRate: 4,
            frameBuffer: 8,
            loop: true,
            imageSrc: '../assets/player/idle.png',
        },
        runRight: {
            frameRate: 4,
            frameBuffer: 6,
            loop: true,
            imageSrc: '../assets/player/running.png',
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc: '../assets/player/idle.png',
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++
                        if (level === 4) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        audioManager.playLevelMusic(level)
                        gsap.to(overlay, {
                            opacity: 0,
                        })
                    },
                })
            },
        },
        // Você pode adicionar mais animações aqui depois
    },
})

const keys = {
    w: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
}

const overlay = {
    opacity: 0,
}

audioManager.stopMusic() // Para a música
audioManager.playSound('hologramAudio1', () => {
    audioManager.playLevelMusic(level) // Retoma a música após o áudio
})
let level = 1
let levels = {
    1: {
        init: () => {
            parsedCollisions = collisionsLevel1.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks

            player.position = {
                x: 50,
                y: 300
            }

            if (player.currentAnimation) player.currentAnimation.isActive = false

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: '../assets/background/SUBSOLO.png',
            })

            doors = [
                new Door({
                    position: {
                        x: 3700,
                        y: 400,
                    },
                    scale: 3
                }),
            ]

            holograms = [
                // Tutorial de controles - exatamente na posição inicial do player
                new Hologram({
                    position: {
                        x: 120,
                        y: 750
                    },
                    title: 'CONTROLES DO SISTEMA',
                    imageSrc: '../assets/objects/carta-hologram.jpeg'
                }),

                // Carta misteriosa
                new Hologram({
                    position: { x: 1900, y: 630 },
                    title: 'CARTA MISTERIOSA',
                    text: 'Uma mensagem antiga foi encontrada...',
                    imageSrc: '../assets/objects/carta-hologram1.jpg',
                    audioTrack: 'hologramAudio1' // Primeiro áudio
                })
            ]
        },
    },
    2: {
        init: () => {
            parsedCollisions = collisionsLevel2.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks

            player.position = {
                x: 96,
                y: 140
            }

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: '../assets/background/MAPAEXTERO01.png',
            })
            doors = [
                new Door({
                    position: {
                        x: 3800,
                        y: 530,
                    },
                    scale: 2
                }),
            ]
            holograms = [
                new Hologram({
                    position: { x: 300, y: 700 },
                    title: 'CARTA Holográfica 02 - Área Externa',
                    text: 'Uma mensagem antiga foi encontrada...',
                    imageSrc: '../assets/objects/carta-hologram2.jpeg',
                    audioTrack: 'hologramAudio2' // Especifica qual áudio usar
                }),
                new Puzzle({
                    position: { x: 800, y: 700 },
                    puzzleId: 'tech_history',
                    title: 'ENIGMA DA TECNOLOGIA',
                    text: 'Conhecimento desbloqueado: A origem do QWERTY...',
                    imageSrc: '../assets/objects/holograma-audio.png',
                    question: 'Por que a disposição das teclas QWERTY foi criada?\n\n' +
                        'A) Para digitar mais rápido\n' +
                        'B) Para evitar que as teclas travassem\n' +
                        'C) Porque é mais confortável\n' +
                        'D) Foi aleatório',
                    correctAnswer: 'b',
                    explanation: 'O layout QWERTY foi criado para máquinas de escrever antigas, separando letras comumente usadas juntas para evitar que as hastes mecânicas travassem. Este design permanece até hoje, mesmo não sendo mais necessário em teclados modernos.'
                }),
                new Puzzle({
                    position: { x: 1700, y: 550 },
                    puzzleId: 'mouse',
                    title: 'ENIGMA DA TECNOLOGIA #2',
                    text: 'Conhecimento desbloqueado: Origem do mouse...',
                    imageSrc: '../assets/objects/holograma-audio.png',
                    question: 'Por que chamamos o dispositivo apontador de "mouse"?\n\n' +
                        'A) Porque o cabo parecia um rabo\n' +
                        'B) Por causa do formato arredondado\n' +
                        'C) Era a marca do primeiro modelo\n' +
                        'D) Foi uma escolha aleatória',
                    correctAnswer: 'a',
                    explanation: 'O nome "mouse" foi dado porque o cabo que saía do dispositivo lembrava o rabo de um rato.'
                }),
                new Puzzle({
                    position: { x: 1950, y: 550 },
                    puzzleId: 'internet',
                    title: 'ENIGMA DA TECNOLOGIA #3',
                    text: 'Conhecimento desbloqueado: História da Internet...',
                    imageSrc: '../assets/objects/holograma-audio.png',
                    question: 'Qual foi o primeiro navegador web da história?\n\n' +
                        'A) Internet Explorer\n' +
                        'B) Netscape\n' +
                        'C) WorldWideWeb\n' +
                        'D) Mozilla',
                    correctAnswer: 'c',
                    explanation: 'O WorldWideWeb foi criado por Tim Berners-Lee em 1990 e foi o primeiro navegador web da história.'
                }),
                new Puzzle({
                    position: { x: 2800, y: 700 },
                    puzzleId: 'terminal_code',
                    title: 'TERMINAL ANTIGO',
                    text: 'Terminal desbloqueado: Acesso concedido...',
                    imageSrc: '../assets/objects/holograma-audio.png',
                    question: 'Digite o código de acesso:\n\n' +
                        'DICA: "Três passos para a direita. Dois toques. Um acesso."\n' +
                        'O padrão antigo espera sua resposta...',
                    correctAnswer: '321',
                    explanation: 'O código estava na sequência: TRÊS passos, DOIS toques, UM acesso (3-2-1)',
                    requiresCustomInput: true // Nova propriedade para indicar input personalizado
                })
            ]
        },
    },
    3: {
        init: () => {
            parsedCollisions = collisionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks

            player.position = {
                x: 96,
                y: 140
            }

            background = new Sprite({
                position: {
                    x: 0,
                    y: 0,
                },
                imageSrc: '../assets/background/MAPATORRE01.png',
            })

            doors = [
                new Door({
                    position: {
                        x: 3800,
                        y: 530,
                    },
                    scale: 2
                }),
            ]

            computer = new Computer({
                position: { x: 1500, y: 700 } // Posição original que você queria
            })

            holograms = [
                new Hologram({
                    position: { x: 300, y: 620 },
                    title: 'Bem-vindo à Torre',
                    text: 'O ar fica mais denso conforme você sobe...'
                }),

            ]
        },
    },
}

function checkDecodedMessage() {
    const input = document.getElementById('decode-input')
    const correctMessage = "Te vejo no proximo jogo Eron... Dr.W"

    if (input.value.trim() === correctMessage) {
        computer.isSolved = true

        // Fecha o modal de decodificação
        document.getElementById('holo-modal').style.display = 'none'

        // Cria o modal de fim de jogo
        const modal = document.getElementById('holo-modal')
        const modalTitle = document.getElementById('modal-title')
        const modalText = document.getElementById('modal-text')

        modalTitle.textContent = 'FIM DE JOGO'
        modalText.innerHTML = `
            <div class="end-game-content">
                <h2 class="success-text">PARABÉNS!</h2>
                <p class="end-message">Você completou sua jornada e descobriu a verdade.</p>
                <p class="credits-title">OBRIGADO POR JOGAR</p>
                <div class="credits">
                    <p>REBOOT: O Último Protocolo</p>
                    <p>Desenvolvido por Davi Aragão</p>
                    <p>13/06/2025</p>
                </div>
                <button onclick="restartGame()" class="end-game-button">Jogar Novamente</button>
            </div>
        `
        modal.style.display = 'block'

        // Adiciona os estilos necessários
        const style = document.createElement('style')
        style.textContent = `
            .end-game-content {
                text-align: center;
                padding: 30px;
                color: #00f7ff;
            }

            .success-text {
                font-size: 36px;
                margin-bottom: 20px;
                text-shadow: 0 0 10px #00f7ff;
                animation: glow 2s infinite;
            }

            .end-message {
                font-size: 20px;
                margin: 20px 0;
                line-height: 1.5;
            }

            .credits-title {
                font-size: 28px;
                margin: 30px 0;
                text-shadow: 0 0 10px #00f7ff;
            }

            .credits {
                margin: 20px 0;
                font-size: 18px;
                line-height: 1.8;
            }

            .end-game-button {
                padding: 15px 30px;
                font-size: 20px;
                background: transparent;
                border: 2px solid #00f7ff;
                color: #00f7ff;
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.3s;
            }

            .end-game-button:hover {
                background: #00f7ff;
                color: black;
                transform: scale(1.05);
            }

            @keyframes glow {
                0% { text-shadow: 0 0 10px #00f7ff; }
                50% { text-shadow: 0 0 20px #00f7ff, 0 0 30px #00f7ff; }
                100% { text-shadow: 0 0 10px #00f7ff; }
            }
        `
        document.head.appendChild(style)

        // Para a música atual e toca uma música de vitória se tiver
        audioManager.stopMusic()
        // audioManager.playSound('victory') // Se tiver um som de vitória
    } else {
        input.value = ''
        input.placeholder = 'Mensagem incorreta. Tente novamente.'
        input.style.borderColor = '#ff0000'
        setTimeout(() => {
            input.style.borderColor = '#00f7ff'
            input.placeholder = 'Digite a mensagem decodificada'
        }, 500)
        audioManager.playSound('error')
    }
}

// Função para reiniciar o jogo
function restartGame() {
    level = 1
    levels[level].init()
    document.getElementById('holo-modal').style.display = 'none'
    audioManager.playLevelMusic(level)
}

function switchLevel() {
    gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
            level++
            if (level > 3) level = 1
            levels[level].init()
            player.switchSprite('idleRight')
            player.preventInput = false
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
            })
        },
    })
}
function checkPuzzleAnswer(puzzleId, answer) {
    const puzzle = holograms.find(h => h instanceof Puzzle && h.puzzleId === puzzleId)

    if (puzzle && !puzzle.isAnswered) {
        if (answer === puzzle.correctAnswer) {
            puzzle.saveState(true)
            puzzle.showModal()
            audioManager.playSound('success')
        } else {
            const button = document.querySelector(`.answer-buttons button:nth-child(${['a', 'b', 'c', 'd'].indexOf(answer) + 1})`)
            button.style.borderColor = '#ff0000'
            setTimeout(() => {
                button.style.borderColor = '#00f7ff'
            }, 500)
            audioManager.playSound('error')
        }
    }
}

function checkPuzzleCode(puzzleId) {
    const puzzle = holograms.find(h => h instanceof Puzzle && h.puzzleId === puzzleId)
    const input = document.getElementById('code-input')

    if (puzzle && !puzzle.isAnswered && input) {
        if (input.value === puzzle.correctAnswer) {
            puzzle.saveState(true)
            puzzle.showModal()
            audioManager.playSound('success')
        } else {
            input.value = ''
            input.placeholder = 'Código incorreto'
            input.style.borderColor = '#ff0000'
            setTimeout(() => {
                input.style.borderColor = '#00f7ff'
                input.placeholder = 'Digite o código'
            }, 500)
            audioManager.playSound('error')
        }
    }
}

function animate() {
    window.requestAnimationFrame(animate)

    background.draw()

    doors.forEach(door => {
        door.draw()
    })

    // Desenha o computador se estivermos no level 3
    if (level === 3 && computer) {
        computer.draw()
        computer.isActive = computer.checkPlayerCollision(player)
    }

    holograms.forEach(hologram => {
        hologram.draw()
        hologram.isActive = hologram.checkPlayerCollision(player)
    })

    player.handleInput(keys)
    player.draw()
    player.update()

    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}
// Inicia o jogo com a intro
introManager.playIntro()