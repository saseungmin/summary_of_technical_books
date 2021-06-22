import { readFile } from "fs";

readFile('./package.json', (error: Error, buffer: Buffer) => {
  if (error) {
    throw error;
  } else {
    const content: string = buffer.toString();
    console.log(content);
  }

  readFile('./tsconfig.json',(err: Error, buffer: Buffer) => {
    if (error) {
      throw error;
    } else {
      const content: string = buffer.toString();
      console.log(content);
    }
  })
});
