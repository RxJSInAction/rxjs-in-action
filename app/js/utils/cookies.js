/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

import { Observable, Subject } from 'rxjs';

class CookieManager {
  constructor() {
    this._changed = new Subject();
  }
  _notifyChanged(key) {
    this._changed.next(key);
  }
  setCookie(key, value, opts = {}) {
    const {path, expires} = opts;
    let cookie = [`${key}=${value}`];
    path && cookie.push(`path=${path}`);
    expires && cookie.push(`expires=${expires}`);
    document.cookie = cookie.join('; ');
    this._notifyChanged(key);
  }

  static removeCookie(key) {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }

  getCookie(key) {
    return Observable.defer(() => {
      const cookies = document.cookie;
      const cookieStart = cookies.indexOf(key);

      if (cookieStart < 0)
        return Observable.empty();
      else {
        const valueStart = cookies.indexOf('=', cookieStart) + 1;
        let cookieEnd = cookies.indexOf(';', cookieStart);
        cookieEnd = cookieEnd < 0 ? cookies.length : cookieEnd;

        return Observable.of(cookies.substring(valueStart, cookieEnd));
      }
    });
  }

  watchCookie(key) {
    return this._changed.asObservable()
      .filter(x => key === x)
      .startWith(key)
      .flatMapTo(this.getCookie(key));
  }
}

export const cookies = new CookieManager();