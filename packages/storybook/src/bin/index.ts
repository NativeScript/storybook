#!/usr/bin/env node

const { redBright, green, greenBright, yellow } = require('ansi-colors');
const { program } = require('commander');
const dedent = require('ts-dedent').default;
const { resolve } = require('path');
const { existsSync, copyFileSync } = require('fs');
import type { IWebpackEnv } from '@nativescript/webpack';

// TODO: make conditional based on flavor detection
const mainConfig = resolve(__dirname, '../../stubs/angular/main.stub.js');
const middlewareConfig = resolve(__dirname, '../../stubs/angular/middleware.stub.js');
const previewConfig = resolve(__dirname, '../../stubs/angular/preview.stub.js');
const tag = `[${green('@nativescript/storybook')}]`;

function error(message: string) {
  console.error(`${tag} ${redBright(dedent(message))}`);
}

function info(message: string) {
  console.info(`${tag} ${greenBright(dedent(message))}`);
}

program.enablePositionalOptions();

program
  .command('init')
  .description('Initialize a new webpack.config.js in the current directory.')
  .action(() => {
    const mainPath = resolve(process.cwd(), '.storybook', 'main.js');
    const middlewarePath = resolve(process.cwd(), '.storybook', 'middleware.js');
    const previewPath = resolve(process.cwd(), '.storybook', 'preview.js');

    if (existsSync(mainPath)) {
      error(`Already initialized, files already exist:`);
      error(`	- ${mainPath}`);
      if (existsSync(middlewarePath)) {
        error(`	- ${middlewarePath}`);
      }
      if (existsSync(previewPath)) {
        error(`	- ${previewPath}`);
      }
      return;
    }

    copyFileSync(mainConfig, mainPath);
    copyFileSync(middlewareConfig, middlewarePath);
    copyFileSync(previewConfig, previewPath);

    info('Initialized Storybook config in ".storybook" folder.');
  });

// program
// 	.command('build')
// 	.description('Build...')
// 	.option('--env [name]', 'environment name')
// 	.option('--config [path]', 'config path')
// 	.option('--watch', 'watch for changes')
// 	.allowUnknownOption()
// 	.action((options, command) => {
// 		const env = parseEnvFlags(command.args);
// 		// add --env <val> into the env object
// 		// for example if we use --env prod
// 		// we'd have env.env = 'prod'
// 		if (options.env) {
// 			env['env'] = options.env;
// 		}

// 		env['stats'] ??= true;
// 		env['watch'] ??= options.watch;

// 		// if --env.config is passed, we'll set an environment
// 		// variable to it's value so that the config Util
// 		// reads from the correct config file.
// 		process.env.NATIVESCRIPT_CONFIG_NAME ??= env['config'];

// 		const configPath = (() => {
// 			if (options.config) {
// 				return path.resolve(options.config);
// 			}

// 			return path.resolve(process.cwd(), 'webpack.config.js');
// 		})();

// 		// todo: validate config exists
// 		// todo: guard against invalid config
// 		let configuration: webpack.Configuration;
// 		try {
// 			configuration = require(configPath)(env);
// 		} catch (err) {
// 			console.log(err);
// 		}

// 		if (!configuration) {
// 			console.log('No configuration!');
// 			return;
// 		}

// 		const compiler = webpack(configuration);

// 		const webpackCompilationCallback = (
// 			err: webpack.WebpackError,
// 			stats: webpack.Stats
// 		) => {
// 			if (err) {
// 				// Do not keep cache anymore
// 				compiler.purgeInputFileSystem();

// 				console.error(err.stack || err);
// 				if (err.details) {
// 					console.error(err.details);
// 				}

// 				process.exitCode = 1;
// 				return;
// 			}

// 			if (stats) {
// 				// Set the process exit code depending on errors
// 				process.exitCode = stats.hasErrors() ? 1 : 0;

// 				if (env.stats) {
// 					console.log(
// 						stats.toString({
// 							chunks: false,
// 							colors: true,
// 							errorDetails: env.verbose,
// 						})
// 					);
// 				}

// 				// if webpack profile is enabled we write the stats to a JSON file
// 				if (configuration.profile || env.profile) {
// 					console.log(
// 						[
// 							'',
// 							'|',
// 							`|  The build profile has been written to ${yellow(
// 								'webpack.stats.json'
// 							)}`,
// 							`|  You can analyse the stats at ${green(
// 								'https://webpack.github.io/analyse/'
// 							)}`,
// 							'|',
// 							'',
// 						].join('\n')
// 					);
// 					fs.writeFileSync(
// 						path.join(process.cwd(), 'webpack.stats.json'),
// 						JSON.stringify(stats.toJson())
// 					);
// 				}
// 			}
// 		};

// 		if (options.watch) {
// 			env.stats && console.log('webpack is watching the files...');
// 			compiler.watch(
// 				configuration.watchOptions ?? {},
// 				webpackCompilationCallback
// 			);
// 		} else {
// 			compiler.run((err, status) => {
// 				compiler.close((err2) =>
// 					webpackCompilationCallback(
// 						(err || err2) as webpack.WebpackError,
// 						status
// 					)
// 				);
// 			});
// 		}
// 	});

program.version(require('../../package.json').version, '-v, --version');

program.parse(process.argv);

const ENV_FLAG_RE = /--env\.(\w+)(?:=(.+))?/;

export function parseEnvFlags(flags: string[]): IWebpackEnv {
  const envFlags = flags.filter((flag) => flag.includes('--env.'));

  const env = {};

  envFlags.map((flag) => {
    let [_, name, v] = ENV_FLAG_RE.exec(flag);
    let value: any = v;

    // convert --env.foo to --env.foo=true
    if (value === undefined) {
      value = true;
    }

    // convert true/false to boolean
    if (value === 'true' || value === 'false') {
      value = value === 'true';
    }

    // convert numbers
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      value = +value;
    }

    // duplicate key/name - convert to array
    if (name in env && value) {
      const orig = Array.isArray(env[name]) ? env[name] : [env[name]];
      env[name] = [...orig, value];
    } else {
      env[name] = value;
    }
  });

  return env;
}
