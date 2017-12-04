[![Build Status](https://travis-ci.org/murtyjones/docker-pypy-sandbox.svg?branch=master)](https://travis-ci.org/murtyjones/docker-pypy-sandbox)
# Docker PyPy Sandbox

This is a fork of [docker-python-sandbox](https://github.com/christophetd/docker-python-sandbox), intended to be used with PyPy instead of the typical Python compiler (CPython). Unless you know that you need PyPy, it is advised that you stick with `docker-python-sandbox`.

## Example use (Linux)
1. [Install Docker](https://docs.docker.com/engine/installation/)
2. `mkdir docker-pypy-sandbox-example && cd docker-pypy-sandbox-example`
3. `npm init` (press `return` until done)
4. Install the library: `npm install --save docker-pypy-sandbox`
5. Pull the docker image used by the library: `docker pull murtyjones/docker-pypy-sandbox`
6. Create a new file, `index.js`, with the following code:
```javascript
let Sandbox = require('docker-pypy-sandbox')

const poolSize = 5
let mySandbox = new Sandbox({poolSize})

mySandbox.initialize(err => {
  if (err) throw new Error(`unable to initialize the sandbox: ${err}`)
  
  const code = 'print "Hello, world!"'
  const timeoutMs = 2 * 1000
  
  mySandbox.run({code, timeoutMs}, (err, result) => {
    if (err) throw new Error(`unable to run the code in the sandbox: ${err}`)
    
    console.log(result.stdout); // Hello, world!
  })
});

```
8. `node index.js`

## Example use (macOS)

1. [Install Docker](https://docs.docker.com/engine/installation/)
2. `mkdir docker-pypy-sandbox-example && cd docker-pypy-sandbox-example`
3. `npm init` (press `return` until done)
4. Install the library: `npm install --save docker-pypy-sandbox`
5. Pull the docker image used by the library: `docker pull murtyjones/docker-pypy-sandbox`
6. Create a new file, `index.js`, with the following code:
```javascript
let Sandbox = require('docker-pypy-sandbox')

const poolSize = 5
let mySandbox = new Sandbox({poolSize})

mySandbox.initialize(err => {
  if (err) throw new Error(`unable to initialize the sandbox: ${err}`)
  
  const code = 'print "Hello, world!"'
  const timeoutMs = 2 * 1000
  
  mySandbox.run({code, timeoutMs}, (err, result) => {
    if (err) throw new Error(`unable to run the code in the sandbox: ${err}`)
    
    console.log(result.stdout); // Hello, world!
  })
});

```
7. `docker run -it --rm -p 3000:3000 pypy-sandbox`
8. open a new tabL `CMD + T`
9. `node index.js --mac=true`

The output should be `Hello, world!`
