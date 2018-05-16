var request = require('request');
var secret = require('./secret');
var fs = require('fs');
// console.log(secret); testing correct token

var repoOwner = process.argv[2];
var repoName = process.argv[3];

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization' : "token " + secret.GITHUB_TOKEN 
    }
  }
  request.get(options, function (error, response, body) {

  // var url = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
  // request(url, function (error, response, body) {    //same thing as below

  // request( `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`, function (error, response, body) {
    
  response.setEncoding('utf8'); //response is thing i'm getting back, response is only avail when makign a request
    //logging in callback (below)
    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    cb(error, JSON.parse(body)) //calling the callback
  });

}
getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);    //calling the function and this is the callback
  // console.log("Result:", result);
  result.forEach(function(item){  //****item is the whole object */
    console.log(item.avatar_url); //item is the response//
    var name = item.login
    downloadImageByURL(item.avatar_url, './avatars/' + name + '.jpg');
  })
});

// download image from 'url'
// store that image in 'filepath'
function downloadImageByURL(url, filePath) {
  request(url, function (error, response, body) {
    console.log(error);
    // console.log(body);
                    // Note 4
    console.log('Downloading image...'); 
  }).pipe(fs.createWriteStream(filePath));
}