import { Color, GridLayout, Image, ItemSpec, Label } from '@nativescript/core';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class StorybookWelcomeView extends GridLayout {
  constructor() {
    super();

    this.backgroundColor = new Color('#111827');
    this.padding = 16;

    this.addRow(new ItemSpec(1, 'auto'));
    this.addRow(new ItemSpec(1, 'auto'));
    this.addRow(new ItemSpec(1, 'auto'));
    this.addRow(new ItemSpec(1, 'auto'));

    const logos = new GridLayout();
    logos.horizontalAlignment = 'left';
    logos.row = 1;
    logos.addRow(new ItemSpec(1, 'auto'));
    logos.addRow(new ItemSpec(1, 'auto'));

    // const welcomeLabel = new Label();
    // welcomeLabel.text = 'Welcome to NativeScript + Storybook!';
    // welcomeLabel.fontSize = 16;
    // welcomeLabel.fontWeight = 'bold';
    // welcomeLabel.color = new Color('#f9fafb');

    const nativescriptLogo = new Image();
    nativescriptLogo.src = nativescriptLogoBase64;
    nativescriptLogo.row = 0;
    nativescriptLogo.stretch = 'aspectFit';
    nativescriptLogo.height = 50;
    // nativescriptLogo.marginTop = 24;
    logos.addChild(nativescriptLogo);

    const storybookLogo = new Image();
    storybookLogo.src = StorybookLogoBase64;
    storybookLogo.row = 1;
    storybookLogo.stretch = 'aspectFit';
    storybookLogo.height = 50;
    storybookLogo.marginTop = 24;
    logos.addChild(storybookLogo);

    const getStartedLabel = new Label();
    getStartedLabel.marginTop = 32;
    getStartedLabel.row = 2;
    getStartedLabel.color = new Color('#f9fafb');
    getStartedLabel.textWrap = true;
    getStartedLabel.text = [
      'To get started, run the Storybook web server:',
      '',
      'npm run storybook',
      '',
      'Then select a story from the left sidebar, and it will be rendered here!',
    ].join('\n');

    const renderPlaceholder = new Label();
    renderPlaceholder.row = 3;
    renderPlaceholder.color = new Color('#4ade80');
    renderPlaceholder.text = 'Waiting for story...';
    renderPlaceholder.borderWidth = 2;
    renderPlaceholder.borderColor = new Color('#374151');
    // renderPlaceholder.border
    renderPlaceholder.borderRadius = 8;
    renderPlaceholder.paddingLeft = 8;
    renderPlaceholder.paddingRight = 8;
    renderPlaceholder.paddingTop = 32;
    renderPlaceholder.paddingBottom = 32;
    renderPlaceholder.textAlignment = 'center';
    renderPlaceholder.marginTop = 24;

    const pulse = async () => {
      await renderPlaceholder.animate({
        opacity: 0.5,
        duration: 1000,
      });
      await wait(500);
      await renderPlaceholder.animate({
        opacity: 1,
        duration: 1000,
      });
      await wait(500);

      // repeat...
      await pulse();
    };

    renderPlaceholder.once('loaded', () => pulse());

    // this.addChild(welcomeLabel);
    this.addChild(logos);
    this.addChild(getStartedLabel);
    this.addChild(renderPlaceholder);
  }
}

const nativescriptLogoBase64 = `data:image/png;base64,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`;

const StorybookLogoBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAABQCAMAAAAA/tP+AAAA7VBMVEVHcEz/////////////SIf/////////////////////////////////////////////////SIX/////////////////SIX/////////////////R4b/////////////SIX/SYb/////SoX/wtb/UI//SIX/SYb/R4X/SIX/R4X/R4X/scr/SIb/R4X/SYb/R4b/R4X/R4b/R4X/2ub/mbv/cKD/SIf/R4X/////o8L/0eD/U43/daP/XpT/apz/gav/3ej/6O//utH/8/f/9Pf/3Oj/r8r/xtn/mLr/jLP/l7r/6PD/rsn/jLL/xdh0goPNAAAAN3RSTlMAYDB/QMAgQIAQ8KDvv3A/kMDQz+DfgLBQn2+/r49ffz9PML8Q4FDwYN+wb6CQcI9v0M/v10sgmrhcIwAACfxJREFUeNrtnXtj2jgSwLGJJT/B5VEIDdlN9/a9t3tvDCYkadM82u59/49z4ICtkUay5JCE9jT/xYxtaX7SSJoZSKtlJN/++9dfv1vLP//15s1sNvvHUcvKs8q3a/lmLW/eFABms2X2IPPZg/xgbfS8AHjhgfxsbbZ3efs3BQAZkNvdhbfWgHuWP2YmcrEFsthdsKvInuW1EY/Z3AJ5YvnZAjksmZkD+XRtgRwSkNt89ckCORwgmw1vfmuBHAiQ1ZK7YIHsWV7NHicWiAVigVggBwLkfDkv5OPSAnl5IMt3V1kli4+5BfKSQC4WGSfv57kF8gzyC2bl/F2GyIdVUyDuZJokWRYnSdI+JQfU+6C7k+dpFSnfF8hUsOBi/iFD5f1FEyDuNIaPGZ6cBgcChJaN8p/lfX75PmoARMZjTWRlDIQm2IPiY2KBaANZZFL5kBsCaUsfNQ0sED0gy0whcyMgQV/xqJhaIFpAFiogVyZAlDyyLDRp5/8vkHOlEbN7AyCJ+lG+BYLITzyQO2i1ywWcMbf6QDrwST2vBy8QCwSRI6XHujzfzJlLhc+SAwmY3e6gs7U+6YzC7bWoZYEYA1mKXuxcFwgzQTrgA6fHTRALRAWENf719tqlwEgDSF/CY2OHNRKvZYEYA/mwvXbDXLvQBBJU/gprWUgtEHMgWQ6Lf5CTyFHDvpKWBaIHhHVP2Z0I5H4/QAzb6XZP2+0znRBg0D1r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`;
