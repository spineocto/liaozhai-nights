import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { creatureTypeArbitrary, narrativeSceneArbitrary } from './arbitraries'

describe('Test Setup Verification', () => {
  it('should have fast-check configured', () => {
    expect(fc).toBeDefined()
  })

  it('should generate valid creature types', () => {
    fc.assert(
      fc.property(creatureTypeArbitrary(), (creature) => {
        return ['fox-spirit', 'painted-skin', 'jiangshi'].includes(creature)
      })
    )
  })

  it('should generate narrative scenes with exactly 3 choices', () => {
    fc.assert(
      fc.property(narrativeSceneArbitrary(), (scene) => {
        return scene.choices?.length === 3
      })
    )
  })
})
