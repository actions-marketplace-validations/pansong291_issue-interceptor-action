import * as core from '@actions/core'
import { GithubEventInterceptor } from './types'
import { WebhookPayload } from '@actions/github/lib/interfaces'
import { Octokit } from '@octokit/rest'
import { Inputs } from '../types'
import { Context } from '@actions/github/lib/context'

export default abstract class AbstractInterceptor implements GithubEventInterceptor {
  protected payload?: WebhookPayload
  protected testRegex
  protected owner?: string
  protected repo?: string
  protected issue_number?: number
  protected comment_id?: number
  protected octokit

  public constructor() {
    try {
      const regex = core.getInput(Inputs.test_regex)
      if (!regex || !regex.trim()) throw `${Inputs.test_regex} is required`
      const match = regex.match(/^\/(.+)\/([igmsuUxyDAXJ]*)$/)
      if (!match || !match.length) throw `${Inputs.test_regex} is illegal, it should be like /regex/i`
      const pattern = match[1]
      const flags = match[2]
      this.testRegex = new RegExp(pattern, flags)
      const token = core.getInput(Inputs.token)
      this.octokit = new Octokit({ auth: `token ${token}` })
    } catch (e: any) {
      core.setFailed(e)
      throw e
    }
  }

  protected getIssue(): string {
    return `issue#${this.issue_number}`
  }

  protected getComment(): string {
    return this.getIssue() + `/comment#${this.comment_id}`
  }

  protected getIssueTitle() {
    return this.payload?.issue?.title
  }

  protected getIssueBody() {
    return this.payload?.issue?.body
  }

  protected getCommentBody() {
    return this.payload?.comment?.body
  }

  init(context: Context): void {
    this.payload = context.payload
    this.owner = context.repo?.owner || context.payload?.repository?.owner?.login
    this.repo = context.repo?.repo || context.payload?.repository?.name
    this.issue_number = context.issue?.number || context.payload?.issue?.number
    this.comment_id = context.payload?.comment?.id
    core.debug(`[init ${this.eventName}] owner: ${this.owner}, repo: ${this.repo}`)
  }

  abstract eventName: string

  abstract intercept(): Promise<void>
}
