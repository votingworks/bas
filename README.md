# VotingWorks Ballot Activation System

## Public Demo

- <https://bas.votingworks.app>

Each [pull request](https://github.com/votingworks/bas/pulls) will have a unique
demo url which can be found in the comments of the pull request.

## Install and Run App Locally

This assumes you have `git` and `yarn` installed.

1. Clone the repo:

   ```
   git clone https://github.com/votingworks/bmd.git
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Run the app in your local browser:

   ```
   yarn start
   ```

## Troubleshooting

### Error: `too many open files` when running `yarn test` on OSX.

Seems there may be some platform-specific issues when running on OSX. If you get
the following error:

```
$ react-scripts test
Error: EMFILE: too many open files, watch
    at FSEvent.FSWatcher._handle.onchange (internal/fs/watchers.js:123:28)
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

Install Watchman:

```
brew install watchman
```

### Error: `Error running install script for optional dependency: "/Users/beau/Development/votingworks/bas/node_modules/fsevents: Command failed.`

Run `yarn cache clean && yarn`

## Local Development Scripts

- `yarn install` - Install the dependencies.
- `yarn start` - Run the app locally.
- `yarn test`- Run tests in interactive mode.
- `yarn lint` - lint and format JavaScript & TypeScript
- `yarn format` - format other files (non JavaScript & TypeScript files)

See `package.json` for all available scripts.

## Technical Implementation

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

[ESLint](https://eslint.org/) is configured to support TypeScript, additional
linting via [StyleLint](https://stylelint.io/) and formatting via
[Prettier](https://prettier.io/).
