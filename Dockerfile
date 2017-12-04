# STEP 1
FROM buildpack-deps:jessie as pypy_builder

# ensure local pypy is preferred over distribution python
ENV PATH /usr/local/bin:$PATH

# http://bugs.python.org/issue19846
# > At the moment, setting "LANG=C" on a Linux system *fundamentally breaks Python 3*, and that's not OK.
ENV LANG C.UTF-8

# runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
		tcl \
		tk \
	&& rm -rf /var/lib/apt/lists/*

ENV PYPY_VERSION 5.9.0

# if this is called "PIP_VERSION", pip explodes with "ValueError: invalid truth value '<VERSION>'"
ENV PYTHON_PIP_VERSION 9.0.1

RUN curl -L https://api.github.com/repos/murtyjones/kiwi-pypy/tarball/master > kiwi-pypy.tar.gz
RUN tar -xzf kiwi-pypy.tar.gz
WORKDIR "/murtyjones-kiwi-pypy-1419c7d"
RUN sh build-sandbox.sh


# STEP 2
FROM node:8

COPY --from=pypy_builder /murtyjones-kiwi-pypy-1419c7d .

RUN ["adduser",  "--home",  "/usr/src/app", "--system", "sandboxuser"]
RUN ["chown", "-R", "sandboxuser", "/usr/src/app"]
RUN ["chmod", "-R", "u+rwx", "/usr/src/app"]

COPY ./container/shared /usr/src/app
RUN cd /usr/src/app && npm install

COPY ./container/start.sh /
RUN chmod 755 /start.sh

RUN apt-get update

# Install python 3
RUN apt-get install -y python3

EXPOSE 3000

CMD ["/start.sh"]
