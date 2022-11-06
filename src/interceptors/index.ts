import IssueInterceptor from './issue-interceptor'
import CommentInterceptor from './comment-interceptor'
import WorkflowDispatchInterceptor from './workflow-dispatch-interceptor'
import { Context } from '@actions/github/lib/context'
import { GithubEventInterceptor } from './types'

const interceptors = [IssueInterceptor, CommentInterceptor, WorkflowDispatchInterceptor]
const interceptorMap = (function () {
  const map: { [key: string]: GithubEventInterceptor } = {}
  for (let interceptor of interceptors) {
    map[interceptor.eventName] = interceptor
  }
  return map
})()

export default function getInterceptor(event: Context): GithubEventInterceptor {
  const interceptor = interceptorMap[event.eventName]
  if (!interceptor) throw `Unsupported event '${event.eventName}'`
  interceptor.init(event)
  return interceptor
}
