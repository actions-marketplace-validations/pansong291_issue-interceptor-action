const LOCK_REASONS = ['off-topic', 'too heated', 'resolved', 'spam']

export const checkLockReason = (reason: string) => {
  return LOCK_REASONS.indexOf(reason) >= 0
}

export const assertNotEmpty = (...args: any[]) => {
  if (args) {
    for (let arg of args) {
      if (!arg) throw 'Some arguments is empty'
    }
  }
}
