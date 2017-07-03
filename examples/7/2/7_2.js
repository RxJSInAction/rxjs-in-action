/**
 *  RxJS in Action
 *  Listing 7.2
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

// From 7.1
const ajax = function (url, success, error) {
  let req = new XMLHttpRequest();
  req.responseType = 'json';
  req.open('GET', url);
  req.onload = function () {
    if (req.status === 200) {
      let data = req.response;
      success(data);
    }
    else {
      req.onerror();
    }
  };
  req.onerror = function () {
    if (error) {
      error(new Error('IO Error'));
    }
  };
  req.send();
};

ajax('/rest/api/data', data => {
    for (let item of data) {
      ajax(`/rest/api/data/${item.id}/info`, dataInfo => {
          ajax(`/rest/api/data/images/${dataInfo.img}`, showImage, error => {  //#A
            console.log(`Error image: ${error.message}`);
          });
        },
        error => { //#B
          console.log(`Error each data item: ${error.message}`);
        });
    }
  },
  error => {  //#C
    console.log(`Error fetching data: ${error.message}`);
  });

function showImage(data) {
  console.log('successful');
}
