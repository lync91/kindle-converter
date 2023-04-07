const cheerio = require('cheerio');
var fs      = require('fs');
var url     = require('url');
var http    = require('http');
var https   = require('https');

function download(href, encoding, onsuccess, onerror) {
  onsuccess = (typeof onsuccess == 'function') ? onsuccess : function() {};
  onerror   = (typeof onerror   == 'function') ? onerror   : function() {};

  var protocol = url.parse(href).protocol;
  var get = function() {
    console.error(protocol + ' is not supported');
  };

  switch (protocol) {
    case 'http:':
      get = http.get;
      break;
    case 'https:':
      get = https.get;
      break;
  }

  get(href, function(res) {
    var data = '';
    if (encoding) {
      res.setEncoding(encoding);
      if (encoding == 'base64') {
        data = 'data:' + mime.getType(href) + ';base64,';
      }
    }
    res.on('data', function(chunk) { data += chunk; });
    res.on('end', function() { onsuccess(data); });
  }).on('error', function() { onerror(); });
}

// download(inputURL, '', function(data) {
//   var $ = cheerio.load(data);

//   var baseHref = inputURL.replace(/[^\/]*$/, '');
//   if ($('base').length) {
//     // XXX does not work if <base> has a relative URL
//     baseHref = $('base').last().attr('href');
//   } else {
//     $('head').prepend('\n  <base href="' + baseHref + '" />');
//   }

//   inlineStylesheets($, baseHref, function(doc) {
//     inlineScripts($, baseHref, function(doc) {
//       getMediaURLs($, baseHref, function(dataURLs) {
//         useDataURLs($, baseHref, dataURLs);
//         console.log('==> ' + outputFile);
//         fs.writeFileSync(outputFile, $.html());
//       });
//     });
//   });
// }, function(error) {
//   console.error('Something went wrong. Now guess what.');
// });


download('https://rust-tieng-viet.github.io/print.html', '', function (data) {
  var $ = cheerio.load(data);
  const main = $('main');
  
  fs.readFile('./tmp.html', 'utf-8', function (err, tmpdata) {
    const tmp = cheerio.load(tmpdata);
    tmp('body').html(main.html());
    fs.writeFile('./test.html', tmp.html(), 'utf8', function (er) {
      console.log(er);
    })
  })
})




// async function run() {
//   const $ = await cheerio.fromURL('https://rust-tieng-viet.github.io/print.html');

//   const content = $('main')
//   console.log(content);
// }

// run();