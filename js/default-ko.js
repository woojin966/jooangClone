$(document).ready(function() {
    $(window).scroll(function() {
        // sec1의 높이
        var sec1Height = $('.sec1').height();
        // 현재 스크롤 위치
        var scrollPosition = $(this).scrollTop();

        // 스크롤 비율 (0~1 범위로 스케일링)
        var scrollRatio = Math.min(scrollPosition / sec1Height, 1);

        // clip-path 값을 계산
        var insetTopBottom = (35 - (35 * scrollRatio)) + "%"; // 35에서 0까지 감소
        var insetLeftRight = (24 - (24 * scrollRatio)) + "%"; // 0에서 24까지 증가
        var layerGap = (35 - (35 * scrollRatio) + "%");

        // 새로운 clip-path 값 적용
        $('.sec1').css('clip-path', 'inset(' + insetTopBottom + ' ' + insetLeftRight + ' ' + insetTopBottom + ' ' + insetLeftRight + ')');
        $('.layer').css('gap', layerGap + '%');
        if(scrollRatio == 1){
            $('.layer').css('opacity', '0');
        } else {
            $('.layer').css('opacity', '1');
        }
    });
});
