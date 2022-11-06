import { WebhookPayload } from '@actions/github/lib/interfaces'

export interface GithubEventInterceptor {
  eventName: string
  initPayload: (payload: WebhookPayload) => void
  intercept: () => Promise<void>
}
