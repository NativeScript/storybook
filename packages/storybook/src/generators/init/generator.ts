import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  readJson,
  joinPathFragments,
  updateJson,
  addDependenciesToPackageJson,
  updateProjectConfiguration,
  GeneratorCallback,
} from '@nrwl/devkit';
import * as path from 'path';
import { isFramework } from '../../utils/utilities';
import { storybookVersion, webpack5Version } from '../../utils/versions';
import { InitGeneratorSchema } from './schema';
import { addAngularStorybookTask } from './utils-functions';

interface NormalizedSchema extends InitGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: InitGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
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
  const templatePath = path.join(
    __dirname,
    options.uiFramework === '@storybook/angular'
      ? './files/project-files/angular'
      : './files/project-files'
  );
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    tmpl: '',
  };
  const directory = options.directory ? `${options.directory}/` : '';
  const appName = options.name;
  generateFiles(tree, templatePath, options.projectRoot, templateOptions);
  // generateFiles(tree, joinPathFragments(__dirname, `files${framework ? '_' + framework : ''}${extra ? '_' + extra : ''}`), `apps/${directory}${appName}`, {
  //   ...(options as any),
  //   ...getDefaultTemplateOptions(),
  // })
}

function addExampleFiles(tree: Tree, options: NormalizedSchema) {
  const templatePath = path.join(
    __dirname,
    options.uiFramework === '@storybook/angular'
      ? './files/example-files/angular'
      : './files/example-files'
  );
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    tmpl: '',
  };
  const directory = options.directory ? `${options.directory}/` : '';
  const appName = options.name;
  generateFiles(tree, templatePath, options.projectRoot, templateOptions);
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

  if (isFramework('angular', schema)) {
    devDependencies['@storybook/angular'] = storybookVersion;
    devDependencies['@storybook/builder-webpack5'] = storybookVersion;
    devDependencies['@storybook/manager-webpack5'] = storybookVersion;
    devDependencies['webpack'] = webpack5Version;
    devDependencies['@storybook/addon-controls'] = storybookVersion;
    devDependencies['@storybook/native'] = storybookVersion;
    devDependencies['@storybook/native-addon'] = storybookVersion;
    devDependencies['@storybook/native-components'] = storybookVersion;
    devDependencies['@storybook/native-dev-middleware'] = storybookVersion;

    if (
      !packageJson.dependencies['@angular/forms'] &&
      !packageJson.devDependencies['@angular/forms']
    ) {
      devDependencies['@angular/forms'] = '*';
    }
  }

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

export default async function (tree: Tree, options: InitGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);

  const tasks: GeneratorCallback[] = [];

  addStorybookConfigFiles(tree, normalizedOptions);
  if (normalizedOptions.includeExample) {
    addExampleFiles(tree, normalizedOptions);
  }

  checkDependenciesInstalled(tree, normalizedOptions);
  if (normalizedOptions.uiFramework === '@storybook/angular') {
    addAngularStorybookTask(tree, normalizedOptions.name);
  }
  await formatFiles(tree);
}
