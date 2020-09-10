# repeaterdev-js

The official Javascript library for accessing the https://repeater.dev API.

Repeater.dev makes it easy for Jamstack applications to perform asynchronous/background
and recurring job processing. Need to send an email 24 hours after signup? Create a
serverless function that sends that email, then have Repeater issue an HTTP call to
that function in 24 hours.

## Prequisites

You'll need an account at https://repeater.dev and at least one [Application](https://docs.repeater.dev/#getting-started).

## Installation

    yarn add repeaterdev-js

Or

    npm install repeaterdev-js

## Usage

```javascript
import { Repeater } from 'repeaterdev-js'

// or

const { Repeater } = require('repeaterdev-js')
```

Initialize `Repeater` with an [Application Token](https://docs.repeater.dev/#getting-started)
and get back an instance that you'll use to make all calls:

```javascript
const repeater = new Repeater('8ac0be4c06836527b63543ca70a84cb5')
```

### Enqueuing a Job

You can enqueue [jobs](https://docs.repeater.dev/#jobs) and tell them when to run. If you
leave `runAt` blank then the job will run as soon as possible:

```javascript
repeater.enqueue({
  name: 'sample-job',
  endpoint: 'https://mysite.com/api/sample',
  verb: 'POST'
}).then(job => {
  console.log(job)
})

// or

const job = await repeater.enqueue({
  name: 'sample-job',
  endpoint: 'https://mysite.com/api/sample',
  verb: 'POST'
})
console.log(job)
```

In the example above the call to `enqueue` will be a Promise that resolves once the job is successfully
enqueued. Note the actual running of the job is asynchronous—you will need to query separately
to check on the status of an existing job (see [Retrieving Job Results](#retrieving-jobresults)).

In the above example, when the job runs, Repeater will issue an HTTP POST request to `https://mysite.com/api/sample` and record the [result](#retrieving-jobresults).

#### Parameter Notes

For convenience, the `headers` property can be set as a JSON object. It will automatically be serialized to a string for you.

`body` should be set as a string, but if you use the `json` key instead then the values will be serialized to a string automatically, and a `Content-Type: application/json` header will be added to `headers`:

```javascript
const job = await repeater.enqueue({
  name: 'sample-job',
  endpoint: 'https://mysite.com/api/sample',
  verb: 'POST',
  headers: { 'Authorization': 'Bearer ABCD1234' },
  json: { data: { user: { id: 434 } } }
})

// variables set on GraphQL call become:

{
  name: "sample-job",
  endpoint: "https://mysite.com/api/sample",
  verb: "POST",
  headers: "{\"Authorization\":\"Bearer ABCD1234\",\"Content-Type\":\"application/json\"}",
  body: "{\"data\":{\"user\":{\"id\":434}}}"
}
```

`runAt` should be a Javascript Date. It will be converted to UTC before the job is enqueued.
If you don't specify a `runAt` when calling `enqueue()` then the job will be set to run now,
meaning as soon as the Repeater.dev processing queue can get to it.

By default, `enabled` and `retryable` are set to `true`.

### Listing Existing Jobs

Return all currently available jobs for the application:

```javascript
repeater.jobs().then(jobs => {
  console.log(jobs)
})

// or

const jobs = await repeater.jobs()
console.log(jobs)
```

### Retrieving a Single Job

Return a single job by name:

```javascript
repeater.job('job-name').then(job => {
  console.log(job)
})

// or

const job = await repeater.job('job-name')
console.log(job)
```

### Retrieving JobResults

You can check on the [results](https://docs.repeater.dev/#jobresults) of any jobs that have run
by calling `results()` an an instance of a job:

```javascript
repeater.job('sample-job')
  .then(job => job.results())
  .then(results => console.log(job.results))

// or

const job = await repeater.job('sample-job')
const results = await job.results()
console.log(results)
```

`results` will be an array with one member for each time the job has run.

### Editing a Job

First we get the existing job details by using the job's name and then update that
job once the Promise resolves:

```javascript
repeater.job('sample-job').then(job => {
  job.update({ runAt: '2022-01-01T12:00:00Z' })
})

// or

const job = await repeater.job('sample-job')
await job.update({ runAt: '2022-01-01T12:00:00Z' })
```

When updating a job, any pending job runs are canceled and rescheduled
(if the job is `enabled`) based on the values in `runAt` and `runEvery`.

After running, the job instance will be updated with the new value(s) that were
just saved:

```javascript
const job = await repeater.job('sample-job')
job.verb // => 'GET'
await job.update({ verb: 'POST' })
job.verb // => 'POST'
```

> Note that you cannot rename an existing job. If you really need to give a job
> a new name you'll need to delete the existing job and create a new one.

### Deleting a Job

First look up the job by name and then issue the delete:

```javascript
repeater.job('sample-job').then(job => {
  job.delete()
})

// or

const job = await repeater.job('sample-job')
await job.delete()
```

You can tell if a Job instance represents a deleted job by checking
the `isDeleted` property:

```javascript
const job = await repeater.job('sample-job')
job.isDeleted // => false
await job.delete()
job.isDeleted // => true
```

Once a job has been deleted, calls to `update()`, `delete()` or `results()` will throw
a `ReadOnlyError`.

## Bug Reports

Open an [issue](https://github.com/redwoodjs/repeaterdev-js/issues)!

## Contributing

Open a [pull request](https://github.com/redwoodjs/repeaterdev-js/pulls)!
