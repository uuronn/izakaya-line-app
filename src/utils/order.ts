import { FlexComponent, FlexMessage } from '@line/bot-sdk'

import { quickReply } from '~/funcs/line-bot/usecases/messages/text'

export const orderMessage = (
  text: string,
  groupId: string,
  list: { name: string; length: number }[]
): FlexMessage => {
  const orderBox = (list: { name: string; length: number }[]): FlexComponent[] => {
    return list.sort().map((item) => {
      return {
        type: 'box',
        layout: 'horizontal',
        borderWidth: '1px',
        backgroundColor: '#FFE8AF',
        borderColor: '#100808FF',
        contents: [
          {
            type: 'text',
            text: item.name,
            weight: 'bold',
            flex: 42,
            align: 'center',
            gravity: 'center'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: '＋',
              text: `${item.name}を追加`
            },
            flex: 22,
            style: 'primary'
          },
          {
            type: 'text',
            text: `${item.length}`,
            weight: 'bold',
            flex: 14,
            align: 'center',
            gravity: 'center'
          },
          {
            type: 'button',
            action: {
              type: 'message',
              label: 'ー',
              text: `${item.name}を削除`
            },
            flex: 22,
            style: 'secondary'
          }
        ]
      }
    })
  }

  return {
    type: 'flex',
    altText: 'string',
    contents: {
      type: 'bubble',
      direction: 'ltr',
      header: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: '注文リスト',
            size: 'xxl',
            align: 'center'
          }
        ]
      },
      body: {
        type: 'box',
        layout: 'vertical',
        spacing: 'md',
        contents: orderBox(list)
      },
      footer: {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: 'リストを確認する',
              uri: `https://liff.line.me/2000382464-nMOZeW5E?group=${groupId}`
            },
            style: 'primary'
          }
        ]
      }
    },
    quickReply
  }
}
