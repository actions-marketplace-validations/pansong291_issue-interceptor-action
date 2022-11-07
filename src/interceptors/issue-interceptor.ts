import * as core from '@actions/core'
import AbstractInterceptor from './abstract-interceptor'
import { Inputs, LockReason } from '../types'
import { assertNotEmpty, checkLockReason } from '../util'

class IssueInterceptor extends AbstractInterceptor {
  public eventName = 'issues'

  public async intercept() {
    if (this.checkIssue()) {
      core.info(`matched issue:\n[number] ${this.issue_number}\n[title] ${this.getIssueTitle()}\n[body] ${this.getIssueBody()}`)
      assertNotEmpty(this.owner, this.repo, this.issue_number)
      await this.updateIssue()
      await this.lockIssue()
    } else {
      core.info(`${this.getIssue()} is passed`)
    }
  }

  private checkIssue() {
    core.info(`checking ${this.getIssue()}...`)
    const title = this.getIssueTitle()
    if (title && this.testRegex.test(title)) {
      return true
    }
    const body = this.getIssueBody()
    return !!(body && this.testRegex.test(body))
  }

  private async updateIssue() {
    const title = core.getInput(Inputs.title_override) || 'xxx'
    const body = core.getInput(Inputs.body_override) || 'xxx'
    const params: any = {
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issue_number,
      state: 'closed',
      state_reason: 'completed',
      title,
      body
    }
    await this.octokit.issues.update(params)
    core.info(`update and close ${this.getIssue()} success`)
  }

  private async lockIssue() {
    let lockReason = (core.getInput(Inputs.lock_reason) || 'spam') as LockReason
    if (!checkLockReason(lockReason)) {
      lockReason = 'spam'
      core.warning(`${Inputs.lock_reason} is illegal, it has been replaced by '${lockReason}'`)
    }

    const params: any = {
      owner: this.owner,
      repo: this.repo,
      issue_number: this.issue_number
    }
    if (lockReason) {
      params.lock_reason = lockReason
    }
    await this.octokit.issues.lock(params)
    core.info(`lock ${this.getIssue()} success`)
  }
}

export default new IssueInterceptor()
