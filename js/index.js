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

const player = new Player({
    imageSrc: './assets/player/idle.png',
    frameRate: 4,
    animations: {
        idleRight: {
            frameRate: 4,
            frameBuffer: 5,
            loop: true,
            imageSrc: './assets/player/idle.png',
        },
        runRight: {
            frameRate: 4,
            frameBuffer: 5,
            loop: true,
            imageSrc: './assets/player/running.png',
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 4,
            loop: false,
            imageSrc: './assets/player/idle.png',
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => {
                        level++
                        if (level === 4) level = 1 // Atualizado para 3 níveis
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay, {
                            opacity: 0,
                        })
                    },
                })
            },
        },
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
                imageSrc: './assets/background/SUBSOLO.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 3800,
                        y: 570,
                    },
                    imageSrc: './assets/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                    scale: 2,
                }),
            ]

            holograms = [
                new Hologram({
                    position: { x: 500, y: 650 },
                    title: 'BEM VINDO INVOCADOR',
                    text: 'Você não parece o DK, pra que subir aqui?'
                }),
                new Hologram({
                    position: { x: 1900, y: 550 },
                    title: 'Alerta de Segurança',
                    text: 'Sistema de defesa ativado. Proceda com cautela.'
                }),
                new Hologram({
                    position: { x: 2500, y: 600 },
                    title: 'Dica de Navegação',
                    text: 'A saída está próxima ao final do corredor.'
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
                imageSrc: './assets/background/MAPAEXTERO01.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 3700,
                        y: 575,
                    },
                    imageSrc: './assets/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                    scale: 2
                }),
            ]

            holograms = [
                new Hologram({
                    position: { x: 300, y: 300 },
                    title: 'Bem-vindo ao Exterior',
                    text: 'A área externa contém segredos importantes.'
                }),
                new Hologram({
                    position: { x: 1200, y: 400 },
                    title: 'Aviso do Sistema',
                    text: 'Detectada atividade suspeita nesta área.'
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
                imageSrc: './assets/background/MAPATORRE01.png',
            })

            doors = [
                new Sprite({
                    position: {
                        x: 3600,
                        y: 470,
                    },
                    imageSrc: './assets/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 5,
                    loop: false,
                    autoplay: false,
                    scale: 3
                }),
            ]

            holograms = [
                new Hologram({
                    position: { x: 400, y: 400 },
                    title: 'Bem-vindo à Torre',
                    text: 'O ar fica mais denso conforme você sobe...'
                }),
                new Hologram({
                    position: { x: 1500, y: 500 },
                    title: 'Aviso de Segurança',
                    text: 'Cuidado com as alturas, a queda pode ser fatal.'
                }),
                new Hologram({
                    position: { x: 2800, y: 600 },
                    title: 'Mensagem Misteriosa',
                    text: 'O topo guarda segredos inimagináveis...'
                })
            ]
        },
    },

}

function switchLevel() {
    gsap.to(overlay, {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
            level++
            if (level > 3) level = 1 // Atualizado para 3 níveis
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

function animate() {
    window.requestAnimationFrame(animate)





    background.draw()

    doors.forEach((door) => {
        door.draw()
    })

    holograms.forEach((hologram) => {
        hologram.draw()

        const distance = Math.hypot(
            player.position.x - hologram.position.x,
            player.position.y - hologram.position.y
        )

        if (distance < 100) {
            if (!hologram.isActive) {
                hologram.isActive = true
                hologram.showModal()
            }
        } else {
            if (hologram.isActive) {
                hologram.isActive = false
                hologram.hideModal()
            }
        }
    })

    player.handleInput(keys)
    player.draw()
    player.update()

    c.restore()

    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()
}

levels[level].init()
animate()