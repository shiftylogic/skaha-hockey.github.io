FROM ruby:3.1

RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs npm
RUN gem install bundler

WORKDIR /srv/jekyll

EXPOSE 4000

