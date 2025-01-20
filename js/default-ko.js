// 네임스페이스 : 이벤트 이름에 추가적인 식별자를 붙여서(이벤트를 변수에 저장함) 이벤트를 구분하고 충돌과 중복을 방지하기 위함. nsScrollEnd가 네임스페이스인데, 같은 scroll이벤트가 여러군데에서 발생하더라도 서로 충돌하지 않고 독립적으로 처리하기 위함

// ScrollEnd
var ignoreScroll = false; // ignoreScroll 전역변수로 초기값 설정 : true이면 스크롤 이벤트 무언가를 무시하는 거 같음
var ns = (new Date).getTime(); // 현재 시간을 밀리초 단위로 변환해 네입스페이스(nsScrollEnd)에 고유성을 부여
var special = $.event.special; // $.event.special을 통해 jQuery에서 제공하는 특수 이벤트 기능에 접근
var dispatch = $.event.handle || $.event.dispatch; // jQuery이벤트 핸들러를 실행하는 기본 함수
var scroll = 'scroll'; // 기본적 스크롤 이벤트
var scrollEnd = scroll + 'end'; // 기본적 스클로 이벤트를 감지한 후 발생할 커스텀 이벤트
var nsScrollEnd = scroll + '.' + scrollEnd + ns // 고유 네임스페이스를 추가하여 scrollEnd이벤트가 다른 이벤트들과 충돌하지 않도록 함
special.scrollend = {
  delay : 300, // 스크롤 종료를 감지하기 위한 지연시간 : 스크롤이 끝났다고 판단할 시간 - 일정시간(300ms)동안 스크롤 이벤트가 발생하지 않으면 scrollEnd 이벤트가 발생하도록 함
  setup : function(){ // scrollEnd 이벤틀르 사용할 준비
    var pid, handler = function(e){ // pid : 타이머 ID. 이전에 설정된 타이머를 취소하기 위해 사용, handler : 실제 스크롤을 처리하는 함수. 스크롤 이벤트가 발생할 때마다 호출됨
      var _this = this, args = arguments;

      clearTimeout(pid); // 이전에 설정된 타임아웃 취소, 스크롤이 계속해서 발생하면 scrollEnd 이벤트가 중복으로 발생하지 않도록 함
      pid = setTimeout(function(){ // 300ms 동안 추가적인 스크롤이 없으면 scrollEnd 트리거
        e.tpye = scrollEnd; // 이벤트 타입을 'scrollEnd로 변경'
        dispatch.apply(_this, args); // 커스텀 이벤트를 호출 : scrollEnd이벤트를 실제로 발생시킴
      }, special.scrollend.delay); // 지연시간 후 이벤트 발생
    };
    $(this).on(nsScrollEnd, handler); // 해당 DOM 요소에 대해 scrollEnd 이벤트를 설정
  },
  teardown : function(){ // scrollEnd이벤트를 더이상 사용하지 않을때 이벤트 제거
    $(this).off(nsScrollEnd); // 해당 DOM요소에 scrollEnd 이벤트 핸들러를 제거
  }
};

// Touch Prevent
function lockTouce(e){
  e.stopImmediatePropagation();
}

// is Mobile
function _isMobile(){
  var isMobile = (/iPhone|ipod|android|balckberry|fennec/).test(navigator.userAgent.toLowerCase());
  return isMobile;
}

