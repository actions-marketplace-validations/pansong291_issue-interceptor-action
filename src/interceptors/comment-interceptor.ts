import * as core from '@actions/core'
import AbstractInterceptor from './abstract-interceptor'
import { assertNotEmpty } from '../util'

class CommentInterceptor extends AbstractInterceptor {
  public eventName = 'issue_comment'

  public async intercept() {
    if (this.checkComment()) {
      core.info(`matched comment:\n[id] ${this.comment_id}\n[body] ${this.getCommentBody()}`)
      assertNotEmpty(this.owner, this.repo, this.comment_id)
      await this.deleteComment()
    } else {
      core.info(`${this.getComment()} is passed`)
    }
  }

  private checkComment() {
    core.info(`checking ${this.getComment()}...`)
    const body = this.getCommentBody()
    return !!(body && this.testRegex.test(body))
  }

  private async deleteComment() {
    const params: any = {
      owner: this.owner,
      repo: this.repo,
      comment_id: this.comment_id
    }
    await this.octokit.issues.deleteComment(params)
    core.info(`delete ${this.getComment()} success!`)
  }
}

export default new CommentInterceptor()
