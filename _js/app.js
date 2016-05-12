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

    var payload = {};

    console.log('checksubmitted');
    e.preventDefault();
    var error = false;

    // Required fields list
    var reqFields = ['#name', '#email', '#message'];

    reqFields.forEach(function(value, index) {
      var el = $(value);
      console.log(el.val());
      if (el.val() == '') {
        el.parent().addClass('form-error');
        error = true;
      }
      else if (value === '#email') {
        // From http://emailregex.com/
        var emailRegex = /.+@.+/i;
        var validEmail = emailRegex.test(el.val());
        console.log(validEmail);
        if (!validEmail) {
          el.parent().addClass('form-error');

          error = true;
        }
      }
    });
    console.log($('#contact').serializeArray());
    if (!error) {
      $.ajax({
        url: "https://formspree.io/josiah.dahl+contact@gmail.com",
        method: "POST",
        data: $(this).serializeArray(),
        dataType: "json"
      });
      console.log('submitted');
    }
    // Get required elements
    // var reqFields = $('.input-field.required');
    // console.log(reqFields);
    // reqFields.each(function() {
    //   console.log('in field');
    //   // get input type
    //   if ($(this).children('input[name=name]')) {
    //     console.log($(this).children('input[name=name]'));
    //     if ($(this).children('input[name=name]').val() == '') {
    //       $(this).addClass('form-error');
    //       error = true;
    //     }
    //
    //   }
    //   else if ($(this).children('input[name=email]')) {
    //     var emailRegex = '^[^@]+@[^@]+\.[^@]+$';
    //     var email = $(this).children('input[name=email]');
    //     if (email.val() == '') {
    //       $(this).addClass('form-error');
    //       error = true;
    //     }
    //     var validEmail = emailRegex.exec(email.val());
    //     if (!validEmail) {
    //       $(this).addClass('form-error');
    //       error = true;
    //     }
    //   }
    //   else if($(this).children('textarea')) {
    //     var message = $(this).children('textarea');
    //     if (message.val() == '') {
    //       $(this).addClass('form-error');
    //       error = true;
    //     }
    //   }
    // });

  });

})();