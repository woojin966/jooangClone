$(document).ready(function() {
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
        // sec1의 높이
        var sec1Height = $('.sec1').height();
        // 현재 스크롤 위치
        var scrollPosition = $(this).scrollTop();
        // footer의 상단 위치
        var footerOffset = $('footer').offset().top;

        // 스크롤 비율 (0~1 범위로 스케일링)
        var scrollRatio = Math.min(scrollPosition / sec1Height, 1);

        // clip-path 값을 계산
        var insetTop = (35 - (35 * scrollRatio)) + "%";
        var insetBottom = (35 - (35 * scrollRatio)) + "%";
        var insetLeft = (24 - (24 * scrollRatio)) + "%";
        var insetRight = (21 - (21 * scrollRatio)) + "%";
        var layerGap = (35 - (35 * scrollRatio)) + "%";
        if($(window).width() <= 1440){
            var insetTop = (35 - (35 * scrollRatio)) + "%";
            var insetBottom = (35 - (35 * scrollRatio)) + "%";
            var insetLeft = (24 - (24 * scrollRatio)) + "%";
            var insetRight = (21 - (21 * scrollRatio)) + "%";
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
            var layerGap = (28 - (28 * scrollRatio)) + "%";
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

        // footer 상단에 도달하면 .utilWrap을 왼쪽으로 숨기기
        if (scrollPosition + $(window).height() >= footerOffset) {
            $('.utilWrap').css({'left' : '-9999px', 'transition' : 'all 2s ease-in-out'}); // .utilWrap을 왼쪽으로 숨기기
        } else {
            $('.utilWrap').css({'left' : '-2.292vw', 'transition' : 'all 1s ease-in-out'}); // .utilWrap을 원래 위치로 복귀
            if($(window).width() <= 1440){
                $('.utilWrap').css({'left' : '-4.167vw', 'transition' : 'all 1s ease-in-out'});
            }
            if($(window).width() <= 1024){
                $('.utilWrap').css({'left' : '-6.25vw', 'transition' : 'all 1s ease-in-out'});
            }
        }
    });

    // document.querySelector('#intro').addEventListener('loadedmetadata', function(){
    //     this.currentTime = 3;
    //     this.play();
    // });

    document.querySelector('#intro').addEventListener("play", function() {
        setTimeout(function() {
            document.querySelector('#intro').pause();
        }, 6000); // 4초 후에 일시정지
    });

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
