import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { gsap } from 'gsap'

import EventEmitter from './EventEmitter.js'

console.log(gsap)
export default class Resources extends EventEmitter {
    constructor(sources) {
        super()

        // Options
        this.sources = sources

        // Setup
        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        // HTML Element
        this.overlay = document.querySelector('.loading-overlay')
        this.progressBar = document.querySelector('.loading-progress')

        this.setLoaders()
        this.startLoading()
    }

    setLoaders() {
        this.loaders = {}

        this.loaders.dracoLoader = new DRACOLoader()
        this.loaders.dracoLoader.setDecoderPath('draco/')
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)

        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
        this.loaders.rgbeLoader = new RGBELoader()
    }

    startLoading() {
        // Loop each source
        for (const source of this.sources) {
            if (source.type === 'gltfModel') {
                this.loaders.gltfLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            } else if (source.type === 'rgbeTexture') {
                this.loaders.rgbeLoader.load(source.path, (file) => {
                    // console.log(source, file)
                    this.sourceLoaded(source, file)
                })
            }
        }
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file

        this.loaded++
        this.updateProgress()

        if (this.loaded === this.toLoad) {
            // console.log('Resources ready')
            this.trigger('ready')

            this.overlay.style.display = 'none'
        }
    }

    updateProgress() {
        var progress = Math.floor((this.loaded / this.toLoad) * 100)
        this.progressBar.innerHTML = `${progress}%`
    }
}
