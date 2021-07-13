/* eslint-disable import/prefer-default-export */
import * as fs from 'fs';

export const fileExists = (
  filepath: string,
): Promise<boolean> => new Promise((resolve) => fs.access(filepath, (error) => resolve(!error)));
