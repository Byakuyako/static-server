var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true)
  var pathWithQuery = request.url
  var queryString = ''
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
  }
  var path = parsedUrl.pathname
  var query = parsedUrl.query
  var method = request.method

  /******** 从这里开始看，上面不要看************/

  console.log("有人发请求过来了, HTTP 路径为\n" + pathWithQuery);

  response.statusCode = 200

  const filePath = path === '/' ? '/index.html' : path
  const index = filePath.lastIndexOf('.') //找到'.'字符串最后出现的位置
  const suffix = filePath.substring(index) //提取从指定位置开始到结尾, 返回一个子字符串
  const fileTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.jpg': 'image/jpeg'
  }
  response.setHeader('Content-Type', `${fileTypes[suffix] || 'text/html'};charset=utf-8`)

  let content
  try { //异常处理
    content = fs.readFileSync(`./public${filePath}`)
  } catch (error) {
    content = '文件不存在'
    response.statusCode = 404
  }

  response.write(content)
  response.end()
  /******** 代码结束，下面不要看************/
});

server.listen(port);
console.log("监听 " + port + " 成功\n请用在浏览器打开http://localhost:" + port);