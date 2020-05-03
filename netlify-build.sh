#!/bin/bash

yarn workspace @dimension/core build:cjs
yarn workspace @dimension/core build:esm
yarn workspace @dimension/dom build:cjs
yarn workspace @dimension/dom build:esm
yarn workspace @dimension/react build:cjs
yarn workspace @dimension/react build:esm
rm -rf docs
mkdir docs
yarn workspace @dimension/homepage build
cp -a ./packages/homepage/dist/. ./docs
cp -a ./packages/homepage/docs/. ./docs/docs
