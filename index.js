const cheerio = require('cheerio');
var fs = require('fs');
var wget = require('./wget64');
var path = require('path')
var xtend = require('xtend')
var convert = require('ebook-convert')
var puppeteer = require('puppeteer');


var options = {
  input: path.join(__dirname, 'test.html'),
  output: path.join(__dirname, 'example.epub'),
  authors: '"Lync"',
  pageBreaksBefore: '//h:h1',
  chapter: '//h:h1',
  insertBlankLine: true,
  insertBlankLineSize: '1',
  lineHeight: '12',
  marginTop: '50',
  marginRight: '50',
  marginBottom: '50',
  marginLeft: '50'
}

/*
* create epub file
*/


function rustlangDownload() {
  wget.wgetcb('https://rust-tieng-viet.github.io/print.html', function (data) {
    var $ = cheerio.load(data);
    const main = $('main');

    fs.readFile('./tmp.html', 'utf-8', function (err, tmpdata) {
      const tmp = cheerio.load(tmpdata);
      tmp('body').html(main.html());
      fs.writeFile('./test.html', tmp.html(), 'utf8', function (er) {
        // console.log(er);
        if (!er) {
          convert(options, function (err) {
            if (err) console.log(err)
          })
        }
      })
    })
  })
}

async function getWebcode(url) {
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto(url);

  // Query for an element handle.
  const element = await page.waitForSelector('body');
  console.log(element);
  // Do something with element...
  // await element.click(); // Just an example.

  // Dispose of handle
  await element.dispose();

  // Close browser.
  await browser.close();

  return element;
}

function getLinks(url) {
  return new Promise((res, rej) => {
    wget.download(url, '', (data) => {
      const $ = cheerio.load(data);
      const links = $().find('a');
      res(links)
      console.log($.html());
    });
  })
}

async function newsDownload(url, options) {
  const body = await getWebcode(url);
  console.log(body);
}

newsDownload('https://zingnews.vn/')





// async function run() {
//   const $ = await cheerio.fromURL('https://rust-tieng-viet.github.io/print.html');

//   const content = $('main')
//   console.log(content);
// }

// run();