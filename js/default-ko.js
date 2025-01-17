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

}