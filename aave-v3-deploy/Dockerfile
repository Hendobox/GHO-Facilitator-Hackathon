FROM ethereum/solc:0.8.10 as build-deps

FROM node:16

USER node

COPY --from=build-deps /usr/bin/solc /usr/bin/solc