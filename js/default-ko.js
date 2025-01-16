// skrollr.init({});

$(document).ready(function() {
  $(window).on('scroll', function() {
    // 현재 스크롤 위치
    var scrollTop = $(this).scrollTop();

    // 스크롤 위치가 20px 이상이고 40px 이하일 때
    if (scrollTop >= 20 && scrollTop <= 80) {
      // 스크롤 위치에 따라 width 계산 (0%에서 100%로 변화)
      var widthPercentage = ((scrollTop - 20) / 20) * 100; // 20px에서 40px까지 변화

      // .thumb의 width를 설정
      $('.visualSlideInner .thumb').css({
        'width': widthPercentage + '%'
      });
    } else if (scrollTop < 20) {
      // 스크롤이 20px 미만일 때는 width 0%
      $('.visualSlideInner .thumb').css({
        'width': '20%',
        'height' : '40dvh',
        'transition' : '1s',
      });
      $('.visualSlideBox .keyText, .visualSlideInner .beforeBox').css({
        'visibility' : 'visible',
        'opacity' : 1,
        'padding-left' : 0,
        'transition' : '1s',
      });
      $('section.keyVisual').css({
        'padding': '200px 0 0 24%',
        'transition' : '1s',
      });
    } else if (scrollTop > 80) {
      // 스크롤이 40px 이상일 때는 width 100%
      $('.visualSlideInner .thumb').css({
        'width': '100%',
        'height' : '100dvh',
        'transition' : '1s',
      });
      $('.visualSlideBox .keyText, .visualSlideInner .beforeBox').css({
        'visibility' : 'hidden',
        'opacity' : 0,
        'padding-left' : '24%',
        'transition' : '1s',
      });
      $('section.keyVisual').css({
        'padding': '200px 0 0',
        'transition' : '1s',
      });
      $('section').addClass('on');
      $('section.keyVisual.on').removeClass('on').css({
        'height' : 0,
        'padding' : 0,
        'transition' : '1s',
      });
    }


    var lastScrollTop = 0; // 마지막 스크롤 위치
    var sections = $('.section.cont'); // 모든 섹션을 선택
    var scrollTop = $(this).scrollTop(); // 현재 스크롤 위치

    // 섹션들을 하나씩 확인하여 스크롤 위치에 맞는 섹션만 visible 클래스를 추가
    sections.each(function(index) {
      var sectionTop = $(this).offset().top; // 섹션의 상단 위치
      var sectionHeight = $(this).outerHeight(); // 섹션의 높이

      // 스크롤 위치가 섹션에 도달했을 때 visible 클래스를 추가
      if (scrollTop > sectionTop - $(window).height() && scrollTop < sectionTop + sectionHeight) {
        // 기존에 visible 클래스를 가진 섹션들에서 클래스를 제거
        sections.removeClass('visible');
        // 현재 섹션에만 visible 클래스를 추가
        $(this).addClass('visible');
      } else {
        $(this).removeClass('visible'); // 스크롤이 섹션을 지나가면 visible 클래스를 제거
      }
    });


    const scrollPosition = $(window).scrollTop(); // 현재 스크롤 위치
    const footerTop = $('#footer').offset().top; // #footer의 상단 위치
    const windowHeight = $(window).height(); // 브라우저 창 높이

    // #footer가 화면에 보이기 시작했을 때
    if (scrollPosition + windowHeight > footerTop) {
      // .utilWrap에 'hidden' 클래스 추가
      $('.utilWrap').addClass('hidden');
    } else {
      // #footer가 화면에 보이지 않으면 'hidden' 클래스 제거
      $('.utilWrap').removeClass('hidden');
    }
  });

  // const swiper = new Swiper(".sectionWrap", {
  //   direction: "vertical",
  //   slidesPerView: 1,
  //   spaceBetween: 30,
  //   mousewheel: true,
  // });
});