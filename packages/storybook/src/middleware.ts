import { Application, Request, Response, json } from 'express';
import { resolve } from 'node:path';
import { writeFileSync } from 'node:fs';

const currentPath = resolve(__dirname, '../../../dist/packages/storybook/device/currentStory.ts');

export const middleware = () => {
  return (app: Application) => {
    app.use(json());
    app.post('/nativescript/changeStory', (req: Request, res: Response) => {
      const data = req.body;
      try {
        writeFileSync(currentPath, `export const currentStory = ${JSON.stringify(data, null, 2)}`);
        res.json({ ok: true, data });
      } catch (err) {
        console.error(err);
        res.status(400).json({
          ok: false,
          message: err.toString(),
        });
      }
    });
  };
};
