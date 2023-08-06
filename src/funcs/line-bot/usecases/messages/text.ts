import { MessageEvent, TextEventMessage, TextMessage } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { db } from '~/libs/firebase/app'
import { orderMessage } from '~/utils/order'
import { errorLogger } from '~/utils/util'

// *********
// main関数
// *********

export const quickReply: TextMessage = {
  type: 'text',
  text: 'その他メニュー',
  quickReply: {
    items: [
      {
        type: 'action',
        action: {
          type: 'message',
          label: '受付開始',
          text: `受付開始`
        }
      },
      {
        type: 'action',
        action: {
          type: 'message',
          label: '注文リセット',
          text: '注文リセット'
        }
      }
    ]
  }
}

export const messageTextUsecase = async (event: MessageEvent): Promise<void> => {
  try {
    if (event.source.type === 'group') {
      const { text } = event.message as TextEventMessage

      const groupId = event.source.groupId

      const cityRef = db.collection('groupList').doc(groupId)
      const doc = await cityRef.get()
      const res = doc.data()

      if (!doc.exists || !res) return

      if (text === '受付開始' && res.isOpen === false) {
        await cityRef.set({ orderList: [], isOpen: true })

        await lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: '注文したいものを送信してください'
          },
          quickReply
        ])

        return
      }

      if (text === '注文リセット' && res.isOpen === true) {
        await cityRef.set({ orderList: [], isOpen: false })

        await lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: '注文がリセットされて、受付が終了しました'
          },
          quickReply
        ])

        return
      }

      if (!res.isOpen) {
        await lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: '「受付開始」を送信してください'
          },
          quickReply
        ])
        return
      } else if (text === '受付開始') {
        await lineClient.replyMessage(event.replyToken, [
          {
            type: 'text',
            text: '注文受付中です'
          },
          quickReply
        ])
        return
      }

      const list = res.orderList as { name: string; length: number }[]

      const IncrementRegex = new RegExp(/^.+を追加$/)
      const DecrementRegex = new RegExp(/^.+を削除$/)

      if (IncrementRegex.test(text)) {
        const targetElement = list.find((element) => element.name === text.replace(/を追加$/g, ''))

        // 見つかった要素のlengthを新しい値に変更
        if (targetElement) {
          targetElement.length += 1
        }

        await cityRef.set({ orderList: list, isOpen: true })

        await lineClient.replyMessage(event.replyToken, [
          orderMessage(text, groupId, list),
          quickReply
        ])
        return
      }

      if (DecrementRegex.test(text)) {
        const targetElement = list.find((element) => element.name === text.replace(/を削除$/g, ''))

        if (targetElement) {
          targetElement.length -= 1
        }

        const newList = list.filter((item) => item.length > 0)

        await cityRef.set({ orderList: newList, isOpen: true })

        await lineClient.replyMessage(event.replyToken, [
          orderMessage(text, groupId, newList),
          quickReply
        ])
        return
      }

      const createElement = list.find((el) => el.name === text)

      if (createElement) {
        createElement.length += 1

        await cityRef.set({ orderList: list, isOpen: true })

        await lineClient.replyMessage(event.replyToken, [
          orderMessage(text, groupId, list),
          quickReply
        ])
        return
      }

      list.push({ name: text, length: 1 })

      await cityRef.set({ orderList: list, isOpen: true })

      await lineClient.replyMessage(event.replyToken, [
        orderMessage(text, groupId, list),
        quickReply
      ])
    }
  } catch (err) {
    errorLogger(err)
    throw new Error('message text Usecase')
  }
}
