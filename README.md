# a-eJS
Accelerating extreme attributes - go to a URL faster than you can blink. [Demo](https://a-ejs.glitch.me).

*Note: this only works for internal URLs (i.e. URLs to the same website).*

## Setup
Download the source from [Github](https://github.com/codingjlu/a-ejs) or grab the CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/a-e.js/a-e.min.js"></script>
```
Or install it via NPM:
```sh
npm i a-e.js
```
*If importing or using commonjs sytax, simply go `import "a-ejs"` or `require("a-ejs")` without assigning a variable. There's no exports.*

And that's it for the setup.

## Usage
Just add the `is="a-e"` attribute to any HTML `a` tag:
```html
<a href="/helloworld" is="a-e">Hello world</a>
```
And that's it!

See more documentation [here](https://a-ejs.glitch.me).
