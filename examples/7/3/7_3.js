/**
 *  RxJS in Action
 *  Listing 7.3
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const ajax = function (url) {
    return new Promise(function(resolve, reject) {  //#A
        let req = new XMLHttpRequest();
        req.responseType = 'json';
        req.open('GET', url);
        req.onload = function() {
            if(req.status == 200) {
               let data = req.response;
               resolve(data);  //#B
            }
            else {
               reject(new Error(req.statusText));     //#C
            }
        };
        req.onerror = function () {
           reject(new Error('IO Error'));  //#C
        };
        req.send();
    });
 };


ajax('http://nowhere.com')
   .then(console.log)
   .catch(error => console.log(`Error fetching data: ${error.message}`))
