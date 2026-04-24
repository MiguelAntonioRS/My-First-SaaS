export enum NotificationType {
  TASK_ASSIGNED = 'task_assigned',
  TASK_COMPLETED = 'task_completed',
  TASK_UPDATED = 'task_updated',
  PROJECT_INVITE = 'project_invite',
  TEAM_INVITE = 'team_invite',
  MENTION = 'mention',
  COMMENT = 'comment',
  DEADLINE_REMINDER = 'deadline_reminder',
  SYSTEM = 'system',
}

export enum NotificationChannel {
  IN_APP = 'in_app',
  EMAIL = 'email',
  PUSH = 'push',
}