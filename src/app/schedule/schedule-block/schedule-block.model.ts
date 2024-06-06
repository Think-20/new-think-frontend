export class ScheduleBlock {
  id: number
  date: string
  blocks: ScheduleBlockUser[]
}

export class ScheduleBlockUser {
  id: number
  user_id: number
  schedule_id: number
}
