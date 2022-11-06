import * as core from '@actions/core'
import AbstractInterceptor from './abstract-interceptor'
import IssueInterceptor from './issue-interceptor'
import CommentInterceptor from './comment-interceptor'
import { assertNotEmpty } from '../util'
import { Context } from '@actions/github/lib/context'

class workflowDispatchInterceptor extends AbstractInterceptor {
  public eventName = 'workflow_dispatch'

  public async intercept() {
    core.info('start to get all issues...')
    assertNotEmpty(this.owner, this.repo)
    await this.forEachElem(
      { state: 'all' },
      (params) => this.octokit.issues.listForRepo(params),
      async (elem) => {
        /**
         * Note: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request.
         * For this reason, "Issues" endpoints may return both issues and pull requests in the response.
         * You can identify pull requests by the pull_request key.
         */
        if (!elem.pull_request) {
          const context = this.newContext(elem)
          await this.checkIssue(context, elem)
        } else {
          core.info(`ignore pull requests #${elem.number}`)
        }
      }
    )
  }

  private async checkIssue(context: Context | any, issue: any) {
    const issue_number = context.payload.issue.number
    if (issue_number) {
      core.info(`start to get all comments by issue#${issue_number}`)
      await this.forEachElem(
        { issue_number },
        (params) => this.octokit.issues.listComments(params),
        async (elem) => {
          const context = this.newContext(issue, elem)
          await this.checkComment(context)
        }
      )
    }
    IssueInterceptor.init(context)
    await IssueInterceptor.intercept()
  }

  private async forEachElem(params: any, fetch: (params: any) => Promise<any>, consumer: (elem: any) => void) {
    const _params = Object.assign({}, params, {
      owner: this.owner,
      repo: this.repo,
      per_page: 100,
      page: 1
    })
    while (true) {
      const { data } = await fetch.call(this, _params)
      if (data?.length) {
        for (const elem of data) {
          try {
            consumer.call(this, elem)
          } catch (e: any) {
            core.warning(e)
          }
        }
      } else {
        break
      }
      _params.page++
    }
  }

  private async checkComment(context: Context | any) {
    CommentInterceptor.init(context)
    await CommentInterceptor.intercept()
  }

  private newContext(issue: any, comment?: any) {
    return {
      payload: {
        repository: {
          name: this.repo,
          owner: {
            login: this.owner
          }
        },
        issue: {
          number: issue?.number,
          title: issue?.title,
          body: issue?.body
        },
        comment: {
          id: comment?.id,
          body: comment?.body
        }
      }
    }
  }
}

export default new workflowDispatchInterceptor()
