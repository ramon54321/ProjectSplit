import * as THREE from 'three'
import * as fs from 'fs'
import * as _ from 'lodash'
import path from 'path'

const textureExtensions = [
  '.png',
  '.jpg',
]

export class Assets {
  private readonly textures: { [key: string]: THREE.Texture } = {}
  constructor() {
    const resources = fs.readdirSync('resources')
    _.forEach(resources, (resource) => {
      const extension = path.extname(resource)
      if (textureExtensions.includes(extension)) {
        this.textures[resource] = new THREE.TextureLoader().load(`resources/${resource}`)
      } else {
        console.warn(`Unknown asset: ${resource}`)
      }
    })
  }
  getTexture(name: string): THREE.Texture {
    return this.textures[name]
  }
}
