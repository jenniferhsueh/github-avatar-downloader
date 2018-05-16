var request = require('request');
var secret = require('./secret');
var fs = require('fs');

var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if(!repoOwner || !repoName) {
    throw "Please specify two arguments";
  };
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : "token " + secret.GITHUB_TOKEN 
    }
  };
  request.get(options, function (error, response, body) {
    
  response.setEncoding('utf8'); 
    cb(error, JSON.parse(body)) 
  });
};

getRepoContributors(repoOwner, repoName, function(err, result) {
  result.forEach(function(item){  
    console.log(item.avatar_url); 
    var name = item.login
    downloadImageByURL(item.avatar_url, './avatars/' + name + '.jpg');
  })
});

// download image from 'url' & store it in 'filepath'
function downloadImageByURL(url, filePath) {
  request(url, function (error, response, body) {
    console.log('Downloading image...'); 
  }).pipe(fs.createWriteStream(filePath));
};