// make selectbox
function makeSelect(obj, fn) {
  if(obj.parent().hasClass("selectStyle")){
    return false;
  }

  // 부모 감싸기
  obj.wrap('<div class="selectStyle"></div>');
  obj.after('<div class="selectList"></div>');

  $selectBox = obj.closest('.selectBoxWrap').eq(0); // obj 부모요소중에 클래스 .selelctBoxWrap을 가진 첫번째 요소를 selectBox에 할당
  $selectBox.find('.selecStyle').each(function(){ // selectBox에서 .selectStyle을 찾아서 각각에 함수 부여
    $(this).find('.selectBox').after('<a href="javascript:void(0)" class="selectResult"' + $(this).find(".selectBox option:selected").text() + '</a>'); // $(this) == 각 .selectStyle의 자식 .selectBox를 찾아서, 그 다음 형제로 a요소를 넣는다. a 안에는 .selectStyle의 자식 중 .selectBox의 선택된 option의 텍스트가 들어간다.

    if(_isMobile()) $(this).find('.selectList').width(obj.closest('.selectBoxWrap').eq(0).width() - 40); // 모바일이라면, .selectStyle의 자식 중 .selectList를 찾아, obj의 부모중 첫번째 selectBoxWrap의 가로길이 - 40하 것을 .selectList 가로길이로 할당.
    // 조건문에서 코드가 한줄이라면 {}를 생략할 수 있다.

    // i=0이고, 각 .selelctStyle의 자식 중 .selectBox option의 개수보다 -1만큼 같거나 작으며, 1씩 증가함
    for(var i=0; i<=$(this).find('.selectBox option').length-1; i++){
      var value = $(this).find('.selectBox option').eq(i).attr('value'); // value에 각 .selelctStyle의 자식 중 .selectBox option 각 인덱스의 value를 할당.

      // value가 있따면
      if(value){
        // value의 두번째 글자부터 5번째 전까지 글자가 news라면(인덱스 개념으로 셈)
          if(value.substring(1, 5) == 'news'){
            value = ' href="'+value+'"'; // value에 value를 링크로 넣은 href코드 할당
          } else {
            value = ' href="javascript:void(0)" data-value="'+value+'"'; // value 잘라서 추출한 글씨가 news가 아니라면, href는 페이지 이동 안시키고, data-value에 value를 넣는 코드를 할당
          }
        // value가 없다면
        } else {
          value = ' href="javascript:void(0)"'; // 페이지 링크 이동 안하는 href 코드 할당
        }
        $(this).find('.selcetList').append('<div class="option"><a ' + value + ' >'+$(this).find('.selectBox option').eq(i).text()+'</a></div>'); // 각 .selectStyle에 자식 중 .selectList를 찾아 div.option을 자식요소로 삽입함. 텍스트는 i번째 .selectBox option의 텍스트를 삽입함
    }

    // option에 selected일때
    // 각 .selectStyle의 자식중 select의 자식들 각 option에 idx, obj를 보내면서 함수 실행 : idx는 각 옵션의 인덱스, obj는 각 옵션 요소
    $(this).find('select').find('option').each(function(idx, obj){
      // obj가 선택되었다면 : 선택된 옵션이라면
      if(($obj).is(':selected')){ //각 option을 순회하다가 선택된 option이면 이 조건문을 수행
        var index = $(obj).index(); // option을 순회하다가 선택된 option을 발견하면 그 option의 index를 할당

        $(this).closest($selectBox).find('.selectList .option').removeClass('on'); //각 option(그 중 선택된 option)의 $selectBox(최상위 obj의 부모중 첫번째 .selectBoxWrap) 에서 자식중 .selecList .option에 클래스 on 삭제 :
        $(this).closest($selectBox).find('.selectList .option').eq(index).addClass('on'); // 각 option(그 중 선택된 option)의 $selectBox(최상위 obj의 부모중 첫번째 .selectBoxWrap) 에서 자식중 .selecList .option[선택된 option의 인덱스]에 클래스 on 추가
      }
    });

    //select option 정의
    // 각 .selectStyle의 자식중 각 .selectList .option의 idx, obj를 보내면서 함수 실행 : idx는 .option의 인덱스, obj는 .option 요소 그 자체
    $(this).find('.selectList .option').each(function(idx, obj){
      if($(obj).hasClass('on')){ // 각 .option중 클래스 on을 가지고 있다면
        $(obj).attr('data-selected', true); // 클래스 on을 가지고 있는 obj에 data-selected를 true로 할당
      } else { // 클래스 on이 없다면
        $(obj).attr('data-selected', false); // .option에 data-selected를 false로 할당
      }
    });

    // select가 disable일때
    // .selectStyle 의 자식 중 .selectBox(select)가 disable 상채라면
    if($(this).find('.selectBox').is(':disabled')){
      $(this).find('.selectResult').addClass('disabled'); // .selectStyle의 자식 중 .selectResult에 disable클래스 추가
      return; // 함수 끝냄
    }

    // select option이 disabled 일때
    // .selectStyle의 자식 중 .selectBox의 자식 각 옵션에 idx, obj전달하면서 함수 실행 : idx는 option의 인덱스, obj는 option 요소 그자체
    $(this).find('.selectBox').find('option').each(function(idx, obj){
      if((obj).is(':disabled')){
        var index = $(obj).index(); // disabled된 obj의 인덱스 할당
        $(this).closest($selectBox).find('.selectList .option').eq(index).addClass('disabled'); // .selectWrap의 자식 .selectList .optiopn중 디저블 된 옵션의 인덱스를 가진 애한테 클래스 disabled추가
        return;
      }
    });

    $selectBox.find('.selectResult').on({
      click : function(e){
        e.preventDefault();

        // 창 안쪽 높이 or 창의 높이 할당
        var windowInnerHeight = window.innerHeight || $(window).height();
        var $list = $(this).next('.selectList'); // .selectResult의 다음형제 .selectList할당
        var _this = $(this); // .selectResult

        // select disable일때
        if($(this).prev('.selectBox').is(':disabled')){
            $list.removeClass('on'); // .selectList에 클래스 on 삭제
            return;
        }

        // .selectList에 클래스 on이 있을때 : select가 disable이 아닐때
        if($list.hasClass('on')){
          // .selectList의 부모 header의 개수가 0 이상일때
          if($list.closest('#header').length > 0){
            $list.stop().slideUp(function(){ // .slideList의 이전 애니메이션이 동작중이면 멈추고 슬라이드업 애니메이션 함수 실행
              $list.removeClass('on').css({zIndex: 5}); // .selectList의 클래스 on을 삭제하고, z-index 5로 변경
              _this.removeClass('active'); // .slideResult에 클래스 active삭제
              $list.closest('.selectBoxWrap').removeAttr('style'); // .slideList에 style 속성 삭제
            });
            $list.closest('#header').removeClass('full'); // .sldeList 부모 중 #header에 클래스 full 삭제
          }
        } else {
          $('.selectStyle').find('.selectList').removeClass('on').hide().css({zIndex: 5}); // .selectStyle의 자식 중 .selectList에 클래스 on 을 지우고 display: none; 처리와 z-index:5 로 바꾸기
          if($list.closest('#header').length > 0){ // .selectList의 가까운 부모 #header의 개수가 0보다 크면
            $list.stop().slideDown().addClass('on').css({zIndex: 10}); // .slelectList에 이전 애니메이션을 멈추고 슬라이드다운 애니메이션 시작. 클래스 on붙이고 z-index: 10으로 바꾸기
            $list.closest('#header').addClass('full'); // .selectList 가까운 부모 #header에 클래스 full추가
          } else {
            $list.addClass('on').show().css({zIndex: 10}); // .selectList에 클래스 on추가하고 display:blodck, z-index:10으로 변경
          }
          $('.selectStyle').find('.selectResult').removeClass('active');
          $(this).addClass('active'); // this=.selectResult? .selectResult에 클래스 active추가
          $(this).closest('.selectBoxWrap').css({overflow : 'inherit'}); // .selectResult가까운 부모 중 .selectBoxWrap에 oveflo: hidden;으로 변경

          setTimeout(function(){
            if($list.find('option[data-selected=true]').length > 0){ // .selectList 의 자식중 data-delected=true인 option의 개수가 0개 보다 많으면
              $list.find('.option[data-selected=true] a').focus();
              //.option[data-selected=true] a에 포커스 주기
            }
          }, 0); // 0초후에 실행
        }

        // 위치체크
        if($(this).next('.selectList').hasClass('reversal')){
          $list.removeClass('reversal'); // .selectResult 다음형제 .selectList에 클래스 reversal이 있다면, .selectList에 클래스 reversal삭ㅈ[
        } else{
          if(windowInnerHeight > )
        }
      }
    });

  });
}