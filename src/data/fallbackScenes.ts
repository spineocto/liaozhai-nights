/**
 * Fallback Scenes
 * 備用場景
 * 
 * Pre-written scenes used when AI service is unavailable
 * 當 AI 服務不可用時使用的預寫場景
 */

import { Scene, SceneType, CreatureType } from '../types/story';

/**
 * 開場備用場景
 */
export const fallbackOpening: Scene = {
  id: 'fallback_opening',
  type: SceneType.NARRATIVE,
  content: `夜色深沉，秋風蕭瑟。你是一位趕考的書生，行走在荒涼的山道上。月光透過雲層灑落，照亮了前方的古老驛站。驛站門前懸掛著一盞搖曳的紅燈籠，發出昏黃的光芒。

忽然間，你聽見遠處傳來若有若無的歌聲，婉轉悽美，似近實遠...`,
  choices: [
    {
      id: 'fallback_choice_1',
      text: '循聲前往，一探究竟',
      nextSceneId: 'scene_2',
    },
    {
      id: 'fallback_choice_2',
      text: '走進驛站投宿',
      nextSceneId: 'scene_3',
    },
    {
      id: 'fallback_choice_3',
      text: '加快腳步，繼續趕路',
      nextSceneId: 'scene_4',
    },
  ],
};

/**
 * 狐仙結局
 */
export const fallbackFoxSpiritEnding: Scene = {
  id: 'fallback_ending_fox',
  type: SceneType.ENDING,
  content: '你的故事以與狐仙的邂逅告終...',
  classicalText: `書生遇狐仙於荒野，美豔絕倫，善解人意。相與談笑，竟忘歸途。狐仙曰：「公子有緣，當助一臂之力。」遂贈以錦囊，囑咐道：「科場之上，方可開之。」書生拜謝而別。

及至科場，開囊視之，所試題目赫然在目。書生大驚，方知所遇非凡。榜發，果中進士。

異史氏曰：「狐有情，人無義。此書生一生功名，實狐仙所賜。然人之於狐，恩將仇報者眾矣。可嘆可嘆！」`,
  modernChinese: `書生在荒野遇到了狐仙，她美麗動人，善解人意。兩人談笑風生，竟然忘記了時間。狐仙說：「公子與我有緣，應該助你一臂之力。」於是贈送一個錦囊，囑咐說：「到了考場上，才可以打開。」書生拜謝後離開。

等到了考場，打開錦囊一看，考試的題目赫然在目。書生大吃一驚，才知道所遇到的不是凡人。放榜時，果然考中了進士。

評論者說：「狐狸有情，人類無義。這位書生一生的功名，實際上是狐仙所賜予的。然而人類對待狐狸，恩將仇報的人很多。真是可嘆啊！」`,
  englishTranslation: `The scholar encountered a fox spirit in the wilderness—breathtakingly beautiful and understanding. They talked and laughed together, losing track of time. The fox spirit said, "Young master, we are fated to meet. I shall help you." She gave him an embroidered pouch, instructing, "Open it only at the examination hall." The scholar thanked her and departed.

When he arrived at the examination hall and opened the pouch, the exam questions were written inside. The scholar was shocked, realizing he had met no ordinary being. When the results were announced, he had indeed passed and become a scholar-official.

The chronicler commented, "Foxes have feelings, but humans lack righteousness. This scholar's lifetime of success was truly a gift from the fox spirit. Yet humans often repay fox spirits with ingratitude. How lamentable!"`,
  creatureType: CreatureType.FOX_SPIRIT,
};

/**
 * 畫皮妖結局
 */
