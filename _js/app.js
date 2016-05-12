/**
 * Created by jdahl on 5/10/16.
 */
$(document).ready(function() {
  $(".button-collapse").sideNav();
});

(function () {
  var header = $('.site-header');
  var headerHeight = header.height();
  window.addEventListener('resize', function (e) {
    headerHeight = header.height();
  });
  // Fade the header image into the nav bar as we scroll past it
  window.addEventListener('scroll', function (e) {
    // Get header div hieght from top
    var offset = $(window).scrollTop();
    if (offset >= headerHeight/2) {
      $('.site-nav').addClass('navbar-fixed');
      $('.site-nav').removeClass('site-nav_top');
    }
    else {
      $('.site-nav').removeClass('navbar-fixed');
      $('.site-nav').addClass('site-nav_top');
    }
    // var distanceFromTop = header.getBoundingClientRect().top;
    // Percent Visible
    // var visible = 1 - (-1 * distanceFromTop) / headerHeight;
    // var scrollPercent = 0.3;
    // When we scroll past it halfway, fade it into header
    // if (visible <= scrollPercent) {
    //   $('#site-header nav').
    //   var transitionClassName = 'site-nav_top';
    //   var nav = header.getElementsByTagName('nav')[0];
    //   if (nav.classList) {
    //     nav.classList.remove(transitionClassName);
    //   }
    //   else {
    //     new RegExp('(^| )' + transitionClassName + '( |$)', 'gi').test(nav, transitionClassName);
    //   }
    // }
    // var someDiv = document.getElementById('someDiv');
    // var distanceToTop = someDiv.getBoundingClientRect().top;

  });
})();