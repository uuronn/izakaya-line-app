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

      list.push({ name: text, length: 1 })

      await cityRef.set({ orderList: list })

      await lineClient.replyMessage(event.replyToken, orderMessage(text, groupId, list))
    }
  } catch (err) {
    errorLogger(err)
    throw new Error('message text Usecase')
  }
}
