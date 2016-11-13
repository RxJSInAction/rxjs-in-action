/**
 *  RxJS in Action
 *  Listing 7.1
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const ajax = function (url, success, error) {
   let req = new XMLHttpRequest();
   req.responseType = 'json';
   req.open('GET', url);
   req.onload = function() {
      if(req.status == 200) {
         let data = JSON.parse(req.responseText);
         success(data);
      }
      else {
         req.onerror();
      }
   }
   req.onerror = function () {
      if(error) {
         error(new Error('IO Error'));
      }
   };
   req.send();
};

ajax('http://nowhere.com',
  data  => console.log('Success!'),
  error => console.log(error));  // Should print: Error
