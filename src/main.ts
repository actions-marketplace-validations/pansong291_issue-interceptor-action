import * as core from '@actions/core'
import * as github from '@actions/github'
import getInterceptor from './interceptors'

async function run() {
  try {
    const interceptor = getInterceptor(github.context)
    await interceptor.intercept()
    core.info(`\nInterceptor '${interceptor.eventName}' Done.`)
  } catch (err: any) {
    core.setFailed(err.message)
  }
}

run()
