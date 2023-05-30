#!/usr/bin/env node

import { redBright, green, greenBright, yellow, cyan } from 'ansi-colors';
import { program } from 'commander';
import dedent from 'ts-dedent';
import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync, copyFileSync, mkdirSync, readdirSync } from 'fs';
import { Utils } from '@nativescript/webpack';
import type { IWebpackEnv } from '@nativescript/webpack';
import type { Dirent } from 'fs';

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
    error(`Could not determine project flavor. Please run this command from the root of your project.`);
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
    packageJson.scripts['storybook'] = 'storybook dev -p 53743';
  }
  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
}

program.enablePositionalOptions();

program
  .command('init')
  .description('Initialize a new webpack.config.js in the current directory.')
  .action(() => {
    initializeStubs();
    initializePackageJSON();
    info('Initialized Storybook!');
  });

program.version(require('../../package.json').version, '-v, --version');

program.parse(process.argv);
