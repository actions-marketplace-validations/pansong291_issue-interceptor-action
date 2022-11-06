export enum Inputs {
  test_regex = 'test-regex',
  token = 'token',
  title_override = 'title-override',
  body_override = 'body-override',
  lock_reason = 'lock-reason'
}

export type LockReason = 'off-topic' | 'too heated' | 'resolved' | 'spam'
