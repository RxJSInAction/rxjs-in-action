# rxjs-in-action
Code sample repository

## Install

First download/fork/clone the project

To start the server run (in the rxjs-in-action directory):

`yarn install && yarn global add gulp && gulp`

On subsequent runs (if all goes well) you can run just 

`gulp`

### Adding new Examples (FROZEN)

Add new examples under the `/examples` directory.
Each example should be organized under the sub-directory corresponding to its chapter and index.

i.e. Listing 2.3 => `/examples/2/3`

Each example can have three separate files, they should be labeled using the chapter and index

2_3.js
2_3.html
2_3.css

Currently you must also add a new selector option to the front-end as well.
Go into index.html and add:

`<option value="2.3">2.3</option>`

This will allow the new sample to get picked up by the front end.


### Bug reports

If you find a bug or an issue with one of the code samples please file an issue so that we can get it fixed for other readers