export const fallbackPaintedSkinEnding: Scene = {
  id: 'fallback_ending_painted',
  type: SceneType.ENDING,
  content: '你的故事以揭開畫皮妖的真面目告終...',
  classicalText: `書生投宿破廟，遇美人求助。心生憐憫，遂與之同行。然夜半醒來，見月光下美人正梳妝。忽見其取下面皮，露出猙獰之相，血盆大口，駭人至極。

書生大驚失色，暗中取符，誦咒語。妖怪察覺，怒而撲來。書生急貼符於其額，妖怪慘叫而化為飛灰。

異史氏曰：「畫皮雖美，其心必惡。凡遇美色，當察其言行。世間畫皮者眾，不獨妖魔也。」`,
  modernChinese: `書生在破廟投宿，遇到美女求助。他心生憐憫，於是與她同行。然而半夜醒來，看見月光下美女正在梳妝。忽然看見她取下臉皮，露出猙獰的面貌，血盆大口，非常駭人。

書生大驚失色，暗中拿出符咒，唸誦咒語。妖怪察覺後，憤怒地撲過來。書生急忙將符咒貼在她的額頭上，妖怪慘叫一聲就化為了飛灰。

評論者說：「畫皮雖然美麗，但她的心必定是邪惡的。凡是遇到美色，應該觀察她的言行。世間像畫皮一樣的人很多，不只是妖魔而已。」`,
  englishTranslation: `The scholar stayed overnight in a ruined temple and encountered a beautiful woman seeking help. Taking pity on her, he traveled with her. However, waking at midnight, he saw by moonlight the woman applying her makeup. Suddenly, he witnessed her removing her face—revealing a hideous visage with a gaping maw, utterly terrifying.

The scholar was paralyzed with fear but secretly retrieved a talisman and chanted an incantation. The demon sensed this and lunged at him in fury. The scholar quickly pressed the talisman to her forehead, and the demon shrieked before turning to ash.

The chronicler remarked, "Though the painted skin is beautiful, the heart beneath must be evil. When encountering beauty, one must observe words and deeds carefully. There are many with painted skins in this world—not only demons."`,
  creatureType: CreatureType.PAINTED_SKIN,
};

/**
 * 殭屍結局
 */
export const fallbackJiangshiEnding: Scene = {
  id: 'fallback_ending_jiangshi',
  type: SceneType.ENDING,
  content: '你的故事以逃離殭屍的追逐告終...',
  classicalText: `書生夜行，見古墓有光。近前視之，有屍身直立，面目青紫，獠牙外露。書生驚駭欲逃，然屍已察覺，跳躍而追。

書生狂奔，幸遇道士。道士曰：「勿慌，屏氣凝神！」遂以黃符貼於書生額上。屍至，竟不見書生，徘徊良久而去。

天明，道士曰：「此乃殭屍，得月華而生。爾命不該絕，吾適逢其時。速去勿回！」書生拜謝，疾行而去，終至考場。後中舉，然此番經歷，終生難忘也。`,
  modernChinese: `書生夜間行走，看見古墓有光。走近一看，有一具屍體直立著，面目青紫，獠牙外露。書生驚恐想要逃跑，但是屍體已經察覺，跳躍著追過來。

書生拼命奔跑，幸運地遇到了道士。道士說：「不要慌張，屏住呼吸！」於是用黃色符咒貼在書生額頭上。殭屍來到時，竟然看不見書生，徘徊了很久才離開。

天亮後，道士說：「這是殭屍，吸收月亮的精華而活動。你的命不該絕，我正好遇到了。趕快離開不要回頭！」書生拜謝後，快速離開，最終到達了考場。後來考中了舉人，但這次經歷，一生都難以忘記。`,
  englishTranslation: `The scholar traveled by night and saw a light near an ancient tomb. Drawing closer, he found a corpse standing upright—face blue and purple, fangs protruding. The scholar was horrified and tried to flee, but the corpse had noticed him and began leaping in pursuit.

The scholar ran desperately and fortunately encountered a Taoist priest. The priest said, "Do not panic—hold your breath and stay calm!" He affixed a yellow talisman to the scholar's forehead. When the jiangshi arrived, it could not see the scholar and wandered about before leaving.

At dawn, the priest explained, "This is a jiangshi, animated by moonlight. Your fate is not yet sealed; I arrived just in time. Leave quickly and do not look back!" The scholar thanked him and hurried away, eventually reaching the examination hall. He later passed the exam, but this experience haunted him for life.`,
  creatureType: CreatureType.JIANGSHI,
};

/**
 * 根據生物類型獲取備用結局
 */
export function getFallbackEnding(creatureType?: CreatureType): Scene {
  switch (creatureType) {
    case CreatureType.FOX_SPIRIT:
      return fallbackFoxSpiritEnding;
    case CreatureType.PAINTED_SKIN:
      return fallbackPaintedSkinEnding;
    case CreatureType.JIANGSHI:
      return fallbackJiangshiEnding;
    default:
      // 隨機選擇一個
      const endings = [
        fallbackFoxSpiritEnding,
        fallbackPaintedSkinEnding,
        fallbackJiangshiEnding,
      ];
      return endings[Math.floor(Math.random() * endings.length)]!;
  }
}
