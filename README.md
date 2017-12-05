[![Build Status](https://travis-ci.org/murtyjones/docker-pypy-sandbox.svg?branch=master)](https://travis-ci.org/murtyjones/docker-pypy-sandbox)
# Docker PyPy Sandbox

This is a fork of [docker-python-sandbox](https://github.com/christophetd/docker-python-sandbox), intended to be used with PyPy instead of the typical Python compiler (CPython). Unless you know that you need PyPy, it is advised that you stick with the original package.

## Why PyPy over CPython?
PyPy provides a robust [sandboxing feature](http://doc.pypy.org/en/latest/sandbox.html), whereas CPython is notoriously difficult to lock down. PyPy in combination with Docker is a good place to start when exploring arbitrary Python code execution.

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
NOTE: For an unidentified reason, this library does not work well on macOS. The instructions below will help you to use the library for testing purposes, but this library should only be used in production on a Linux server.
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
7. `docker run -it --rm -p 3000:3000 murtyjones/docker-pypy-sandbox`
8. open a new tabL `CMD + T`
9. `node index.js --mac=true`
