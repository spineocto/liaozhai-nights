/**
 * Fast-check arbitraries (資料生成器) for property-based testing
 * 
 * This module provides test data generators for the Liaozhai Nights application.
 * These generators create random but valid data structures for testing purposes.
 */

import fc from 'fast-check'

/**
 * Generate random creature types
 * 生成隨機的生物類型（狐仙、畫皮妖、殭屍）
 */
export const creatureTypeArbitrary = () =>
  fc.oneof(
    fc.constant('fox-spirit' as const),
    fc.constant('painted-skin' as const),
    fc.constant('jiangshi' as const)
  )

/**
 * Generate random scene types
 * 生成隨機的場景類型（敘事或結局）
 */
export const sceneTypeArbitrary = () =>
  fc.oneof(
    fc.constant('narrative' as const),
    fc.constant('ending' as const)
  )

/**
 * Generate random Choice objects
 * 生成隨機的選擇選項
 */
export const choiceArbitrary = () =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    text: fc.string({ minLength: 1, maxLength: 100 }),
    nextSceneId: fc.string({ minLength: 1, maxLength: 20 }),
  })

/**
 * Generate random narrative Scene objects
 * 生成隨機的敘事場景（包含 3 個選擇）
 */
export const narrativeSceneArbitrary = () =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    type: fc.constant('narrative' as const),
    content: fc.lorem({ maxCount: 5 }),
    choices: fc.array(choiceArbitrary(), { minLength: 3, maxLength: 3 }),
    creatureType: fc.option(creatureTypeArbitrary(), { nil: undefined }),
  })

/**
 * Generate random ending Scene objects
 * 生成隨機的結局場景（包含文言文和翻譯）
 */
export const endingSceneArbitrary = () =>
  fc.record({
    id: fc.string({ minLength: 1, maxLength: 20 }),
    type: fc.constant('ending' as const),
    classicalText: fc.lorem({ maxCount: 3 }),
    modernChinese: fc.lorem({ maxCount: 3 }),
    englishTranslation: fc.lorem({ maxCount: 3 }),
    creatureType: fc.option(creatureTypeArbitrary(), { nil: undefined }),
  })

/**
 * Generate random StoryState objects
 * 生成隨機的故事狀態
 */
export const storyStateArbitrary = () =>
  fc.record({
    currentSceneId: fc.string({ minLength: 1, maxLength: 20 }),
    choiceHistory: fc.array(fc.string({ minLength: 1, maxLength: 20 })),
    creatureEncountered: fc.option(creatureTypeArbitrary(), { nil: null }),
    isComplete: fc.boolean(),
  })

/**
 * Generate random Translation objects
 * 生成隨機的翻譯資料
 */
export const translationArbitrary = () =>
  fc.record({
    original: fc.lorem({ maxCount: 2 }),
    modernChinese: fc.lorem({ maxCount: 2 }),
    english: fc.lorem({ maxCount: 2 }),
  })

/**
 * Generate random viewport sizes (from mobile to desktop)
 * 生成隨機的視口尺寸（從手機到桌面）
 */
export const viewportSizeArbitrary = () =>
  fc.record({
    width: fc.integer({ min: 320, max: 2560 }),
    height: fc.integer({ min: 568, max: 1440 }),
  })
