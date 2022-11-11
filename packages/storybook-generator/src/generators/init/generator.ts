import { addProjectConfiguration, formatFiles, generateFiles, getWorkspaceLayout, names, offsetFromRoot, Tree, readJson, joinPathFragments, updateJson, addDependenciesToPackageJson, updateProjectConfiguration, GeneratorCallback } from '@nrwl/devkit';
import * as path from 'path';
import { isFramework } from '../../utils/utilities';
import { nativescriptStorybookVersion, storybookNativeVersion, storybookVersion, webpack5Version } from '../../utils/versions';
import { InitGeneratorSchema } from './schema';
import { addAngularStorybookTask, configureTsProjectConfig } from './util-functions';

interface NormalizedSchema extends InitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: InitGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory ? `${names(options.directory).fileName}/${name}` : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addStorybookConfigFiles(tree: Tree, options: NormalizedSchema) {
  const templatePath = path.join(__dirname, options.uiFramework === '@storybook/angular' ? './files/project-files/angular' : './files/project-files');
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    tmpl: '',
  };
  generateFiles(tree, templatePath, './', templateOptions);
}

function addExampleFiles(tree: Tree, options: NormalizedSchema) {
  const templatePath = path.join(__dirname, options.uiFramework === '@storybook/angular' ? './files/example-files/angular' : './files/example-files');
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    tmpl: '',
  };
  const directory = options.directory ? `${options.directory}/` : '';
  const appName = options.name;
  generateFiles(tree, templatePath, `${options.projectRoot}/src`, templateOptions);
}

function checkDependenciesInstalled(host: Tree, schema: NormalizedSchema) {
  const packageJson = readJson(host, 'package.json');
  const devDependencies = {};
  const dependencies = {};
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencices = packageJson.devDependencices || {};

  // base deps
  // devDependencies['@nrwl/storybook'] = nxVersion;
  devDependencies['@storybook/core-server'] = storybookVersion;
  devDependencies['@storybook/addon-essentials'] = storybookVersion;
  devDependencies['@storybook/cli'] = storybookVersion;

  if (isFramework('angular', schema)) {
    devDependencies['@storybook/angular'] = storybookVersion;
    devDependencies['@storybook/builder-webpack5'] = storybookVersion;
    devDependencies['@storybook/manager-webpack5'] = storybookVersion;
    devDependencies['webpack'] = webpack5Version;
    devDependencies['@storybook/addon-controls'] = storybookVersion;
    devDependencies['@storybook/native'] = storybookNativeVersion;
    devDependencies['@storybook/native-addon'] = storybookNativeVersion;
    devDependencies['@storybook/native-components'] = storybookNativeVersion;
    devDependencies['@storybook/native-dev-middleware'] = storybookNativeVersion;

    // Nativescript specific storybook dependencies
    devDependencies['@nativescript/storybook-device'] = nativescriptStorybookVersion;
    devDependencies['@nativescript/storybook-web'] = nativescriptStorybookVersion;

    if (!packageJson.dependencies['@angular/forms'] && !packageJson.devDependencies['@angular/forms']) {
      devDependencies['@angular/forms'] = '*';
    }
  }

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

function checkAppDependenciesInstalled(host: Tree, schema: NormalizedSchema) {
  const appPackageJson = readJson(host, `${schema.projectRoot}/package.json`);
  const devDependencies = {};
  const dependencies = {};
  appPackageJson.dependencies = appPackageJson.dependencies || {};
  appPackageJson.devDependencices = appPackageJson.devDependencices || {};

  // base deps
  // devDependencies['@nrwl/storybook'] = nxVersion;
  devDependencies['@storybook/core-server'] = storybookVersion;
  devDependencies['@storybook/addon-essentials'] = storybookVersion;

  if (isFramework('angular', schema)) {
    devDependencies['@storybook/angular'] = storybookVersion;
    devDependencies['@storybook/builder-webpack5'] = storybookVersion;
    devDependencies['@storybook/manager-webpack5'] = storybookVersion;
    devDependencies['webpack'] = webpack5Version;
    devDependencies['@storybook/addon-controls'] = storybookVersion;
    devDependencies['@storybook/native'] = storybookNativeVersion;
    devDependencies['@storybook/native-addon'] = storybookNativeVersion;
    devDependencies['@storybook/native-components'] = storybookNativeVersion;
    devDependencies['@storybook/native-dev-middleware'] = storybookNativeVersion;

    // Nativescript specific storybook dependencies
    devDependencies['@nativescript/storybook-device'] = nativescriptStorybookVersion;
    devDependencies['@nativescript/storybook-web'] = nativescriptStorybookVersion;

    if (!appPackageJson.dependencies['@angular/forms'] && !appPackageJson.devDependencies['@angular/forms']) {
      devDependencies['@angular/forms'] = '*';
    }
  }

  return addDependenciesToPackageJson(host, dependencies, devDependencies, `${schema.projectRoot}/package.json`);
}

export default async function (tree: Tree, options: InitGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const tasks: GeneratorCallback[] = [];

  addStorybookConfigFiles(tree, normalizedOptions);
  if (normalizedOptions.includeExample) {
    addExampleFiles(tree, normalizedOptions);
  }

  checkDependenciesInstalled(tree, normalizedOptions);
  checkAppDependenciesInstalled(tree, normalizedOptions);
  if (normalizedOptions.uiFramework === '@storybook/angular') {
    addAngularStorybookTask(tree, normalizedOptions.name);
  }
  configureTsProjectConfig(tree, normalizedOptions);
  await formatFiles(tree);
}
