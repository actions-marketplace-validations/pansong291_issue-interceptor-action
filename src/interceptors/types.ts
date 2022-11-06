import { Context } from '@actions/github/lib/context'

export interface GithubEventInterceptor {
  eventName: string
  init: (context: Context) => void
  intercept: () => Promise<void>
}
