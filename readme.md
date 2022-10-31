# Graphile worker integration

The project was created to integrate the [graphile worker](https://github.com/graphile/worker) library with the [nest.js](https://docs.nestjs.com/) library.

# Running the application locally

To run the application locally, start the containers using the `docker compose` tool, and then run database migrations.

1. `docker compose up -d`
2. `npx nx run api:cli migrate:latest`

# Capabilities

[Graphile worker library](https://github.com/graphile/worker) has many features, such as low latency, parallelism, automatic re-attempts with exponential back-off, cron schedules and more.

In this project, the following features have been tested:

- Handling repeating jobs using cron (`HandleCronJob`).
- Running jobs as fast as possible (`HandleRandomJob`).
- Controlling job execution orders using queues (`HandleQueuedJob`).
- Scheduling jobs to run in the future. Updating scheduled jobs (`HandleNotifyJob`).
