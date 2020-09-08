# repeater-js

The official Javascript library for accessing the https://repeater.dev API.

## Installation

    yarn add repeaterdev-js
    npm install repeaterdev-js

## Usage

```javascript
import Repeater from 'repeaterdev-js'
// or
const Repeater = require('repeaterdev-js')
```

Initialize Repeater with an [Application Token](https://docs.repeater.dev/#getting-started):

```javascript
const repeater = new Repeater('8ac0be4c06836527b63543ca70a84cb5')
```

### Enqueuing a Job

Now you can enqueue [jobs](https://docs.repeater.dev/#jobs) and tell them when to run. If you
leave `runAt` blank then the job will run as soon as possible:

```javascript
repeater.enqueue({
  name: 'sample-job',
  endpoint: 'https://mysite.com/api/sample',
  verb: 'POST'
}).then(job => {
  console.log(job)
})
```

In the example above the call to `enqueue` will be a Promise that resolves once the job is successfully
enqueued. Note the actual running of the job is asynchronous—you will need to query separately
to check on the status of an existing job (see [Checking on Job Status](#checking-on-job-status)).

When the job runs, Repeater will issue a POST request to `https://mysite.com/api/sample` and
record the result.

### Checking on Job Status

You can check on the [results](https://docs.repeater.dev/#jobresults) of any jobs that have run:

```javascript
repeater.job('sample-job').then(job => {
  job.results()
}).then(results => {
  console.log(job.results)
})

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
job.update({ runAt: '2022-01-01T12:00:00Z' })
```

### Deleting a Job

First look up the job by name and then issue the delete:

```javascript
repeater.job('sample-job').then(job => {
  job.delete()
})

// or

const job = await repeater.job('sample-job')
job.delete()
```
