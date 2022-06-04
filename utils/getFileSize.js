export function get_filesize(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("HEAD", url, true); // Notice "HEAD" instead of "GET",
  //  to get only the header
  xhr.onreadystatechange = function () {
    if (this.readyState == this.DONE) {
      callback(parseInt(xhr.getResponseHeader("Content-Length")));
    }
  };
  xhr.send();

  //   new Promise((resolve) => {
  //     var xhr = new XMLHttpRequest();
  //     xhr.open("GET", "/a.bin", true);
  //     xhr.onreadystatechange = () => {
  //       resolve(+xhr.getResponseHeader("Content-Length"));
  //       xhr.abort();
  //     };
  //     xhr.send();
  //   }).then(console.log);
}
