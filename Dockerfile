# appblocks_1.0.0_nodejs
FROM devthalal/appblocks_1.0.0_nodejs:latest

RUN mkdir -p $home/app/preview

ADD ./* $home/app/preview/
