/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

class CookieManager {
  setCookie(key, value, {path, expires}) {
    let cookie = [`${key}=${value}`];
    path && cookie.push(`path=${path}`);
    expires && cookie.push(`expires=${expires}`);

    document.cookie = cookie.join('; ');
  }

  getCookie(key) {
    const cookies = document.cookie;
    const cookieStart = cookies.indexOf(key);

    if (cookieStart < 0)
      return Rx.Observable.empty();
    else {
      const valueStart = cookies.indexOf('=', cookieStart) + 1;
      const cookieEnd = cookies.indexOf(';', cookieStart);

      return Rx.Observable.of(cookies.substring(valueStart, cookieEnd));
    }
  }
}

export const cookies = new CookieManager();