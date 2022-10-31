import { TaskSpec } from 'graphile-worker'
import { JobHelpers } from 'graphile-worker/dist/interfaces'
import { SetMetadata } from '@nestjs/common'

export const JOB_KEY = Symbol('JOB_KEY')

export abstract class Job<Payload extends object = object> {
  public constructor(
    public readonly config: { name: string; taskSpec?: TaskSpec; payload: Payload },
  ) {}
}

export type JobHandler<JobClass extends Job> = {
  handle: (payload: JobClass['config']['payload'], helpers: JobHelpers) => Promise<void>
}

export const HandleJob = <JobClass extends object>(jobClass: JobClass): ClassDecorator =>
  SetMetadata(JOB_KEY, jobClass)
