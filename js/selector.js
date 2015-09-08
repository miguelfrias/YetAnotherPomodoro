(function(window) {

  function Selector(selector) {
    if (typeof selector !== 'string') {
      throw new Error('Invalid selector.');
    }

    if (selector.indexOf('#', 0) === 0) {
      return document.getElementById(selector.slice(1));
    } else {
      return document.querySelectorAll(selector);
    }
  }

  window.$ = Selector;

})(window);