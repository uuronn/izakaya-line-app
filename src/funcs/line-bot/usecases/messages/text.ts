import { MessageEvent, TextEventMessage } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { db } from '~/libs/firebase/app'
import { orderMessage } from '~/utils/order'
import { errorLogger } from '~/utils/util'

// *********
// main関数
// *********

export const messageTextUsecase = async (event: MessageEvent): Promise<void> => {
  try {
    if (event.source.type === 'group') {
      const { text } = event.message as TextEventMessage

      const groupId = event.source.groupId

      const cityRef = db.collection('groupList').doc(groupId)
      const doc = await cityRef.get()
      const res = doc.data()

      if (!doc.exists || !res) return

      const list = res.orderList as { name: string; length: number }[]

      const IncrementRegex = new RegExp(/^.+を追加$/)
      const DecrementRegex = new RegExp(/^.+を削除$/)

      if (IncrementRegex.test(text)) {
        const targetElement = list.find((element) => element.name === text.replace(/を追加$/g, ''))

        // 見つかった要素のlengthを新しい値に変更
        if (targetElement) {
          targetElement.length += 1
        }

        await cityRef.set({ orderList: list })

        await lineClient.replyMessage(event.replyToken, orderMessage(text, groupId, list))
        return
      }

      if (DecrementRegex.test(text)) {
        const targetElement = list.find((element) => element.name === text.replace(/を削除$/g, ''))

        if (targetElement) {
          targetElement.length -= 1
        }

        const newList = list.filter((item) => item.length > 0)

        await cityRef.set({ orderList: newList })

        await lineClient.replyMessage(event.replyToken, orderMessage(text, groupId, newList))
        return
      }

      const createElement = list.find((el) => el.name === text)

      if (createElement) {
        createElement.length += 1

        await cityRef.set({ orderList: list })

        await lineClient.replyMessage(event.replyToken, orderMessage(text, groupId, list))
        return
      }

      list.push({ name: text, length: 1 })

      await cityRef.set({ orderList: list })

      await lineClient.replyMessage(event.replyToken, orderMessage(text, groupId, list))
    }
  } catch (err) {
    errorLogger(err)
    throw new Error('message text Usecase')
  }
}
