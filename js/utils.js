// js/utils/utils.js
Array.prototype.parse2D = function () {
    const rows = []
    for (let i = 0; i < this.length; i += 130) {
        rows.push(this.slice(i, i + 130))
    }
    return rows
}

Array.prototype.createObjectsFrom2D = function () {
    const objects = []
    this.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol === 2144) {
                objects.push(
                    new CollisionBlock({
                        position: {
                            x: x * 32,
                            y: y * 32,
                        },
                    })
                )
            }
        })
    })
    return objects
}

function detectCollision({ object1, object2 }) {
    return (
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.y + object1.height >= object2.position.y
    )
}

// Função para carregar imagem de forma assíncrona
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

// Função para esperar um tempo específico
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Função para verificar se um objeto está dentro da viewport
function isInViewport(object, camera) {
    return (
        object.position.x + object.width >= camera.position.x &&
        object.position.x <= camera.position.x + camera.width &&
        object.position.y + object.height >= camera.position.y &&
        object.position.y <= camera.position.y + camera.height
    )
}

// Função para limitar um número entre um mínimo e máximo
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max))
}

// Função para calcular a distância entre dois pontos
function getDistance(point1, point2) {
    const a = point1.x - point2.x
    const b = point1.y - point2.y
    return Math.sqrt(a * a + b * b)
}

// Função para verificar se um ponto está dentro de um retângulo
function pointInRect(point, rect) {
    return (
        point.x >= rect.position.x &&
        point.x <= rect.position.x + rect.width &&
        point.y >= rect.position.y &&
        point.y <= rect.position.y + rect.height
    )
}