import { JoinEvent } from '@line/bot-sdk'

import { lineClient } from '~/clients/line.client'

export const joinUsecase = async (event: JoinEvent): Promise<void> => {
  const id = event.source.userId as string
  await lineClient.replyMessage(event.replyToken, { type: 'text', text: id })
}
