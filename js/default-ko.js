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
        var insetTopBottom = (35 - (35 * scrollRatio)) + "%"; // 35에서 0까지 감소
        var insetLeftRight = (24 - (24 * scrollRatio)) + "%"; // 0에서 24까지 증가
        var layerGap = (35 - (35 * scrollRatio)) + "%";

        if (scrollRatio == 1) {
            $('.layer').css({'position' : 'absolute', 'visibility' : 'hidden', 'opacity': '0', 'color': '#fff'}); // opacity 0, color #fff
        } else {
            var colorValue = (scrollRatio * 255); // 비율에 따라 서서히 색상 변경
            var color = 'rgb(' + (0 + colorValue) + ',' + (0 + colorValue) + ',' + (0 + colorValue) + ')';
            $('.layer').css({'position' : 'fixed', 'visibility' : 'visible', 'opacity': '1', 'color': color}); // opacity 1, color 서서히 변화
        }
        // 새로운 clip-path 값 적용
        $('.sec1').css('clip-path', 'inset(' + insetTopBottom + ' ' + insetLeftRight + ' ' + insetTopBottom + ' ' + insetLeftRight + ')');
        $('.layer').css({'gap' : layerGap});

        // footer 상단에 도달하면 .utilWrap을 왼쪽으로 숨기기
        if (scrollPosition + $(window).height() >= footerOffset) {
            $('.utilWrap').css({'left' : '-9999px', 'transition' : 'all 2s ease-in-out'}); // .utilWrap을 왼쪽으로 숨기기
        } else {
            $('.utilWrap').css({'left' : '-44px', 'transition' : 'all 1s ease-in-out'}); // .utilWrap을 원래 위치로 복귀
        }
    });

    document.querySelector('#intro').addEventListener('loadedmetadata', function(){
        this.currentTime = 3;
        this.play();
    });
});
