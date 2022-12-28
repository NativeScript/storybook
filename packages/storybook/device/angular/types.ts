import { StorybookConfig as StorybookConfigBase, TypescriptOptions as TypescriptOptionsReact } from '@storybook/core-webpack';
import { StorybookConfigWebpack, BuilderOptions, TypescriptOptions as TypescriptOptionsBuilder } from '@storybook/builder-webpack5';

type FrameworkName = '@storybook/angular';
type BuilderName = '@storybook/builder-webpack5';

import { Parameters as DefaultParameters, StoryContext as DefaultStoryContext, WebRenderer } from '@storybook/types';

export interface NgModuleMetadata {
  declarations?: any[];
  entryComponents?: any[];
  imports?: any[];
  schemas?: any[];
  providers?: any[];
}
export interface ICollection {
  [p: string]: any;
}

export interface StoryFnAngularReturnType {
  /** @deprecated `component` story input is deprecated, and will be removed in Storybook 7.0. */
  component?: any;
  props?: ICollection;
  /** @deprecated `propsMeta` story input is deprecated, and will be removed in Storybook 7.0. */
  propsMeta?: ICollection;
  moduleMetadata?: NgModuleMetadata;
  template?: string;
  styles?: string[];
  userDefinedTemplate?: boolean;
}

/**
 * @deprecated Use `AngularRenderer` instead.
 */
export type AngularFramework = AngularRenderer;
export interface AngularRenderer extends WebRenderer {
  component: any;
  storyResult: StoryFnAngularReturnType;
}

export type Parameters = DefaultParameters & {
  /** Uses legacy angular rendering engine that use dynamic component */
  angularLegacyRendering?: boolean;
  bootstrapModuleOptions?: unknown;
};

export type StoryContext = DefaultStoryContext<AngularRenderer> & { parameters: Parameters };

export type FrameworkOptions = AngularOptions & {
  builder?: BuilderOptions;
};

type StorybookConfigFramework = {
  framework:
    | FrameworkName
    | {
        name: FrameworkName;
        options: FrameworkOptions;
      };
  core?: StorybookConfigBase['core'] & {
    builder?:
      | BuilderName
      | {
          name: BuilderName;
          options: BuilderOptions;
        };
  };
  typescript?: Partial<TypescriptOptionsBuilder & TypescriptOptionsReact> & StorybookConfigBase['typescript'];
};

/**
 * The interface for Storybook configuration in `main.ts` files.
 */
export type StorybookConfig = Omit<StorybookConfigBase, keyof StorybookConfigWebpack | keyof StorybookConfigFramework> & StorybookConfigWebpack & StorybookConfigFramework;

export interface AngularOptions {
  enableIvy?: boolean;
  enableNgcc?: boolean;
}
