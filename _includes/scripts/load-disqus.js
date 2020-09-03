// Compress via uglify:
// uglifyjs load-disqus.js -c -m > load-disqus.min.js
(function(w, d) {
  w._disqusLoading = typeof w._disqusLoading != 'undefined' ? w._disqusLoading : false;
  w._disqusThis = false;
  w._disqusThreadOffsetTop = d.getElementById('utterances-comments').offsetTop;

  function loadDQ(e) {
    var scrollTop = w.pageYOffset || d.body.scrollTop;
    if (!w._disqusThis &&
        scrollTop + w.innerHeight >= w._disqusThreadOffsetTop) {

      w._disqusThis = true;
      w.DISQUS.reset({
        reload: true,
      });
    }
  };

  if (!w._disqusLoading) {
    w._disqusLoading = true;

    loadJSDeferred('//{{ site.disqus_shortname }}.disqus.com/embed.js');

    // add event listener
    if (w.addEventListener) w.addEventListener('scroll', loadDQ, { passive: true });
    else if (w.attachEvent) w.attachEvent('onscroll', loadDQ);
    else w.onscroll = loadDQ;
  } else {
    w._disqusFirst = false;
  }
}(window, document));
