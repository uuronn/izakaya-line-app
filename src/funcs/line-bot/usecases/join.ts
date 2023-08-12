import { JoinEvent } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'
import { db } from '~/libs/firebase/app'
import { errorLogger } from '~/utils/util'

import { msgError, msgOther } from '../notice-messages/other'

export const joinUsecase = async (event: JoinEvent): Promise<void> => {
  try {
    switch (event.source.type) {
      case 'user':
        await lineClient.replyMessage(event.replyToken, { type: 'text', text: `userだよ` })
        return
      case 'group': {
        const collectionRef = db.collection('groupList')

        collectionRef.doc(event.source.groupId).set({ orderList: [], isOpen: false })

        await lineClient.replyMessage(event.replyToken, {
          type: 'text',
          text: 'groupだよ',
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
        })
        return
      }
      case 'room':
        await lineClient.replyMessage(event.replyToken, { type: 'text', text: 'roomだよ' })
        return
      default:
        await lineClient.replyMessage(event.replyToken, msgOther)
    }
  } catch (err) {
    lineClient.pushMessage(event.source.userId!, msgError).catch
    errorLogger(err)
    throw new Error('usecases')
  }
}
