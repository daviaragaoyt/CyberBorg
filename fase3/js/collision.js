// collision.js
const Collision = (function () {
    let collisionGrid = [];
    let tileW = 0;
    let tileH = 0;
    let mapWInTiles = 0;
    let mapHInTiles = 0;

    /**
     * Inicializa o sistema de colisão com os dados do mapa Tiled.
     * @param {object} tiledMapData - O objeto de dados do mapa exportado do Tiled.
     * @param {string} collisionLayerName - O nome da camada no Tiled usada para colisões.
     * @param {number} defaultTileWidth - Largura padrão do tile se não encontrada no tiledMapData.
     * @param {number} defaultTileHeight - Altura padrão do tile se não encontrada no tiledMapData.
     */
    function init(tiledMapData, collisionLayerName, defaultTileWidth = 16, defaultTileHeight = 16) {
        if (!tiledMapData) {
            console.error("Collision.init: tiledMapData não fornecido.");
            return false;
        }

        tileW = tiledMapData.tilewidth || defaultTileWidth;
        tileH = tiledMapData.tileheight || defaultTileHeight;

        if (!tileW || !tileH) {
            console.error("Collision.init: Dimensões dos tiles (tilewidth, tileheight) não encontradas ou não fornecidas como padrão.");
            return false;
        }

        const layer = tiledMapData.layers.find(l => l.name === collisionLayerName);

        if (!layer) {
            console.error(`Collision.init: Camada de colisão "${collisionLayerName}" não encontrada.`);
            // Tenta usar a primeira camada se o nome não for encontrado e houver apenas uma
            if (tiledMapData.layers.length > 0) {
                console.warn(`Collision.init: Usando a primeira camada "${tiledMapData.layers[0].name}" como camada de colisão.`);
                // Note: Se você não forneceu o nome da camada no seu trecho, Tiled pode dar um nome padrão
                // ou você pode precisar pegar pelo índice, ex: tiledMapData.layers[0]
                // Para o seu snippet, a primeira camada não tem nome explícito, vamos assumir que é ela.
                // E a largura e altura dela:
                mapWInTiles = tiledMapData.layers[0].width || (tiledMapData.layers[0].data.length / tiledMapData.layers[0].height) || (tiledMapData.layers[0].data.length / tiledMapData.height);
                mapHInTiles = tiledMapData.layers[0].height || tiledMapData.height;
                const tileGIDs = tiledMapData.layers[0].data;

                if (!mapWInTiles || !mapHInTiles || !tileGIDs) {
                    console.error("Collision.init: Dados da primeira camada incompletos (width, height, data).");
                    return false;
                }
                processLayerData(tileGIDs, mapWInTiles, mapHInTiles);
                console.log(`Collision.init: Mapa de colisão inicializado com a primeira camada. Dimensões: ${mapWInTiles}x${mapHInTiles} tiles. Tile: ${tileW}x${tileH}px.`);
                return true;

            } else {
                console.error("Collision.init: Nenhuma camada encontrada no mapa.");
                return false;
            }
        } else {
            mapWInTiles = layer.width;
            mapHInTiles = layer.height;
            const tileGIDs = layer.data;

            if (!mapWInTiles || !mapHInTiles || !tileGIDs) {
                console.error(`Collision.init: Dados da camada "${collisionLayerName}" incompletos (width, height, data).`);
                return false;
            }
            processLayerData(tileGIDs, mapWInTiles, mapHInTiles);
            console.log(`Collision.init: Mapa de colisão inicializado. Camada: "${collisionLayerName}". Dimensões: ${mapWInTiles}x${mapHInTiles} tiles. Tile: ${tileW}x${tileH}px.`);
            return true;
        }
    }

    function processLayerData(tileGIDs, width, height) {
        collisionGrid = [];
        for (let i = 0; i < tileGIDs.length; i++) {
            // Considera qualquer tile com GID > 0 como colidível.
            // GID 0 é geralmente um tile vazio.
            collisionGrid.push(tileGIDs[i] > 0 ? 1 : 0);
        }
        // Verificação de consistência (opcional)
        if (collisionGrid.length !== width * height) {
            console.warn(`Collision.processLayerData: O número de GIDs (${tileGIDs.length}) não corresponde às dimensões da camada (${width}x${height} = ${width * height}). Pode haver problemas.`);
        }
    }


    /**
     * Verifica se uma coordenada no mundo (pixels) está sobre um tile sólido.
     * @param {number} worldX - Coordenada X no mundo (pixels).
     * @param {number} worldY - Coordenada Y no mundo (pixels).
     * @returns {boolean} - True se for sólido, false caso contrário.
     */
    function isSolidTileAt(worldX, worldY) {
        if (collisionGrid.length === 0) {
            console.warn("Collision.isSolidTileAt: Mapa de colisão não inicializado. Chame Collision.init() primeiro.");
            return false; // Ou true, dependendo do comportamento desejado para mapa não inicializado
        }

        const tileX = Math.floor(worldX / tileW);
        const tileY = Math.floor(worldY / tileH);

        // Verifica se está fora dos limites do mapa
        if (tileX < 0 || tileX >= mapWInTiles || tileY < 0 || tileY >= mapHInTiles) {
            return true; // Considera fora dos limites como sólido (comum em jogos)
        }

        const index = tileY * mapWInTiles + tileX;
        if (index < 0 || index >= collisionGrid.length) {
            console.warn(`Collision.isSolidTileAt: Índice (${index}) fora dos limites para collisionGrid de tamanho ${collisionGrid.length}. Coords: (${worldX},${worldY}) -> Tile: (${tileX},${tileY})`);
            return true; // Tratar como sólido para evitar erros
        }
        return collisionGrid[index] === 1;
    }

    /**
     * Verifica colisão de um retângulo com o mapa.
     * Checa os 4 cantos do retângulo. Para maior precisão, mais pontos podem ser checados.
     * @param {number} rectX - Coordenada X do canto superior esquerdo do retângulo (pixels).
     * @param {number} rectY - Coordenada Y do canto superior esquerdo do retângulo (pixels).
     * @param {number} rectW - Largura do retângulo (pixels).
     * @param {number} rectH - Altura do retângulo (pixels).
     * @returns {boolean} - True se houver colisão, false caso contrário.
     */
    function checkRectCollision(rectX, rectY, rectW, rectH) {
        // Canto superior esquerdo
        if (isSolidTileAt(rectX, rectY)) return true;
        // Canto superior direito
        if (isSolidTileAt(rectX + rectW - 1, rectY)) return true; // -1 para ficar dentro do pixel
        // Canto inferior esquerdo
        if (isSolidTileAt(rectX, rectY + rectH - 1)) return true;
        // Canto inferior direito
        if (isSolidTileAt(rectX + rectW - 1, rectY + rectH - 1)) return true;

        // Opcional: checar pontos centrais das arestas para objetos que se movem rápido
        // ou que são menores que o tile mas maiores que um pixel.
        // if (isSolidTileAt(rectX + rectW / 2, rectY)) return true; // Top-mid
        // if (isSolidTileAt(rectX + rectW / 2, rectY + rectH - 1)) return true; // Bottom-mid
        // if (isSolidTileAt(rectX, rectY + rectH / 2)) return true; // Left-mid
        // if (isSolidTileAt(rectX + rectW - 1, rectY + rectH / 2)) return true; // Right-mid

        return false;
    }

    // Expõe as funções públicas
    return {
        init: init,
        isSolidTileAt: isSolidTileAt,
        checkRectCollision: checkRectCollision,
        // Funções de getter para debug ou desenho do mapa de colisão
        getCollisionGrid: () => collisionGrid,
        getMapDimensionsInTiles: () => ({ width: mapWInTiles, height: mapHInTiles }),
        getTileDimensions: () => ({ width: tileW, height: tileH })
    };
})();

// Para ambientes Node.js/CommonJS (se você usar bundlers como Webpack/Browserify)
if (typeof module === 'object' && module && module.exports) {
    module.exports = Collision;
}