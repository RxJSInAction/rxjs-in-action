/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

import {runtime$} from './editors';
import $ from 'jquery';

// Get the contents of the iframe
const doc = $('#output').contents();

runtime$.subscribe(
  content => {
    // Rewrites the contents of the iframe
    // Prevents carry over from previous examples
    doc[0].open();
    doc[0].write(content);
    doc[0].close();
  },
  err => {
    console.warn("Something went wrong! Please refresh the page.", err)
  });
