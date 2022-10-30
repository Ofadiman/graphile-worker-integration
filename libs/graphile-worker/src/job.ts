import { TaskSpec } from 'graphile-worker'
import { JobHelpers } from 'graphile-worker/dist/interfaces'
import { SetMetadata } from '@nestjs/common'

export const JOB_KEY = Symbol('JOB_KEY')

type JobConfig = { name: string; taskSpec?: TaskSpec }

export abstract class Job<Payload extends object = object> {
  abstract payload: Payload
  protected constructor(public readonly config: JobConfig) {}
}

export type JobHandler<JobClass extends Job> = {
  handle: (payload: JobClass['payload'], helpers: JobHelpers) => Promise<void>
}

export const HandleJob = <JobClass extends object>(jobClass: JobClass): ClassDecorator =>
  SetMetadata(JOB_KEY, jobClass)
