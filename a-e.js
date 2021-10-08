(function() {
  "use strict";
  function escapeHTML(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // RegExp to test if URL is local (otherwise the Javascript request will fail because of CORS)
  const lure = new RegExp("^(?:[a-z]+:)?//", "i"),
    isLocalURL = lure.test.bind(lure);
  // Check if URL links to self
  const lts = url => {
    url = url.split("//")[1];
    if (!url) return false;
    url = url.split("/")[0];
    if (!url.startsWith("www.") && window.location.host.startsWith("www."))
      url = "www." + url;
    return url === window.location.host;
  };

  function preload(url) {
    // Return promise for asynchronous requests
    return new Promise(resolve => {
      // Check if fetch() is supported
      if (fetch) {
        let dtype = "text/html; charset=utf-8";
        fetch(url)
          .then(res => {
            dtype = res.headers.get("Content-Type");
            return res.text();
          })
          .then(v => {
            resolve({ res: v, dtype });
          })
          .catch(console.log);
      } else {
        // If fetch() isn't supported use AJAX
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          if (this.readyState == this.HEADERS_RECEIVED) {
            const contentType = xhr.getResponseHeader("Content-Type"); // Get the data type of the response
            resolve({ res: this.responseText, dtype: contentType });
          }
        };
        xhr.open("GET", url);
        xhr.send();
      }
    });
  }
  let preloads = []; // Array of preloaded HTML

  // Constructor for the custom element
  class AE extends HTMLAnchorElement {
    constructor() {
      super();
    }
    connectedCallback() {
      preload(this.getAttribute("href")).then(({ res, dtype }) => {
        this.setAttribute("data-preload", preloads.length); // Assign an ID to our element so we know which preloaded HTML to match to
        this.setAttribute("data-type", dtype);
        preloads.push(res);
      });

      this.addEventListener("click", e => {
        /* Don't preload if:
            - Initial preload is not complete (yet)
            - history.pushState() is not supported
            - URL links to external site (CORS issues and history pushstate won't work)
            - URL is to be opened in a new tab */
        if (
          !preloads[parseInt(this.getAttribute("data-preload"))] ||
          !history.pushState ||
          (isLocalURL(this.getAttribute("href")) &&
            !lts(this.getAttribute("href"))) ||
          this.getAttribute("target") === "_blank"
        )
          return true;
        e.preventDefault(); // Prevent URL from going to the actual oage
        history.pushState(null, null, this.getAttribute("href")); // Change the URL without reloading
        const html = preloads[parseInt(this.getAttribute("data-preload"))]; // Get preloaded HTML from ID
        const dataType = this.getAttribute("data-type"); // Get the data type
        // Don't render as HTML if result isn't
        if (!dataType.startsWith("text/html;")) {
          document.head.innerText = "";
          document.body.innerHTML = '<pre style="overflow-wrap: break-word; white-space: pre-wrap; margin-bottom: 0px;">' + escapeHTML(html) + '</pre>';
          return;
        }
        document.documentElement.innerHTML = html;
      });
    }
  }
  // Prevent defining custom elements the second time (which will cause an error)
  if (customElements.get("a-e") === undefined) {
    customElements.define("a-e", AE, { extends: "a" });
  }
})();
