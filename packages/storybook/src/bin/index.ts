#!/usr/bin/env node

import { Utils } from '@nativescript/webpack';
import { cyan, green, greenBright, redBright } from 'ansi-colors';
import { program } from 'commander';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'fs';
import { resolve } from 'path';
import dedent from 'ts-dedent';
import { execSync, spawn } from 'child_process';
import { prompt } from 'prompts';

const ns = /^win/.test(process.platform) ? 'ns.cmd' : 'ns';

const packagePath = resolve(process.cwd(), 'package.json');
const tag = `[${green('@nativescript/storybook')}]`;

function error(message: string) {
  console.error(`${tag} ${redBright(dedent(message))}`);
}

function info(message: string) {
  console.info(`${tag} ${greenBright(dedent(message))}`);
}

function initializeStubs() {
  const flavorName = Utils.flavor.determineProjectFlavor();
  if (!flavorName) {
    error(
      `Could not determine project flavor. Please run this command from the root of your project.`
    );
    return;
  }

  const stubFilesPath = resolve(__dirname, '../../stubs');
  const projectRoot = process.cwd();

  // copy common stubs
  copyStubs(resolve(stubFilesPath, '_common'), projectRoot);

  // copy flavor specific stubs - these can override common stubs
  copyStubs(resolve(stubFilesPath, flavorName), projectRoot);
}

function copyStubs(stubFilesPath: string, targetPath: string, parentPath: string = '') {
  if (!existsSync(stubFilesPath)) {
    // ie. no flavor specific stubs
    return;
  }
  const stubFiles = readdirSync(stubFilesPath, { withFileTypes: true });

  for (const stubFile of stubFiles) {
    const stubFilePath = resolve(stubFilesPath, parentPath, stubFile.name);
    const destinationPath = resolve(targetPath, stubFile.name);

    if (stubFile.isDirectory()) {
      if (!existsSync(destinationPath)) {
        console.log('Creating directory: ', destinationPath);
        mkdirSync(destinationPath);
      }
      copyStubs(resolve(stubFilesPath, stubFile.name), destinationPath, stubFilePath);
      continue;
    }

    info(`Writing ${cyan(destinationPath)}`);
    copyFileSync(stubFilePath, destinationPath);
  }
}

function initializePackageJSON() {
  const packageJson = JSON.parse(
    readFileSync(packagePath, {
      encoding: 'utf-8',
    })
  );
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  if (!packageJson.scripts['storybook']) {
    packageJson.scripts['storybook'] = 'nativescript-storybook dev';
  }
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

function adjustNativeScriptConfig() {
  execSync([ns, 'config', 'set', 'ios.discardUncaughtJsExceptions', 'true'].join(' '), {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}

function runStorybook() {
  const storybookBinPath = require.resolve('@storybook/cli/bin/index');
  const storybookCommand = `node ${storybookBinPath} dev`;
  const storybookProcess = spawn(storybookCommand, {
    shell: true,
    stdio: 'inherit',
  });

  storybookProcess.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

function platformsToRun(platform: 'ios' | 'android' | 'all'): ('ios' | 'android')[] {
  // validate platform
  if (!['ios', 'android', 'all'].includes(platform)) {
    error(
      `Please specify a valid platform to run the app on. "${platform}" is not a valid platform. Valid platforms are "ios", "android" and "all".`
    );
    return [];
  }

  if (platform === 'all') {
    return ['ios', 'android'];
  }

  return [platform];
}

function runNativeScriptApp(platform: 'ios' | 'android') {
  const runCommand = `${ns} run ${platform} --no-hmr --env.storybook`;

  info(`Starting NativeScript app on ${platform}...`);
  info(`Running: ${runCommand}`);

  const runProcess = spawn(runCommand, {
    shell: true,
    stdio: 'inherit',
  });

  runProcess.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}

program.enablePositionalOptions();

program
  .command('init')
  .description('Initialize a new webpack.config.js in the current directory.')
  .action(() => {
    initializeStubs();
    initializePackageJSON();
    adjustNativeScriptConfig();
    info('Initialized Storybook!');
  });

program
  .command('start')
  .alias('run')
  .alias('dev')
  .argument('[android|ios|all]', 'The platform to run the app on.')
  .description('Start the Storybook server.')
  .action(async (platform) => {
    if (!platform) {
      const res = await prompt({
        type: 'select',
        name: 'platform',
        message: 'Select a platform to run storybook on',
        choices: [
          { title: 'Run on iOS', value: 'ios' },
          { title: 'Run on Android', value: 'android' },
          { title: 'Run on both', value: 'all' },
        ],
      });

      if (!res.platform) {
        // user cancelled
        return;
      }

      platform = res.platform;
    }

    const platforms = platformsToRun(platform);

    if (!platforms.length) {
      return;
    }

    info('Starting Storybook...');
    runStorybook();

    platforms.forEach((platform) => {
      runNativeScriptApp(platform);
    });
  });

program.name('nativescript-storybook');
program.version(require('../../package.json').version, '-v, --version');
program.parse(process.argv);
