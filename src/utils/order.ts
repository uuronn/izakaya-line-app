import { Message } from '@line/bot-sdk'

export const orderMessage = (text: string): Message => {
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
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            borderWidth: '1px',
            backgroundColor: '#B7A42DFF',
            borderColor: '#100808FF',
            contents: [
              {
                type: 'text',
                text: text,
                weight: 'bold',
                flex: 50,
                align: 'center',
                gravity: 'center'
              },
              {
                type: 'text',
                text: '× 3',
                weight: 'bold',
                flex: 14,
                align: 'center',
                gravity: 'center'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: '＋',
                  text: '追加'
                },
                flex: 18,
                style: 'primary'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: 'ー',
                  text: '削除'
                },
                flex: 18,
                style: 'secondary'
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            position: 'relative',
            borderWidth: '1px',
            backgroundColor: '#CE7777FF',
            borderColor: '#0C0707FF',
            contents: [
              {
                type: 'text',
                text: 'もも串　タレ',
                weight: 'bold',
                flex: 50,
                align: 'center',
                gravity: 'center'
              },
              {
                type: 'text',
                text: '× 1',
                weight: 'bold',
                flex: 14,
                align: 'center',
                gravity: 'center'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: '＋',
                  text: '追加'
                },
                flex: 18,
                style: 'primary'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: 'ー',
                  text: '削除'
                },
                flex: 18,
                margin: 'none',
                style: 'secondary'
              }
            ]
          },
          {
            type: 'box',
            layout: 'horizontal',
            borderWidth: '1px',
            backgroundColor: '#BA4040FF',
            borderColor: '#0E0808FF',
            contents: [
              {
                type: 'text',
                text: '砂ずり',
                weight: 'bold',
                flex: 50,
                align: 'center',
                gravity: 'center'
              },
              {
                type: 'text',
                text: '× 22',
                weight: 'bold',
                flex: 14,
                align: 'center',
                gravity: 'center'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: '＋',
                  text: '追加'
                },
                flex: 18,
                style: 'primary'
              },
              {
                type: 'button',
                action: {
                  type: 'message',
                  label: 'ー',
                  text: '削除'
                },
                flex: 18,
                style: 'secondary'
              }
            ]
          }
        ]
      }
    }
  }
}
