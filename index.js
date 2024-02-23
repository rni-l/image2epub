#!/usr/bin/env node

const Epub = require("epub-gen");
const fs = require("fs");
const path = require("path");
const { Command } = require('commander');
const program = new Command();
const pkg = JSON.parse(fs.readFileSync('./package.json'))

const genImage = (imagesPath, options) => {
  const imageFiles = fs.readdirSync(imagesPath).filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  const option = {
      title: options.title || 'Album',
      author: options.author || 'Author',
      output: options.output,
      content: [],
      cover: `${path.join(imagesPath, imageFiles[0])}`
  };

  imageFiles.forEach((file, i) => {
      option.content.push({
          data: `<img src="file://${path.join(imagesPath, file)}" />`
      });
  });

  const ins = new Epub(option)
  return ins.promise.then(
      () => console.log(`Successful! File path is ${options.output}`),
      err => console.error("Error: ", err)
  );

}

const getAllFolderPath = (base, dir) => {
  let items = [];
  let tmp = []
  try {
    tmp = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
    return;
  }

  for (const item of tmp) {
    if (item.isDirectory()) {
      const curPath = path.join(base, item.name)
      items.push(curPath)
      const subdir = path.join(dir, item.name);
      items.push(...getAllFolderPath(curPath, subdir));
    }
  }
  return items
}

const getFileName = (dir) => {
  const list = dir.split('/')
  return `${list[list.length - 1]}.epub`
}

program
  .name('image2epub')
  .description('A cli that converts image files to EPUB format. Supports batch conversion.')
  .version(`${pkg.version}`);

  program.command('g')
  .description('A cli that converts image files to EPUB format. Supports batch conversion.')
  .argument('<string>', 'folder path')
  .option('-t, --title <title>', 'set title')
  .option('-a, --author <author>', 'set author')
  .option('-d, --deep <deep>', 'deep search')
  .requiredOption('-o, --output <output>', 'output folder path')
  .action(async (str, options) => {
    const dirList = options.deep ? getAllFolderPath(str, str).filter(v => v) : [str]
    const tasks = dirList.map(v => () => {
      const title = `${options.title}-${getFileName(v)}`
      return genImage(v, {
          ...options,
          title,
          output: path.join(options.output, title)
        })
     })
    // const tasks = dirList.map(async (v) => {
    //   console.log(getFileName(v));
    // })
    while(tasks.length) {
      const task = tasks.shift()
      await task()
    }
  });

program.parse();