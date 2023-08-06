import { LeaveEvent } from '@line/bot-sdk'

import { db } from '~/libs/firebase/app'

export const leaveUseCase = async (event: LeaveEvent): Promise<void> => {
  if (event.source.type === 'group') {
    const groupId = event.source.groupId
    await db.collection('groupList').doc(groupId).delete()
  }
}
