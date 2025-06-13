// js/classes/AudioManager.js
class AudioManager {
    constructor() {
        this.sounds = {
            jump: new Audio('./assets/sounds/jump.mp3'),
            attack: new Audio('./assets/sounds/attack.mp3'),
            introMusic: new Audio('./assets/sounds/bg-music.mp3'),
            bgMusic1: new Audio('./assets/sounds/bg-music.mp3'),
            bgMusic2: new Audio('./assets/sounds/bg-music.mp3'),
            bgMusic3: new Audio('./assets/sounds/bg-music.mp3'),
            hologramAudio1: new Audio('./assets/sounds/Recording.m4a'),
            hologramAudio2: new Audio('./assets/sounds/Recording (2).m4a'),

            error: new Audio('./assets/sounds/error.mp3')
        }

        // Configurações de volume
        this.sounds.introMusic.volume = 0.2
        this.sounds.jump.volume = 0.3
        this.sounds.attack.volume = 0.3
        this.sounds.hologramAudio1.volume = 1.0
        this.sounds.hologramAudio2.volume = 1.0



        // Configurar músicas de fundo
        this.bgMusics = ['bgMusic1', 'bgMusic2', 'bgMusic3']
        this.bgMusics.forEach(music => {
            this.sounds[music].loop = true
            this.sounds[music].volume = 0.02
        })

        this.currentMusic = null
        this.isMusicPlaying = false
    }

    playHologramAudio(level) {
        const audioName = `hologramAudio${level}`
        if (this.sounds[audioName]) {
            this.stopMusic() // Para a música de fundo
            this.sounds[audioName].currentTime = 0
            this.sounds[audioName].play().then(() => {
                // Quando o áudio terminar, retoma a música
                this.sounds[audioName].onended = () => {
                    this.playLevelMusic(level)
                }
            }).catch(error => {
                console.log("Erro ao tocar áudio do holograma:", error)
            })
        }
    }

    playSound(soundName, callback) {
        if (this.sounds[soundName]) {
            const sound = this.sounds[soundName]
            sound.currentTime = 0

            if (callback) {
                sound.onended = () => {
                    callback()
                    sound.onended = null // Remove o callback após executar
                }
            }

            sound.play().catch(error => {
                console.log("Erro ao tocar som:", error)
            })
        }
    }

    stopSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].pause()
            this.sounds[soundName].currentTime = 0
        }
    }

    stopMusic() {
        if (this.currentMusic) {
            this.sounds[this.currentMusic].pause()
            this.sounds[this.currentMusic].currentTime = 0
            this.isMusicPlaying = false
        }
    }

    pauseMusic() {
        if (this.currentMusic && this.isMusicPlaying) {
            this.sounds[this.currentMusic].pause()
            this.isMusicPlaying = false
        }
    }

    resumeMusic() {
        if (this.currentMusic && !this.isMusicPlaying) {
            this.sounds[this.currentMusic].play()
            this.isMusicPlaying = true
        }
    }

    playLevelMusic(level) {
        // Para a música atual se existir
        if (this.currentMusic) {
            this.stopMusic()
        }

        const musicName = `bgMusic${level}`
        if (this.sounds[musicName]) {
            this.currentMusic = musicName
            this.sounds[musicName].currentTime = 0
            this.sounds[musicName].play().catch(error => {
                console.log("Erro ao tocar música:", error)
            })
            this.isMusicPlaying = true
        }
    }

    setVolume(soundName, volume) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].volume = volume
        }
    }

    setMusicVolume(volume) {
        this.bgMusics.forEach(music => {
            this.sounds[music].volume = volume
        })
    }

    setSoundVolume(volume) {
        // Ajusta volume de todos os efeitos sonoros
        this.sounds.jump.volume = volume
        this.sounds.attack.volume = volume
        this.sounds.success.volume = volume
        this.sounds.error.volume = volume
    }
}