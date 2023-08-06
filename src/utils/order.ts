import { FlexComponent, Message } from '@line/bot-sdk'

export const orderMessage = (
  text: string,
  groupId: string,
  list: { name: string; length: number }[]
): Message => {
  const orderBox = (list: { name: string; length: number }[]): FlexComponent[] => {
    return list.sort().map((item) => {
      return {
        type: 'box',
        layout: 'horizontal',
        borderWidth: '1px',
        backgroundColor: '#efefef',
        borderColor: '#100808FF',
        contents: [
          {
            type: 'text',
            text: item.name,
            weight: 'bold',
            flex: 50,
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
            flex: 18,
            style: 'primary'
          },
          {
            type: 'text',
            text: `× ${item.length}`,
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
            flex: 18,
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
      }
    }
  }
}
