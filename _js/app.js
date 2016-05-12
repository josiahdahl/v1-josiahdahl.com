/**
 * Created by jdahl on 5/10/16.
 */
$(document).ready(function () {
  $(".button-collapse").sideNav();
});

(function () {

  // Handle header movement
  var header = $('.site-header');
  var headerHeight = header.height();
  window.addEventListener('resize', function (e) {
    headerHeight = header.height();
  });
  // Fade the header image into the nav bar as we scroll past it
  window.addEventListener('scroll', function (e) {
    // Get header div hieght from top
    var offset = $(window).scrollTop();
    if (offset >= headerHeight / 2) {
      $('.site-nav').addClass('navbar-fixed');
      $('.site-nav').removeClass('site-nav_top');
    }
    else {
      $('.site-nav').removeClass('navbar-fixed');
      $('.site-nav').addClass('site-nav_top');
    }
  });
  // REmove form error class on click
  $('input, textarea').on('focus', function() {
    $(this).parent().removeClass('form-error');
  });

  // handle form validation
  $('#contact').on('submit', function (e) {
    console.log('checksubmitted');
    e.preventDefault();
    var error = false;

    // Required fields list
    var reqFields = ['#name', '#email', '#message'];

    reqFields.forEach(function(value, index) {
      var el = $(value);
      if (el.val() == '') {
        el.parent().addClass('form-error');
        error = true;
      }
      else if (value === '#email') {
        // From http://emailregex.com/
        var emailRegex = /.+@.+/i;
        var validEmail = emailRegex.test(el.val());
        if (!validEmail) {
          el.parent().addClass('form-error');

          error = true;
        }
      }
    });
    if (!error) {
      $.ajax({
        url: "https://formspree.io/josiah@josiahdahl.com",
        method: "POST",
        data: $(this).serializeArray(),
        dataType: "json"
      });
      document.getElementById('contact').reset();
      $('.form-success').fadeIn();
    }

  });

})();