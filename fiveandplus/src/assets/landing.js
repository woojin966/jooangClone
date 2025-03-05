$(document).ready(function() {
  var lastScrollTop = 0;

    $('.ham_btn').on('click', function(){
        $('.layerMenu').addClass('on');
        $('body').addClass('no_scroll');
    });
    $('.btnMenu_close').on('click', function(){
        $('.layerMenu').removeClass('on');
        $('body').removeClass('no_scroll');
    });

    $('.layer').css({'color' : '#000'});
    $(window).scroll(function() {
      var scrollPosition = $(window).scrollTop(); // 현재 스크롤 위치
      var sec1Height = $('.sec1').height(); // sec1의 높이
      var footerOffset = $('footer').offset().top; // footer의 상단 위치
      var windowHeight = $(window).height(); // 윈도우 높이

      // 스크롤 비율 (0~1 범위로 스케일링)
      var scrollRatio = Math.min(scrollPosition / sec1Height, 1);

      // clip-path 값을 계산
      var insetTop = (35 - (35 * scrollRatio)) + "%";
      var insetBottom = (35 - (35 * scrollRatio)) + "%";
      var insetLeft = (24 - (24 * scrollRatio)) + "%";
      var insetRight = (24 - (24 * scrollRatio)) + "%";
      var layerGap = (35 - (35 * scrollRatio)) + "%";
      if($(window).width() <= 1440){
          var insetTop = (35 - (35 * scrollRatio)) + "%";
          var insetBottom = (35 - (35 * scrollRatio)) + "%";
          var insetLeft = (24 - (24 * scrollRatio)) + "%";
          var insetRight = (24 - (24 * scrollRatio)) + "%";
          var layerGap = (32 - (32 * scrollRatio)) + "%";
      }
      if($(window).width() <= 1024){
        var insetTop = (38 - (38 * scrollRatio)) + "%";
        var insetBottom = (38 - (38 * scrollRatio)) + "%";
        var insetLeft = (0 - (0 * scrollRatio)) + "%";
        var insetRight = (0 - (0 * scrollRatio)) + "%";
        var layerGap = (28 - (28 * scrollRatio)) + "%";
        if($(window).height() <= 600){
          var insetLeft = (16 - (16 * scrollRatio)) + "%";
          var insetRight = (12 - (12 * scrollRatio)) + "%";
        }
      }
      if($(window).width() <= 840){
        var insetTop = (40 - (40 * scrollRatio)) + "%";
        var insetBottom = (40 - (40 * scrollRatio)) + "%";
        var insetLeft = (0 - (0 * scrollRatio)) + "%";
        var insetRight = (0 - (0 * scrollRatio)) + "%";
        var layerGap = (24 - (24 * scrollRatio)) + "%";
      }
      if($(window).width() <= 480){
        var insetTop = (28 - (28 * scrollRatio)) + "%";
        var insetBottom = (28 - (28 * scrollRatio)) + "%";
        var insetLeft = (28 - (28 * scrollRatio)) + "%";
        var insetRight = (28 - (28 * scrollRatio)) + "%";
        var layerGap = (46 - (46 * scrollRatio)) + "%";
      }

      if (scrollRatio == 1) {
        $('.layer').css({'position' : 'absolute', 'visibility' : 'hidden', 'opacity': '0', 'color': '#fff'}); // opacity 0, color #fff
      } else {
        var colorValue = (scrollRatio * 255); // 비율에 따라 서서히 색상 변경
        var color = 'rgb(' + (0 + colorValue) + ',' + (0 + colorValue) + ',' + (0 + colorValue) + ')';
        $('.layer').css({'position' : 'fixed', 'visibility' : 'visible', 'opacity': '1', 'color': color}); // opacity 1, color 서서히 변화
      }

      // 새로운 clip-path 값 적용
      $('.sec1').css('clip-path', 'inset(' + insetTop + ' ' + insetRight + ' ' + insetBottom + ' ' + insetLeft + ')');
      $('.layer').css({'gap' : layerGap});

      $('.section').each(function() {
        var $this = $(this);
        var offset = $this.offset().top; // .section의 상단 위치
        var sectionHeight = $this.outerHeight(); // .section의 높이

        // .section이 화면에 나타날 때 (스크롤 내리거나 올리면서)
        if (scrollPosition + windowHeight - 500 > offset && scrollPosition < offset + sectionHeight + 500) {
          // 이전 .section의 active 클래스를 제거할 조건
          if (!$this.hasClass('active')) {
            // 다음 .section이 화면에 일정 부분 가리면 이전 .section의 active 클래스를 제거
            $('.section.active').each(function() {
              var $active = $(this);
              var activeOffset = $active.offset().top;

              // 현재 .section이 다음 .section보다 화면에 더 위에 있으면 active 클래스를 제거
              if (scrollPosition + windowHeight > activeOffset + 500) {
                $active.removeClass('active');
              }
            });
            $this.addClass('active'); // active 클래스를 추가하여 애니메이션 시작
          }
        } else {
          // .section이 화면에서 사라지면 active 클래스를 제거
          if ($this.hasClass('active')) {
            $this.removeClass('active');
          }
        }
      });

      // 스크롤을 내리면 .utilwrap을 사라지게 함
      if (scrollPosition > lastScrollTop) {
        // 스크롤 내림
        $('.utilWrap').stop().animate({
          left: '-9999px'
        }, 200);
      } else {
        // 스크롤 올림
        $('.utilWrap').stop().animate({
          left: '-2.083vw'
        }, 200);
        if($(window).width() <= 1440){
          $('.utilWrap').stop().animate({
            left: '-4.306vw'
          }, 200);
        }
        if($(window).width() <= 1280){
          $('.utilWrap').stop().animate({
            left: '-4.844vw'
          }, 200);
        }
        if($(window).width() <= 1024){
          $('.utilWrap').stop().animate({
            left: '-7.813vw'
          }, 200);
        }
        if($(window).width() <= 840){
          $('.utilWrap').stop().animate({
            left: '-8.571vw'
          }, 200);
        }
        if($(window).width() <= 768){
          $('.utilWrap').stop().animate({
            left: '-9.896vw'
          }, 200);
        }
        if($(window).width() <= 580){
          $('.utilWrap').stop().animate({
            left: '-9.876vw'
          }, 200);
        }
        if($(window).width() <= 480){
          $('.utilWrap').stop().animate({
            left: '-14.167vw'
          }, 200);
        }
      }

      // 마지막 스크롤 위치 업데이트
      lastScrollTop = scrollPosition;
  });

  document.querySelector('#intro').addEventListener('loadedmetadata', function(){
      this.currentTime = 3;
      this.play();
  });

  // document.querySelector('#intro').addEventListener("play", function() {
  //   setTimeout(function() {
  //     document.querySelector('#intro').pause();
  //   }, 6000); // 4초 후에 일시정지
  // });

  // 비디오가 로드될 때 자동으로 재생 시작
  document.querySelector('#intro').play();

  // 마우스 휠로 수평 스크롤 구현
  const scrollContainer = document.querySelector('.img_list_box');
  scrollContainer.addEventListener('wheel', function(e) {
    // 수평 스크롤은 'deltaX' 값으로, 수직 스크롤은 'deltaY' 값으로 나타남
    if (e.deltaY === 0) {  // 수직 휠이 아니라면
      scrollContainer.scrollLeft += e.deltaX;  // 수평 스크롤
    } else if (e.deltaX === 0) {  // 수평 휠이 아니라면
      scrollContainer.scrollLeft += e.deltaY;  // 수직 휠을 가로 스크롤로 변환
    }
  });
});
