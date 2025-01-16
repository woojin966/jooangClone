// Scroll End
var ignoreScroll = false;
var ns = (new Date).getTime();
var special = $.event.special;
var dispatch = $.event.handle || $.event.dispatch;
var scroll = 'scroll';
var scrollEnd = scroll + 'end';
var nsScrollEnd = scroll + '.' + scrollEnd + ns
special.scrollend = {
	delay : 300,
	setup : function(){
		var pid, handler = function(e){
			var _this = this, args = arguments;

			clearTimeout(pid);
			pid = setTimeout(function(){
				e.type = scrollEnd;
				dispatch.apply(_this, args);
			}, special.scrollend.delay);
		};

		$(this).on(nsScrollEnd, handler);
	},
	teardown : function(){
		$(this).off(nsScrollEnd);
	}
};

// Touch Prevent
function lockTouch(e){
	e.stopImmediatePropagation();
}

// is Mobile
function _isMobile(){
	var isMobile = (/iphone|ipod|android|blackberry|fennec/).test(navigator.userAgent.toLowerCase());
	return isMobile;
}

//make selectbox
function makeSelect(obj, fn) {
	if(obj.parent().hasClass("selectStyle")) {
		return false;
	}

	// 부모 감싸기
	obj.wrap('<div class="selectStyle"></div>');
	obj.after('<div class="selectList"></div>');

	$selectBox = obj.closest('.selectBoxWrap').eq(0);
	$selectBox.find('.selectStyle').each(function(){

		//select가 selected일때 a태그로 추출
		$(this).find('.selectBox').after('<a href="#" class="selectResult">'+$(this).find('.selectBox option:selected').text()+'</a>');

		if(_isMobile()) $(this).find('.selectList').width(obj.closest('.selectBoxWrap').eq(0).width() - 40);

		for(var i=0;i<=$(this).find('.selectBox option').length-1;i++){
			var value = $(this).find('.selectBox option').eq(i).attr('value');
			if(value) {
				if (value.substring(1, 5) == 'news') {
					value = ' href="'+value+'"';
				} else {
					value = ' href="#"  data-value="' + value + '"';
				}
			}else{
				value = ' href="#"';
			}
			$(this).find('.selectList').append('<div class="option"><a ' + value + ' >'+$(this).find('.selectBox option').eq(i).text()+'</a></div>');

		}

		//option에 selected 일때
		$(this).find('select').find('option').each(function(idx, obj){
			if($(obj).is(':selected')){
				var index = $(obj).index();

				$(this).closest($selectBox).find('.selectList .option').removeClass('on');
				$(this).closest($selectBox).find('.selectList .option').eq(index).addClass('on');
			}
		});

		// select option 정의
		$(this).find('.selectList .option').each(function(idx, obj){
			if($(obj).hasClass('on')){
				$(obj).attr('data-selected', true);
			}
			else{
				$(obj).attr('data-selected', false);
			}
		});

		//select가 disabled 일때
		if($(this).find('.selectBox').is(':disabled')){
			$(this).find('.selectResult').addClass('disabled');

			return;
		}

		//select option이 disabled 일때
		$(this).find('.selectBox').find('option').each(function(idx, obj){
			if($(obj).is(':disabled')){
				var index = $(obj).index();

				$(this).closest($selectBox).find('.selectList .option').eq(index).addClass('disabled');

				return
			}
		});

	});

	$selectBox.find('.selectResult').on({
		click : function(e){
			e.preventDefault();

			var windowInnerHeight = window.innerHeight || $(window).height();
			var $list = $(this).next('.selectList');
			var _this = $(this);

			//select가 disabled 일때
			if($(this).prev('.selectBox').is(':disabled')){
				$list.removeClass('on');

				return;
			}

			if($list.hasClass('on')){
				if($list.closest('#header').length > 0){
					$list.stop().slideUp(function(){
						$list.removeClass('on').css({zIndex: 5});
						_this.removeClass('active');
						$list.closest('.selectBoxWrap').removeAttr('style');
					});
					$list.closest('#header').removeClass('full');
				}
				else{
					$list.removeClass('on').hide().css({zIndex: 5});
					$(this).removeClass('active');
					$(this).closest('.selectBoxWrap').removeAttr('style');
				}
			}
			else{
				$('.selectStyle').find('.selectList').removeClass('on').hide().css({zIndex: 5});
				if($list.closest('#header').length > 0){
					$list.stop().slideDown().addClass('on').css({zIndex: 10});
					$list.closest('#header').addClass('full');
				}
				else{
					$list.addClass('on').show().css({zIndex: 10});
				}
				$('.selectStyle').find('.selectResult').removeClass('active');
				$(this).addClass('active');
				$(this).closest('.selectBoxWrap').css({overflow : 'inherit'});

				setTimeout(function(){
					if($list.find('.option[data-selected=true]').length > 0){
						$list.find('.option[data-selected=true] a').focus();
					}
				}, 0);
			}

			// 위치 체크
			if($(this).next('.selectList').hasClass('reversal')){
				$list.removeClass('reversal');
			}else{
				if(windowInnerHeight > $list.height() && $(this).offset().top + $(this).height() + $list.height() - $(window).scrollTop() > windowInnerHeight){
					$list.addClass('reversal');
				}else{
					$list.removeClass('reversal');
				}
			}

			// 타켓이 바깥일 경우
			$(document).off('click.closeEvent').on('click.closeEvent' , function(e){
				// option disabled 클릭시
				if($('div.option.disabled').length > 0) {
					if($(e.target).context.parentElement == $('div.option.disabled')[0]) {
						return;
					}
				}
				//if($(e.target).next(".selectList").size() == 0) {
				if($(e.target).next(".selectList").length == 0) {
					$('.selectList').removeClass('reversal');
					$('.selectList').removeClass('on').hide().css({zIndex: 5});
					$('.selectStyle .selectResult').removeClass('active');
					$('.selectStyle .selectResult').closest('.selectBoxWrap').removeAttr('style');
					$('.selectStyle .selectResult').closest('#header').removeClass('full');
				}
			});

			// 디자인 스크롤 삽입
			if($(this).closest('.historyArea').length > 0){
				if($(this).prev('.selectBox').find('option').length >= 5){
					$(this).next('.selectList').jScrollPane({
						mouseWheelSpeed : 100,
						animateScroll: true
					});
				}
			}
		}
	});
	$selectBox.find('.selectList .option a').on({
		click : function(e){
			if($(this).attr("href").substring(1,5) == "news") {
				wcs.event('NEWSROOM', $(this).text()+'(TOP)');
				document.location.href=$(this).attr("href");
			}
			e.preventDefault();

			// option이 disabled 일때
			if($(this).closest('.option').hasClass('disabled')){
				return;
			}

			var selectText = $(this).text();
		    var idx = $(this).closest('.option').index();

		    $(this).closest('.selectStyle').find('.selectResult').text(selectText);
			$(this).closest('.selectList').removeClass('reversal');
			$(this).closest('.selectBoxWrap').removeAttr('style');

		    var $selectStyle = $(this).closest('.selectStyle');

		    $(this).closest('.selectList').removeClass('on').hide().css({zIndex: 5});

		    //selected 초기화..
		    $selectStyle.find('selectBox option').prop('selected', false);
		    $selectStyle.find('.selectBox option').eq(idx).prop('selected' , 'selected');
			$selectStyle.find('.selectBox').trigger("change");
			$selectStyle.find('.selectList .option').attr({'data-selected': false}).removeClass('on');
			$(this).closest('.option').attr({'data-selected': true}).addClass('on');
		    $selectStyle.find('.selectResult').eq(0).focus();
		    $(this).closest('.selectStyle').find('.selectResult').focus();

		    fn && fn(); //callback

		}
	});
}

//make selectbox reFresh
function selectBoxReFresh(obj){
	var el;

	if (obj == null || obj == undefined || obj.length <= 0) {
		el = $('.selectBox');
	} else {
		el = $(obj);
	}

	$selectBox = el.closest('.selectBoxWrap');
	$selectBox.find('.selectStyle').each(function(){
		//select가 selected일때 a태그로 추출
		$(this).find('.selectResult').text($(this).find('.selectBox option:selected').text());

		$(this).find('.selectList').remove();
		$(this).find('.selectResult').after('<div class="selectList"></div>');
		$(this).find('.selectResult').removeClass('active');
		if(_isMobile()) $(this).find('.selectList').width($(this).closest('.selectBoxWrap').eq(0).width() - 40);

		for(var i=0;i<=$(this).find('.selectBox option').length-1;i++){
			var value = $(this).find('.selectBox option').eq(i).attr('value');

			if(value) {
				if (value.substring(1, 5) == 'news') {
					value = ' href="'+value+'"';
				} else {
					value = ' href="#"  data-value="' + value + '"';
				}
			}else{
				value = ' href="#"';
			}

			$(this).find('.selectList').append('<div class="option"><a ' + value + ' >'+$(this).find('.selectBox option').eq(i).text()+'</a></div>');

		}

		//option에 selected 일때
		$(this).find('select').find('option').each(function(idx, obj){
			if($(obj).is(':selected')){
				var index = $(obj).index();

				$(this).closest($selectBox).find('.selectList .option').removeClass('on');
				$(this).closest($selectBox).find('.selectList .option').eq(index).addClass('on');
			}
		});

		// select option 정의
		$(this).find('.selectList .option').each(function(idx, obj){
			if($(obj).hasClass('on')){
				$(obj).attr('data-selected', true);
			}
			else{
				$(obj).attr('data-selected', false);
			}
		});

		//select가 disabled 일때
		if($(this).find('.selectBox').is(':disabled')){
			$(this).find('.selectResult').addClass('disabled');

			return;
		}
		else{
			$(this).find('.selectResult').removeClass('disabled');
		}

		//select option이 disabled 일때
		$(this).find('.selectBox').find('option').each(function(idx, obj){
			if($(obj).is(':disabled')){
				var index = $(obj).index();
				$(this).closest($selectBox).find('.selectList .option').eq(index).addClass('disabled');

				return
			}
			else{
				$(this).closest($selectBox).find('.selectList .option').removeClass('disabled');
			}
		});

		$selectBox.removeAttr('style');

	});

	$selectBox.find('.selectList .option a').on({
		click : function(e){
			if($(this).attr("href").substring(1,5) == "news") {
				wcs.event('NEWSROOM', $(this).text()+'(TOP)');
				document.location.href=$(this).attr("href");
			}
			e.preventDefault();

			// option이 disabled 일때
			if($(this).closest('.option').hasClass('disabled')){
				return;
			}

			var selectText = $(this).text();
		    var idx = $(this).closest('.option').index();

		    $(this).closest('.selectStyle').find('.selectResult').text(selectText);
			$(this).closest('.selectList').removeClass('reversal');
			$(this).closest('.selectBoxWrap').removeAttr('style');

		    var $selectStyle = $(this).closest('.selectStyle');

		    $(this).closest('.selectList').removeClass('on').hide().css({zIndex: 5});

		    //selected 초기화..
		    $selectStyle.find('.selectBox option').prop('selected', false);
		    $selectStyle.find('.selectBox option').eq(idx).prop('selected' , 'selected');
			$selectStyle.find('.selectList .option').attr({'data-selected': false}).removeClass('on');
			$(this).closest('.option').attr({'data-selected': true}).addClass('on');
		    $selectStyle.find('.selectResult').eq(0).focus();
		    $(this).closest('.selectStyle').find('.selectResult').focus();

			$selectStyle.find('.selectBox').trigger("change");

		}
	});
}

// Responsive 이미지 변환
function ResponsiveImagesNew(){
	$(".imgResponsive").each(function(){
		var winW = window.innerWidth;
		if(winW > 768 && $(this).attr("data-media-type") != "pc"){
			var url = $(this).attr("data-src-pc");
			$(this).attr("data-media-type","pc");
			chgImg($(this),url,"pc");
		}
		if(winW <= 768 && $(this).attr("data-media-type") != "mobile"){
			var url = $(this).attr("data-src-mobile");
			$(this).attr("data-media-type","mobile");
			chgImg($(this),url,"mobile");
		}
	});

	function chgImg($target, url, type){
		$target.attr("src",url);
		$target.attr("data-media-type",type);
	}
}

// gnb
function gnb(dep1, className){
	var el = $('.navWrap');

	if(el.lengh >= 0 && !el.find('li').hasClass('on')){
		return;
	}

	if(className != 'main'){
		el.addClass('subpage');
	}

	el.find('li').eq(dep1-1).addClass('on');

	$('.wrap').addClass(className + 'Page');

	if(className == 'recruit'){
		$('#header').addClass('white');
		$('.utilWrap').addClass('white');
	}
}

// headerUI
function headerUI(){
	var header = $('#header');

	if(header.length <= 0){
		return;
	}

	$(window).off('scroll.headerScroll').on('scroll.headerScroll' , function(){
		var sct = $(this).scrollTop();

		if(sct >= header.outerHeight(true)){
			header.addClass('on');
		}
		else{
			header.removeClass('on');
		}
	}).trigger('.scroll.headerScroll');

}

// familySiteUI
function familySiteUI(){
	var el = $('.layerFamily');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	// Open
	$(document).on('click' , '.btnFamily', function(e){
		e.preventDefault();

		el.after('<div class="layerFamilyBg"></div');

		el.addClass('open');
		TweenMax.to(el.next('.layerFamilyBg') , 0.3 , {display : 'block' , opacity : 1});

		el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			$('html').addClass('closeHidden');
		});

		if($(this).closest('html').hasClass('ui-m')){
			document.addEventListener('touchmove' , lockTouch, false);

			el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
				$('html').css({height : $('.wrap').outerHeight(true)});
			});
		}
	});

	// Close
	el.find('.btnFamilyClose').on('click' , function(e){
		e.preventDefault();

		el.removeClass('open');
		$('html').removeClass('closeHidden');
		$('html').removeAttr('style');

		el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			el.next('.layerFamilyBg').stop().fadeOut(function(){
				$(this).remove();
			});
		});

		if($(this).closest('html').hasClass('ui-m')){
			el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
				document.removeEventListener('touchmove' , lockTouch, false);
			});
		}
	});
}

// allmenuUI
function allmenuUI(){
	var el = $('.layerAllmenu');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	// Open
	$(document).on('click' , '.btnAllmenu', function(e){
		e.preventDefault();

		el.after('<div class="layerAllmenuBg"></div');

		el.addClass('open');
		TweenMax.to(el.next('.layerAllmenuBg') , 0.3 , {display : 'block' , opacity : 1});
		document.addEventListener('touchmove' , lockTouch, false);

		el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			$('html').addClass('closeHidden');
			$('html').css({height : $('.wrap').outerHeight(true)});
		});
	});

	// Close
	el.find('.btnAllmenuClose').on('click' , function(e){
		e.preventDefault();

		el.removeClass('open');
		$('html').removeClass('closeHidden');
		$('html').removeAttr('style');

		el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			el.next('.layerAllmenuBg').stop().fadeOut(function(){
				$(this).remove();
			});
			document.removeEventListener('touchmove' , lockTouch, false);
		});
	});
}

// 레이어 팝업
function gfnOpenLayer(popupContent){
	var dscrollTop = $(document).scrollTop();
	var settings = {
		position : 'fixed',
		width : '100%',
		minHeight : '100%',
		top : 0,
		y : '100%'
	}

	TweenMax.set(popupContent, settings);
	popupContent.after('<div class="layerPhotoBg"></div');
	TweenMax.to(popupContent.next('.layerPhotoBg') , 0.3 , {display : 'block' , opacity : 1});
	popupContent.show();
	popupContent.find('.layerPhotoArea').attr('tabIndex' , -1).focus();
	popupContent.scrollTop(0);
	document.addEventListener('touchmove' , lockTouch, false);

	TweenMax.to(popupContent, 0.4, {
		y : '0%',
		onComplete : function() {
			popupContent.css({
				transform : 'initial'
			});
			$('.container').css({zIndex : 111});
			$('html').addClass('closeHidden');
			$('html').css({height : $('.wrap').outerHeight(true)});
			$('body').css({position : 'fixed'});
		}
	});

	// 레이어 닫기
	popupContent.find('.btnLayerClose').off('click.closeEvent').on('click.closeEvent', function(e){
		e.preventDefault();

		TweenMax.to($(this).closest(popupContent), 0.4, {
			y : '100%',
			onComplete : function() {
				$(this).closest(popupContent).removeAttr('style');
				$(this).closest(popupContent).find('.layerPhotoArea').removeAttr('style');
				popupContent.next('.layerPhotoBg').stop().fadeOut(function(){
					$(this).remove();
				});

				document.removeEventListener('touchmove' , lockTouch, false);
			}
		});

		$('html').removeClass('closeHidden');
		$('html').removeAttr('style');
		$('.container').css({zIndex : '20'});
		$('body').removeAttr('style');

		if(window.focusBtn){
			window.focusBtn.focus();
			$('html, body').scrollTop(dscrollTop);
		}

	});
}

// commUI
function commUI(){
	var wrap = $('.wrap');
	var footer = $('#footer');
	var lastScroll = 0;

	if(wrap.length <= 0){
		return;
	}

	$(document).off('scroll.commScroll touchmove.commScroll touchend.commScroll').on('scroll.commScroll touchmove.commScroll touchend.commScroll', function(){
		var sct = $(this).scrollTop();

		if(sct < lastScroll || sct == 0){ // 위
			if(sct + window.innerHeight < $('.container').offset().top + $('.container').height() ){
				wrap.addClass('scrollUp');
				wrap.removeClass('scrollDown');

				wrap.removeClass('footerHide');
			}
		}
		else{ // 아래
			wrap.removeClass('scrollUp');
			wrap.addClass('scrollDown');

			if(sct + window.innerHeight >= $('.container').offset().top + $('.container').height()){
				wrap.addClass('footerHide');
			}
		}

		if(sct == 0){
			wrap.closest('html.ui-m').find('.logo').addClass('hide');
		}
		else{
			wrap.closest('html.ui-m').find('.logo').removeClass('hide');
		}

		lastScroll = sct;
	}).trigger('scroll.commScroll').trigger('touchmove.commScroll').trigger('touchend.commScroll');

}

// mainUI
function mainUI(){
	var el = $('.main');
	var header = $('#header');
	var wrap = $('.wrap');
	var section = el.find('.section');
	var disScroll;
	var scrollInterval;
	var clearTimeout = null;
	var timeout = false;
	var scrolltop;
	var section1top;
	var timeNull = null;
	var isitMove = false;
	var mItemPos;

	if(el.length <= 0){
		return;
	}

	$.event.add(window,"load",function(){
		setTimeout(function(){
			el.find('.visualSlideBox').addClass('intro');

			setTimeout(function(){
				el.find('.visualSlideBox').addClass('introAfter');
			}, 1000);

		}, 300);

		$(window).scrollTop(0);
	});

	// 로드후 항상 상단으로 이동
	$(window).on('beforeunload', function() {
		$(window).scrollTop(0);
    });

	// setting
	el.css({minHeight : el.find('.sectionWrap').outerHeight(true)});
	el.find('.sectionWrap').addClass('fixed');

	if(window.innerWidth >= 1920 || window.innerWidth > 1280){
		el.find('.mainFixedMotion .thumb').css({
			height : window.innerWidth * (1380/1440) + 1460
		});
	}
	else if(window.innerWidth <= 1280 && window.innerWidth >= 1024){
		el.find('.mainFixedMotion .thumb').css({
			height : 'calc(' + window.innerWidth * (1380/1440) + 'px + 101.38vw)'
		});
	}

	// Title Navi
	header.find('.titNavBox h2.titleNav').append('<div class="navBox txtLine"></div>');
	header.find('.titNavBox h2.titleNav').append('<div class="selectBoxWrap txtLine"></div>');
	header.find('.titNavBox h2.titleNav .selectBoxWrap').append('<select class="selectBox"></select>');
	el.find('.mainFixedMotion').find('.section').each(function(idx, obj){
		var menu = $(obj).attr('data-page-name');

		header.find('.titNavBox h2.titleNav .navBox').append('<a href="#'+menu+'" class="nav"><span>'+ menu +'</span></a>');
		header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="'+ menu +'">' + menu + '</option>');
	});

	header.find('.titNavBox').find('h2.titleNav .nav').eq(0).addClass('on');

	var lastScroll = 0;
	var evtListeners;
	$(document).off('scroll.sectionScroll').on('scroll.sectionScroll', function(e){
		evtListeners = e;

		if(ignoreScroll){
			return;
		}

		disScroll = true;
	}).trigger('scroll.sectionScroll');

	clearInterval(scrollInterval);
	scrollInterval = setInterval(function(){
		if(disScroll){
			scrollDone();
			disScroll = false;
		}
	}, 10);

	function scrollDone(){
		var winH = window.innerHeight;
		var sct = $(window).scrollTop();

		if(sct > 0){
			el.find('.keyVisual').addClass('scrollAfter');

			//$('.ui-m #header h1.logo').addClass('white');
			//$('.utilWrap').addClass('white');

			el.find('.visualSlideBox .visualSlideInner li').each(function(idx, obj){
				if($(obj).hasClass('on')){
					$(obj).addClass('active');
				}
				else{
					$(obj).removeClass('active');
				}
			});

			// setting
			$(window).off('resize.mainResizeNext').on('resize.mainResizeNext' , function(){
				if($('html').hasClass('ui-w')){
					el.find('.keyVisual .thumb').css({
						height : window.innerWidth * (1380/1440)
					});
				}
				el.find('.keyVisual .visualSlideBox .visualSlideInner').height(el.find('.keyVisual .beforeBox').outerHeight(true) + window.innerWidth * (1380/1440) * 0.122 + 1);
				el.find('.keyVisual .visualSlideBox').css({paddingTop : window.innerHeight - (el.find('.keyVisual .keyText').outerHeight(true) + el.find('.keyVisual .visualSlideInner').outerHeight(true))});
				mItemPos = el.find('.visualSlideBox .visualSlideInner').position().top;
				if($('html').hasClass('ui-w')){
					if(window.innerWidth >= 1920){
						el.find('.keyVisual.scrollAfter .afterBox').css({'transform' : 'translateY('+ (-mItemPos + 245) + 'px)'});
						el.find('.keyVisual.scrollAfter .thumb').css({'transform' : 'translateX(-637px) translateY('+ (-mItemPos + 460) + 'px)'});
					}
					else if(window.innerWidth <= 1280 && window.innerWidth >= 1024){
						el.find('.keyVisual.scrollAfter .afterBox').css({'transform' : 'translateY(calc('+ -mItemPos +'px + 17.36vw)'});
						el.find('.keyVisual.scrollAfter .thumb').css({'transform' : 'translateX('+ -el.find('.keyVisual').offset().left +'px) translateY(calc('+ -mItemPos +'px + 31.94vw)'});
					}
					else{
						el.find('.keyVisual.scrollAfter .afterBox').css({'transform' : 'translateY('+ (-mItemPos + 245) + 'px)'});
						el.find('.keyVisual.scrollAfter .thumb').css({'transform' : 'translateX('+ -el.find('.keyVisual').offset().left +'px) translateY('+ (-mItemPos + 460) + 'px)'});
					}
				}
				else{
					el.find('.keyVisual.scrollAfter .afterBox').css({'transform' : 'translateY(calc('+ -mItemPos +'px + 24.33vw)'});
					el.find('.keyVisual.scrollAfter .thumb').css({'transform' : 'scale(1) translateX(-26.66vw) translateY(calc('+ -mItemPos +'px + 41.33vw)'});
				}

				el.find('.keyVisual .rep .thumb').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd' , function(){
					el.find('.keyVisual .visualSlideBox .visualSlideInner li').not('.rep').css({marginTop : el.find('.keyVisual .rep .thumb').offset().top});
				});
				el.css({minHeight : el.find('.sectionWrap').outerHeight(true)});
			}).trigger('resize.mainResizeNext');

			el.find('.keyVisual.scrollAfter .afterBox').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd' , function(){
				$('.wrap').off("touchmove.evtTouch");
			});
		}
		else{
			el.find('.visualSlideBox').addClass('intro');
			el.find('.keyVisual').removeClass('scrollAfter');
			el.find('.keyVisual').removeClass('start');
			el.find('.keyVisual').removeAttr('style');
			el.find('.keyVisual .visualSlideInner li').removeAttr('style');
			el.find('.keyVisual .thumb').removeAttr('style');
			el.find('.visualSlideBox .visualSlideInner li').not(':first-child').removeClass('on');
			el.find('.visualSlideBox .visualSlideInner li').removeClass('active noTransition');
			el.find('.value').removeAttr('style');

			el.find('.keyVisual').css("opacity", 1);
			el.find('.mainFixedMotion').css("opacity", 0);
			el.find('.mainFixedMotion').find('.section').removeClass('activeFixed').removeClass('activeMotion').removeClass('activeMotionNone');

			//$('.ui-m #header h1.logo').removeClass('white');
			//$('.utilWrap').removeClass('white');

			// setting
			$(window).off('resize.mainResizePrev').on('resize.mainResizePrev' , function(){
				if($('html').hasClass('ui-w')){
					el.find('.keyVisual .thumb').css({
						height : window.innerWidth * (1380/1440)
					});
				}
				el.find('.keyVisual .visualSlideBox .visualSlideInner').height(el.find('.keyVisual .beforeBox').outerHeight(true) + window.innerWidth * (1380/1440) * 0.122 + 1);
				el.find('.keyVisual .visualSlideBox').css({paddingTop : window.innerHeight - (el.find('.keyVisual .keyText').outerHeight(true) + el.find('.keyVisual .visualSlideInner').outerHeight(true))});
				el.css({minHeight : el.find('.sectionWrap').outerHeight(true)});
			}).trigger('resize.mainResizePrev');

			header.find('.titNavBox').find('.navBox').removeClass('on');
			el.find(".sectionWrap").addClass("fixed");

			$('.wrap').on("touchmove.evtTouch" , function(e){
				e.preventDefault();

				bindEvents();
			});
		}

		section.filter('.keyVisual').find('.visualSlideInner li').not(':first-child').each(function(idx, obj){
			var idxSec;
			if(section.filter('.keyVisual').hasClass('scrollAfter')){
				$(obj).removeClass('noTransition');
				if(sct < lastScroll){
					// 위
					if(winH + sct <= $(obj).find('.afterBox').offset().top){
						$(obj).removeClass('on active');
						$(obj).addClass('noTransition');

						// Title Navi
						idxSec = el.find('.section.keyVisual .visualSlideInner li.active').last().index();

						header.find('.titNavBox h2.titleNav .nav').removeClass('on');
						header.find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
						if(idxSec != -1){
							header.find('.titNavBox h2.titleNav .nav').eq(idxSec).addClass('on');
							header.find('.titNavBox h2.titleNav select.selectBox option').eq(idxSec).prop('selected' , true);
						}4
					}
				}
				else{
					// 아래
					if(winH + sct >= $(obj).find('.thumb').offset().top){
						$(obj).addClass('on active');

						// Title Navi
						idxSec = $(obj).index();

						header.find('.titNavBox h2.titleNav .nav').removeClass('on');
						header.find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
						if(idxSec != -1){
							header.find('.titNavBox h2.titleNav .nav').eq(idxSec).addClass('on');
							header.find('.titNavBox h2.titleNav select.selectBox option').eq(idxSec).prop('selected' , true);
						}
					}
				}
			}
		});

		section.each(function(idx, obj){
			if($('html').hasClass('ui-w')){
				if(winH + sct >= $(obj).offset().top + (winH/1.5)){
					if(sct < $(obj).offset().top + ($(obj).outerHeight(true)/1.5)){
                        $(obj).addClass('active');
						if($(obj).hasClass("value") && !$(obj).hasClass("scroll")){
                            $(obj).addClass("scroll");
							$("body,html").animate({scrollTop : $(obj).offset().top},500);
						}

						$(obj).filter('.value').find('.valueList li').eq(0).addClass('on');
						$(obj).filter('.value').find('.valueList li').eq(0).find('.line').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
							$(obj).filter('.value').find('.valueList li').eq(1).addClass('on');
						});
					}
				}
				else{
					$(obj).removeClass('active');
                    $(obj).removeClass("scroll");
					$(obj).filter('.value').find('.valueList li').removeClass('on');
				}
			}
			else{
				if(winH + sct >= $(obj).offset().top + (winH/3)){
					if(sct < $(obj).offset().top + ($(obj).outerHeight(true)/3)){
						$(obj).addClass('active');
                        if($(obj).hasClass("value") && !$(obj).hasClass("scroll")){
                            $(obj).addClass("scroll");
                            $("body,html").animate({scrollTop : $(obj).offset().top},500);
                        }

						$(obj).filter('.value').find('.valueList li').eq(0).addClass('on');
						$(obj).filter('.value').find('.valueList li').eq(0).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
							$(obj).filter('.value').find('.valueList li').eq(1).addClass('on');
						});
					}
				}
				else{
					$(obj).removeClass('active');
                    $(obj).removeClass("scroll");
					$(obj).filter('.value').find('.valueList li').removeClass('on');
				}
			}

		});

		if(sct < lastScroll){
			// 위
			if(sct <= el.find('.mainFixedMotion').offset().top + el.find('.mainFixedMotion').outerHeight(true) - 100){
				if(sct <= 0){
					header.find('.titNavBox').find('.navBox').removeClass('on');
					header.find('.titNavBox').find('.selectBoxWrap').removeClass('on');
				}
				else{
					header.find('.titNavBox').find('.navBox').addClass('on');
					header.find('.titNavBox').find('.selectBoxWrap').addClass('on');
				}
			}

			if(sct + (header.position().top - header.height()) <= el.find('.keyVisual .thumb').offset().top){
				//$('.ui-w').find(header).removeClass('white');
			}
		}
		else{
			// 아래
			if(sct + window.innerHeight >= el.find('.section.value').offset().top + (el.find('.section.value').height() / 3)){
				header.find('.titNavBox').find('.navBox').removeClass('on');
				header.find('.titNavBox').find('.selectBoxWrap').removeClass('on');
			}
			else{
				if(sct <= 0){
					header.find('.titNavBox').find('.navBox').removeClass('on');
					header.find('.titNavBox').find('.selectBoxWrap').removeClass('on');
				}
				else{
					header.find('.titNavBox').find('.navBox').addClass('on');
					header.find('.titNavBox').find('.selectBoxWrap').addClass('on');
				}
			}
			if(sct + (header.position().top - header.height()) > el.find('.keyVisual .thumb').offset().top){
				//$('.ui-w').find(header).addClass('white');
			}
		}

		if(sct + window.innerHeight > el.find('.keyVisual').find('.thumb').offset().top + el.find('.keyVisual').find('.thumb').outerHeight(true) + header.find('.logo ').outerHeight(true)){
			//$('.ui-m').find(header).find('h1.logo').removeClass('white');
			//$('.utilWrap').removeClass('white');
		}
		else{
			if(sct != 0){
				//$('.ui-m #header h1.logo').addClass('white');
				//$('.utilWrap').addClass('white');
			}
		}

		if(evtListeners.type != 'touchend'){
			selectBoxReFresh('#header .selectBox');
		}

		lastScroll = sct;
	}

	bindEvents();

	function bindEvents(){
		scrollReady = true;
		setupScrollHandler();
	}

	var wheelLock = false;
	var isit = false;
	function setupScrollHandler() {
		$(".wrap").on("mousewheel", function(delta, aS, aQ, deltaY){
			if ( wheelLock ) return false;

			scrolltop = $(window).scrollTop();

			if (deltaY > 0) {
				scrollPrev();
				if(!scrollReady) return false;
			} else {
				scrollNext();
				if(!scrollReady) return false;
			}
		});

		var lastY;
		$('.wrap').on("touchmove.evtTouch", function(e){
			e.preventDefault();
			if ( wheelLock ) return false;

			scrolltop = $(window).scrollTop();

			var currentY = e.originalEvent.touches[0].clientY;

			if(currentY > lastY){
				scrollPrev();
				if(!scrollReady) return false;
			}else if(currentY < lastY){
				 scrollNext();
				if(!scrollReady) return false;
			}

			lastY = currentY;
		});
	}

	function scrollPrev() {
		if( scrolltop <= 10+1  && scrollReady == true ) { // Up
			performScroll(0,1);
		}
	}

	function scrollNext() {
		if(scrolltop == 0 && scrollReady == true ) { // Down
			performScroll(10,0);
		}

	}

	function performScroll(newYPos,newOpa) {
		scrollReady = false;

		$("html, body").stop().animate({scrollTop: newYPos },350 , 'swing' ,
			function(){
				if(newOpa == 0){ // Down
					//$(window).scrollTop(1);
				}
				else{ // Up
					//$(window).scrollTop(0);
				}

				scrollReady = true;
			}
		)
	}

	// 슬라이드 클릭
	$(document).on('click' , '#header .titNavBox h2.titleNav .nav:not(".on")',function(e){
		e.preventDefault();

		var idx = $(this).index();

		ignoreScroll = true;

		if(idx == 0){
			secOffsetPos(1 , true);
		}
		else{
			secOffsetPos(el.find('.mainFixedMotion .section').eq(idx).attr('data-pos'), true);
		}

	});

	// 셀렉트
	header.find('.titNavBox h2.titleNav .selectBox').on('change' , function(e){
		var idx = $(this).find('option').index($(this).find('option:selected'));

		ignoreScroll = true;

		if(idx == 0){
			secOffsetPos(1 , true);
		}
		else{
			secOffsetPos(el.find('.mainFixedMotion .section').eq(idx).attr('data-pos'), true);
		}

	});

	// secOffsetPos
	function secOffsetPos(cnt , state){
		if(state == true){
			$('body, html').stop().animate({
				scrollTop : cnt
			}, function(){
				ignoreScroll = false;
			});
		}
		else{
			$(window).scrollTop(cnt);
		}
	}

	// 비쥬열 여백 상단
	checkScreenRatio();
	$(window).resize(function(){
		checkScreenRatio();
	});

	function checkScreenRatio(){
		var screenRatio = window.innerWidth/window.innerHeight;

		if(screenRatio > 0.45){
			!$("html").hasClass("screenRatio45") && $("html").addClass("screenRatio45");
		}
		else{
			$("html").hasClass("screenRatio45") && $("html").removeClass("screenRatio45");
		}
	}
}

// aboutUI
function aboutUI(){
	var el = $('.about');
	var header = $('#header');
	var scrollInterval;
	var disScroll;

	if(el.length <= 0){
		return;
	}

	// Title Navi
	header.find('.titNavBox h2.titleNav').append('<div class="navBox txtLine"></div>');
	header.find('.titNavBox h2.titleNav').append('<div class="selectBoxWrap txtLine"></div>');
	header.find('.titNavBox h2.titleNav .selectBoxWrap').append('<select class="selectBox"></select>');
	el.find('.aboutWrap').find('.section').each(function(idx, obj){
		var menu = $(obj).attr('id');

		if(menu == 'coreValue'){
			menu = 'Core Value';
		}

		if(menu == 'ceo'){
			menu = 'CEO';
		}

		header.find('.titNavBox h2.titleNav .navBox').append('<a href="#'+menu+'" class="nav"><span>'+ menu +'</span></a>');
		header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="'+ menu +'">' + menu + '</option>');

		// 예외처리
		if(header.find('.titNavBox h2.titleNav .nav').eq(1).attr('href') == '#Core Value' || header.find('.titNavBox h2.titleNav select.selectBox option').eq(1).attr('value') == '#Core Value'){
			header.find('.titNavBox h2.titleNav .nav').eq(1).attr('href' , '#coreValue');
			header.find('.titNavBox h2.titleNav select.selectBox option').eq(1).prop('value' , 'coreValue');
		}
		if(header.find('.titNavBox h2.titleNav .nav').eq(2).attr('href') == '#CEO' || header.find('.titNavBox h2.titleNav select.selectBox option').eq(2).attr('value') == '#CEO'){
			header.find('.titNavBox h2.titleNav .nav').eq(2).attr('href' , '#ceo');
			header.find('.titNavBox h2.titleNav select.selectBox option').eq(2).prop('value' , 'ceo');
		}
	});

	// select refresh
	selectBoxReFresh('#header .selectBox');

	var lastScroll = 0;
	var ignoreScroll = false;
	var evtListeners;
	$(window).off('scroll.aboutScroll touchmove.aboutScroll touchend.aboutScroll').on('scroll.aboutScroll touchmove.aboutScroll touchend.aboutScroll' , function(e){

		evtListeners = e;

		if(ignoreScroll){
			return;
		}

		disScroll = true;

	}).trigger('scroll.aboutScroll').trigger('touchmove.aboutScroll').trigger('touchend.aboutScroll');

	clearInterval(scrollInterval);
	scrollInterval = setInterval(function(){
		if(disScroll){
			scrollDone();
			disScroll = false;
		}
	}, 250);

	// 섹션 활성화
	function scrollDone(){
		var sct = $(window).scrollTop();

		if(sct >= el.find('.section').eq(0).find('.missionChr').offset().top - 1){
			header.find('.titNavBox').find('.navBox').addClass('on');
			header.find('.titNavBox').find('.selectBoxWrap').addClass('on');
		}
		else{
			header.find('.titNavBox').find('.navBox').removeClass('on');
			header.find('.titNavBox').find('.selectBoxWrap').removeClass('on');
		}

		//if(sct < lastScroll){
		//	// 위
		//	header.find('.titNavBox').find('.navBox').addClass('on');
		//
		//	if(sct < el.find('.section').eq(0).find('.missionChr').offset().top - 1){
		//		header.find('.titNavBox').find('.navBox').removeClass('on');
		//	}
		//}
		//else{
		//	// 아래
		//	header.find('.titNavBox').find('.navBox').removeClass('on');
		//}

		el.find('.aboutWrap .section').each(function(idx, obj){
			if(sct < lastScroll){
				// 위
				if(sct <= ($(obj).offset().top + $(obj).outerHeight(true))){
					if(sct < $(obj).offset().top - 1){
						if(sct >= 0){
							$(obj).removeClass('active');
							el.find('.history').find('.photoLayer').removeAttr('style');
						}
					}
					else{
						el.find('.section').removeClass('active');
						$(obj).addClass('active');
					}
				}
			}
			else{
				// 아래
				if(sct >= $(obj).offset().top - 1){
					if(sct >= $(obj).offset().top + $(obj).outerHeight(true)){
						$(obj).removeClass('active');
						el.find('.history').find('.photoLayer').removeAttr('style');
					}
					else{
						el.find('.section').removeClass('active');
						$(obj).addClass('active');
					}
				}
			}
		});

		// Title Navi
		var idxSec = el.find('.section.active').index();

		header.find('.titNavBox h2.titleNav .nav').removeClass('on');
		header.find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
		if(idxSec != -1){
			header.find('.titNavBox h2.titleNav .nav').eq(idxSec).addClass('on');
			header.find('.titNavBox h2.titleNav select.selectBox option').eq(idxSec).prop('selected' , true);
		}

		// 배경 전환
		if(sct >= el.find('.section.ceo').offset().top && sct <= el.find('.section.ceo').offset().top + el.find('.section.ceo').outerHeight(true)){
			if(sct < el.find('.section.coreValue').offset().top + el.find('.section.coreValue').outerHeight(true) - 10){
				header.removeClass('white');
				$('.utilWrap').removeClass('white');
			}
			else{
				header.addClass('white');
				$('.utilWrap').addClass('white');
			}
		}
		else{
			header.removeClass('white');
			$('.utilWrap').removeClass('white');
		}

		if(evtListeners.type != 'touchend'){
			selectBoxReFresh('#header .selectBox');
		}

		lastScroll = sct;
	}

	// History
	el.find('.history .historyList .list li').each(function(idx, obj){
		if($(obj).find('.photoLayer').length >= 1){
			$(obj).addClass('photoBeing');
		}
	});

	el.find('.history .historyList').each(function(idx, obj){
		if($(obj).find('li .photoLayer').length <= 0){
			$(obj).find('.list').addClass('noSpace');
		}
	});

	el.find('.history').find('.selectBoxWrap select').on('change' , function(){
		var val = $(this).val();

		el.find('.history').find('.historyList.past').stop().fadeIn();
		el.find('.history .btnHistoryMore').stop().fadeOut();
		el.find('.history .historyList').each(function(idx, obj){
			if($(obj).data('year') == val){
				if($('html').hasClass('ui-m')){
					$('body, html').stop().animate({
						scrollTop : $(obj).offset().top - $('#header').outerHeight(true) - 20
					});
				}
				else{
					$('body, html').stop().animate({
						scrollTop : $(obj).offset().top - $('#header').position().top - el.find('.section.history .historyList .year').outerHeight(true)
					});
				}
			}
		});
	});

	// 이미지 호버
	el.find('.history .historyList .list li').on('mousemove' , function(e){
		var posX = e.clientX + 2;
		var posY = e.clientY + 2;

		if($(this).closest('.historyList').index() % 2 != 0){
			//$(this).find('.photoLayer').css({left : posX - $(this).find('.photoLayer').width()  , top : posY , position : 'fixed'});
		}
		else{
			//$(this).find('.photoLayer').css({left : posX , top : posY , position : 'fixed'});
		}
	});

	// history More
	var num = 0;
	el.find('.history .btnHistoryMore').on('click' , function(e){
		e.preventDefault();

		num = num + 8;

		$(this).closest('.history').find('.historyList.past').slice(0, num).stop().fadeIn();

		if(num >= el.find('.history .historyList.past').length){
			$(this).stop().fadeOut();
		}
	});

	// history scroll fixed
	$(window).off('scroll.historyScroll').on('scroll.historyScroll' , function(){
		var sct = $(this).scrollTop();
		var historyPos = el.find('.section.history').find('.subTit').position().top + el.find('.section.history').find('.subTit').outerHeight(true)/2;
		if($('html').hasClass('ui-m')){
			historyPos = el.find('.section.history .historyArea').position().top;
		}

		// history Year Fixed
		if($('html').hasClass('ui-w')){
			if(sct >= historyPos && sct <= el.find('.section.affiliate').offset().top - el.find('.section.history .btnMoreArea').outerHeight(true)){
				//el.find('.history .historyArea').addClass('fixed');
			}
			else{
				//el.find('.history .historyArea').removeClass('fixed');
			}
		}
		else{
			if(sct + header.height() >= historyPos && sct + header.height() <= el.find('.section.affiliate').offset().top - el.find('.section.history .btnMoreArea').outerHeight(true)){
				//el.find('.history .historyArea').addClass('fixed');
			}
			else{
				//el.find('.history .historyArea').removeClass('fixed');
			}
		}

	}).trigger('scroll.historyScroll');

	// 섹션 이동
	$(document).on('click' , '#header .titNavBox h2.titleNav .nav', function(e){
		e.preventDefault();

		var sec = $(this).attr('href').split('#')[1];
		var secPos = el.find('.section.' + sec).offset().top + 1;

		if(sec == 'mission'){
			secPos = el.find('.section.' + sec).find('.missionChr').offset().top + 1;
		}

		ignoreScroll = true;

		$('body, html').stop().animate({
			scrollTop : secPos
		}, function(){
			ignoreScroll = false;
		});
	});

	// 모바일 셀렉트 섹션 이동
	$(document).on('change' , '#header .titNavBox select.selectBox' , function(){
		var sec = $(this).val();
		var secPos = el.find('.section.' + sec).offset().top + 1;

		if(sec == 'mission'){
			secPos = el.find('.section.' + sec).find('.missionChr').offset().top + 1 - header.outerHeight(true);
		}

		ignoreScroll = true;

		$('body, html').stop().animate({
			scrollTop : secPos
		}, function(){
			ignoreScroll = false;
		});
	});
}

// brandUI
function brandUI(){
	var el = $('.brand');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	// setting
	//el.height(el.find('#contents').outerHeight(true));

	// title Navi
	header.find('.titNavBox h2.titleNav').append('<div class="navBox txtLine"></div>');
	header.find('.titNavBox h2.titleNav').append('<div class="selectBoxWrap txtLine"></div>');
	header.find('.titNavBox h2.titleNav .selectBoxWrap').append('<select class="selectBox"></select>');
	el.find('.brandWrap .section').each(function(idx, obj){
		var menu = $(obj).attr('id');

		header.find('.titNavBox h2.titleNav .navBox').append('<a href="#'+menu+'" class="nav"><span>'+ menu +'</span></a>');
		header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="'+ menu +'">' + menu + '</option>');
	});

	// 타이틀 정의
	el.find('.brandWrap .keyVisual .name').hide();
	var posArr = new Array();
	var brandHeight = 0;
	$.event.add(window,"load",function(){
		el.find('.section').each(function(idx, obj){
			var firstPos = $(obj).find('.keyVisual').offset().top;
			var endPos = firstPos + $(obj).find('.keyVisual').height();

			posArr.push($(obj).offset().top);
			brandHeight = brandHeight + $(obj).outerHeight(true);

			for(var i=0 ; i < posArr.length; i++){
				$(obj).attr('data-pos' , posArr[i]);
			}
			 $(obj).find('.keyVisual .name').show();

			if($('html').hasClass('ui-m')){ // 모바일일 경우
				$(obj).find('.keyVisual .name').attr('data-' + firstPos , 'font-size:18.13vw;padding-top:0vw');
				if(idx == 2 || idx == 3){
					$(obj).find('.keyVisual .name').attr('data-' + firstPos , 'font-size:20.13vw;padding-top:0vw');
				}
				$(obj).find('.keyVisual .name').attr('data-' + endPos , 'font-size:10.13vw;padding-top:12.15vw');
			}
			else{
				if(window.innerWidth > 1280){
					$(obj).find('.keyVisual .name').attr('data-' + (firstPos+100) , 'font-size:260px;padding-top:0px');
					if(idx == 2 || idx == 3){
						$(obj).find('.keyVisual .name').attr('data-' + (firstPos+100) , 'font-size:300px;padding-top:0px');
					}
					$(obj).find('.keyVisual .name').attr('data-' + endPos , 'font-size:72px;padding-top:175px');
				}
				else{
					$(obj).find('.keyVisual .name').attr('data-' + (firstPos+50) , 'font-size:18.05vw;padding-top:0vw');
					if(idx == 2 || idx == 3){
						$(obj).find('.keyVisual .name').attr('data-' + (firstPos+50) , 'font-size:20.83vw;padding-top:0vw');
					}
					$(obj).find('.keyVisual .name').attr('data-' + endPos , 'font-size:5vw;padding-top:12.15vw');
				}
			}
		});

		$(".brandWrap").height(brandHeight)
		$(".brandWrap").addClass("fixed");
		header.find('.titNavBox h2.titleNav .navBox').addClass('on');
		header.find('.titNavBox h2.titleNav .selectBoxWrap').addClass('on');

		s.refresh();

		// 스크롤탑
		var winTop = 0;
		if(window.location.href.split('#')[1] != null){
			winTop = parseInt($('#' + window.location.href.split('#')[1]).attr('data-pos'));
			winTop = winTop + 1
		}

		$(window).scrollTop(winTop);
	});

	var lastScroll = 0;
	var brandActive = 0;
	var evtListeners;
	var ignoreScroll = false;
	$(window).off('scroll.brandScroll touchmove.brandScroll touchend.brandScroll').on('scroll.brandScroll touchmove.brandScroll touchend.brandScroll' , function(e){
		var sct = $(window).scrollTop();
		evtListeners = e;

		el.find('.brandWrap .section').each(function(idx, obj){
			if(sct < lastScroll){
				// 위
				if(sct <= posArr[idx] - 1){
					brandActive = idx;
					$(obj).removeClass('active').removeAttr("style");
				}

				if(sct < parseInt($(obj).attr('data-pos')) + $(obj).find('.keyVisual').height() + el.find('.section.newspaper').find('.bg').offset().top){
						$(obj).find('.keyVisual .name').css({position : '' , top : ''});
					}
			}
			else{
				// 아래
				if(sct >= posArr[idx] - 1){
					$(obj).addClass('active');
					$(obj).css('top', posArr[idx]);
					brandActive = idx;
				}

				if(sct >= parseInt($(obj).attr('data-pos'))+ $(obj).find('.keyVisual').height() + el.find('.section.newspaper').find('.bg').offset().top){
					$(obj).find('.keyVisual .name').css({position : 'absolute' , 'top' : el.find('.section.newspaper').find('.bg').offset().top + el.find('.section.newspaper').find('.bg').height()});
				}
			}
		});

		if(ignoreScroll){
			return;
		}

		// Title Navi
		var idxSec = el.find('.section.active').last().index();

		header.find('.titNavBox h2.titleNav .nav').removeClass('on');
		header.find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
		if(idxSec != -1){
			header.find('.titNavBox h2.titleNav .nav').eq(idxSec).addClass('on');
			header.find('.titNavBox h2.titleNav select.selectBox option').eq(idxSec).prop('selected' , true);
		}

		if(evtListeners.type != 'touchend'){
			selectBoxReFresh('#header .selectBox');
		}

		lastScroll = sct;

	}).trigger('scroll.brandScroll').trigger('touchmove.brandScroll').trigger('touchend.brandScroll');

	// 이미지 클릭
	var idxImg = 0;
	var photoIdx = 0;

	el.find('.ImagesGallery').each(function(idx,obj){
		$(obj).prepend('<div class="space"></span>');
	});

	el.find('.ImagesGallery .ImagesGallery-image').on('click' , function(e){
		e.preventDefault();

		idxImg = idxImg + 1;
		$(this).css({'z-index' : 10 + idxImg});

		photoIdx = $(this).index();
	});

	el.find('.ImagesGallery .space').on('click' , function(e){
		e.preventDefault();
		idxImg = idxImg + 1;

		 photoIdx = photoIdx + 1;

		 if(photoIdx >= $(this).closest('.ImagesGallery').find('.ImagesGallery-image').length ){
			photoIdx = 0;
		}

		$(this).closest('.ImagesGallery').find('.ImagesGallery-image').eq(photoIdx).css({'z-index' : 10 + idxImg});
	});

	el.find('.ImagesGallery .btnGallery').on('click' , function(e){
		e.preventDefault();

		idxImg = idxImg + 1;

		if($(this).hasClass('next')){
			 photoIdx = photoIdx + 1;

			 if(photoIdx >= $(this).closest('.ImagesGallery').find('.ImagesGallery-image').length ){
				photoIdx = 0;
			}
		}
		else{
			photoIdx = photoIdx - 1;

			 if(photoIdx < 0){
				photoIdx = $(this).closest('.ImagesGallery').find('.ImagesGallery-image').length - 1;
			}
		}

		$(this).closest('.ImagesGallery').find('.ImagesGallery-image').eq(photoIdx).css({'z-index' : 10 + idxImg});
	});

	// 섹션 이동
	$(document).on('click' , '#header .titNavBox h2.titleNav .nav', function(e){
		e.preventDefault();

		var sec = $(this).attr('href').split('#')[1];
		var secPos = $('.section.' + sec).attr('data-pos');

		ignoreScroll = true;

		secOffsetPos(secPos,  true);
	});

	// 모바일 셀렉트 섹션 이동
	$(document).on('change' , '#header .titNavBox select.selectBox' , function(){
		var sec = $(this).val();
		var secPos = el.find('.section.' + sec).attr('data-pos');

		ignoreScroll = true;

		secOffsetPos(secPos, true);
	});

	// secOffsetPos
	function secOffsetPos(cnt , state){
		if(state == true){
			$('body, html').stop().animate({
				scrollTop : cnt
			}, 500, function(){
				ignoreScroll = false;
			});
		}
		else{
			$(window).scrollTop(cnt);
		}
	}
}

// shareUI
function shareUI(){
	var el = $('.share');
	var header = $('#header');
	var timeout = false;
	var scrolltop;
	var section1top;
	var timeNull = null;

	if(el.length <= 0){
		return;
	}

	$.event.add(window,"load",function(){
		if($('html').hasClass('ui-m')){ // 모바일일 경우
			el.find('.shareKey').attr('data-start' , 'margin-bottom:40vw');
			el.find('.shareKey .shareKeyArea .thumb').attr('data-start' , 'transform:scale(0.5932) translateY(0vw);transform-origin:center 50%');
			el.find('.shareKey .shareKeyArea .thumb').attr('data-600' , 'transform:scale(1) translateY(-55.05vw);transform-origin:center 0%');
			el.find('.shareKey .shareKeyArea .txtBox').attr('data-start' , 'transform: translateY(42.66vw);');
			el.find('.shareKey .shareKeyArea .txtBox').attr('data-800' , 'transform: translateY(7.66vw);');
			el.find('.shareKey .shareKeyArea .infoBox').attr('data-start' , 'opacity:0;transform:translateY(6.66vw)');
			el.find('.shareKey .shareKeyArea .infoBox').attr('data-800' , 'opacity:1;transform:translateY(0vw)');
		}
		else{
			if(window.innerWidth > 1280){
				el.find('.shareKey').attr('data-start' , 'margin-bottom:120px');
				el.find('.shareKey .shareKeyArea .thumb').attr('data-start' , 'transform:scale(0.4109) translateY(0px);transform-origin:center 50%');
				el.find('.shareKey .shareKeyArea .thumb').attr('data-1100' , 'transform:scale(1) translateY(-352px);transform-origin:center 0%');
				el.find('.shareKey .shareKeyArea .txtBox').attr('data-start' , 'transform: translateY(277px);');
				el.find('.shareKey .shareKeyArea .txtBox').attr('data-1400' , 'transform: translateY(216px);');
				el.find('.shareKey .shareKeyArea .infoBox').attr('data-start' , 'opacity:0;transform:translateY(50px)');
				el.find('.shareKey .shareKeyArea .infoBox').attr('data-1400' , 'opacity:1;transform:translateY(0px)');
			}
			else{
				el.find('.shareKey').attr('data-start' , 'margin-bottom:8.33vw');
				el.find('.shareKey .shareKeyArea .thumb').attr('data-start' , 'transform:scale(0.4109) translateY(0vw);transform-origin:center 50%');
				el.find('.shareKey .shareKeyArea .thumb').attr('data-1100' , 'transform:scale(1) translateY(-24.44vw);transform-origin:center 0%');
				el.find('.shareKey .shareKeyArea .txtBox').attr('data-start' , 'transform: translateY(19.23vw);');
				el.find('.shareKey .shareKeyArea .txtBox').attr('data-1400' , 'transform: translateY(15vw);');
				el.find('.shareKey .shareKeyArea .infoBox').attr('data-start' , 'opacity:0;transform:translateY(3.47vw);');
				el.find('.shareKey .shareKeyArea .infoBox').attr('data-1400' , 'opacity:1;transform:translateY(0vw);');
			}
		}

		el.find('.item').each(function(idx, obj){
			if (!$(obj).closest('.ui-m').length) {
				var numArray = [];
				var maxH;

				$(obj).find('.thumb .photoHover .photo').each(function(idx, obj){
					numArray.push($(obj).find('img').height());
				});

				maxH = Math.max.apply(null, numArray);
				if($(obj).find('.thumb > img').height() < maxH){
					var space = maxH - $(obj).find('.thumb > img').height();

					$(obj).find('.thumb').css({paddingTop : space});
				}
			}
		});

		s.refresh();
	});

	// title Navi & sec Navi
	//header.find('.titNavBox').addClass('hide');
	header.find('.titNavBox h2.titleNav').append('<div class="navBox txtLine"></div>');
	header.find('.titNavBox h2.titleNav').append('<div class="selectBoxWrap txtLine"></div>');
	header.find('.titNavBox h2.titleNav .selectBoxWrap').append('<select class="selectBox"></select>');
	el.find('.shareWrap').find('.section').each(function(idx, obj){
		var menu = $(obj).attr('id');

		header.find('.titNavBox h2.titleNav .navBox').append('<a href="#'+menu+'" class="nav"><span>'+ menu +'</span></a>');
		header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="'+ menu +'">' + menu + '</option>');
	});

	// select refresh
	selectBoxReFresh('#header .selectBox');

	// setting
	el.css({minHeight : el.find('#contents').outerHeight(true)});

	$(window).off('scroll.shareRepScroll').on('scroll.shareRepScroll', function(){
		if($('html').hasClass('ui-w')){
			if($(this).scrollTop() >= 200 && $(this).scrollTop() >= 1400){
				$('.container.share .shareWrap').removeClass('fixed');
				el.find('.shareKey').css({marginTop : 1400});

				// setting
				el.css({minHeight : el.find('#contents').outerHeight(true)});
			}
			else{
				$('.container.share .shareWrap').addClass('fixed');
				el.find('.shareKey').css({marginTop : 0});
			}
		}
		else{
			if($(this).scrollTop() >= 200 && $(this).scrollTop() >= 800){
				$('.container.share .shareWrap').removeClass('fixed');
				el.find('.shareKey').css({marginTop : 800});

				// setting
				el.css({minHeight : el.find('#contents').outerHeight(true)});
			}
			else{
				$('.container.share .shareWrap').addClass('fixed');
				el.find('.shareKey').css({marginTop : 0});
			}
		}

	});

	var lastScroll = 0;
	var ignoreScroll = false;
	var evtListeners;
	$(window).off('scroll.shareScroll touchmove.shareScroll touchend.shareScroll').on('scroll.shareScroll touchmove.shareScroll touchend.shareScroll' , function(e){
		evtListeners = e;

		scrollDone();
	}).trigger('scroll.shareScroll').trigger('touchmove.shareScroll').trigger('touchend.shareScroll');


	// 섹션 활성화
	var namePos = el.find('.section:first-child').find('> .name').position().top + el.find('.section:first-child').find('> .name').height();
	function scrollDone(){
		var sct = $(window).scrollTop();

		el.find('.shareList .section').each(function(idx, obj){
			if(sct <= $(obj).offset().top + $(obj).outerHeight(true)){
				if(sct + (window.innerHeight/2) < $(obj).offset().top -1){
					if(sct >= 0){
						$(obj).removeClass('active');
					}
				}
				else{
					el.find('.section').removeClass('active');
					$(obj).addClass('active');
				}
			}

			if($('html').hasClass('ui-w')){
				if(sct + window.innerHeight >= $(obj).offset().top + parseInt($(obj).css('padding-top').split('px')[0]/2)){
					if(sct + namePos >= $(obj).find('.itemList').offset().top){
						$(obj).find('> .name').removeClass('on');
						//$(obj).find('> .name').addClass('end');
					}
					else{
						$(obj).find('> .name').addClass('on');
						//$(obj).find('> .name').removeClass('end');
					}
				}
				else{
					$(obj).find('> .name').removeClass('on');
					//$(obj).find('> .name').removeClass('end');
				}
			}
			else{
				if(sct +( window.innerHeight/2) >= $(obj).offset().top){
					if(sct + namePos >= $(obj).find('.itemList').offset().top + ($(obj).find('.itemList').find('.thumb').height()/2)){
						$(obj).find('> .name').removeClass('on');
						//$(obj).find('> .name').addClass('end');
					}
					else{
						$(obj).find('> .name').addClass('on');
						//$(obj).find('> .name').removeClass('end');
					}
				}
				else{
					$(obj).find('> .name').removeClass('on');
					//$(obj).find('> .name').removeClass('end');
				}
			}

			if(sct < lastScroll){
				// 위
				if(sct + (window.innerHeight/2) < $(obj).offset().top){
					$(obj).find('> .name').addClass('first');
					$(obj).find('> .name').removeClass('on');
					//$(obj).find('> .name').removeClass('end');
				}

				$(obj).find('.itemList .item').each(function(idx, obj){
					if(sct + window.innerHeight <= $(obj).offset().top){
						$(obj).removeClass('active');
						$(obj).addClass('stop');
					}

					if(sct <= $(obj).offset().top + $(obj).find('.thumb').height() && sct >= $(obj).offset().top){
						$(obj).addClass('active');
						$(obj).removeClass('stop');
					}
				});
			}
			else{
				// 아래
				$(obj).find('> .name').removeClass('first');

				$(obj).find('.itemList .item').each(function(idx, obj){
					if(sct + (window.innerHeight/2) >= $(obj).offset().top + ($(obj).find('.thumb').height()/2) - 100){
						$(obj).removeClass('stop');
						$(obj).addClass('active');
					}
					if(sct >= $(obj).offset().top + $(obj).outerHeight(true)){
						$(obj).removeClass('active');
						$(obj).addClass('stop');
					}
				});
			}
		});

		if(ignoreScroll){
			return;
		}

		if(el.find('.shareList .section').hasClass('active')){
			header.find('.titNavBox').find('.navBox').addClass('on');
			header.find('.titNavBox').find('.selectBoxWrap').addClass('on');
		}
		else{
			header.find('.titNavBox').find('.navBox').removeClass('on');
			header.find('.titNavBox').find('.selectBoxWrap').removeClass('on');
		}

		//if(sct < lastScroll){
		//	// 위
		//	header.find('.titNavBox').find('.navBox').addClass('on');
		//
		//	if(sct < el.find('.shareList').offset().top){
		//		header.find('.titNavBox').find('.navBox').removeClass('on');
		//	}
		//}
		//else{
		//	// 아래
		//	header.find('.titNavBox').find('.navBox').removeClass('on');
		//}

		// Title Navi
		var idxSec = el.find('.section.active').index();

		header.find('.titNavBox h2.titleNav .nav').removeClass('on');
		header.find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
		if(idxSec != -1){
			header.find('.titNavBox h2.titleNav .nav').eq(idxSec).addClass('on');
			header.find('.titNavBox h2.titleNav select.selectBox option').eq(idxSec).prop('selected' , true);
		}

		if(evtListeners.type != 'touchend'){
			selectBoxReFresh('#header .selectBox');
		}

		lastScroll = sct;

	}

	// 섹션 이동
	$(document).on('click' , '#header .titNavBox h2.titleNav .nav', function(e){
		e.preventDefault();

		var sec = $(this).attr('href').split('#')[1];

		ignoreScroll = true;

		secOffsetPos(el.find('.section.' + sec).offset().top + 5, true);
	});

	// 모바일 셀렉트 섹션 이동
	$(document).on('change' , '#header .titNavBox select.selectBox' , function(){
		var sec = $(this).val();

		var secPos = el.find('.section.' + sec).offset().top - parseInt(el.find('.section.' + sec).css('padding-top').split('px')[0]/2);

		ignoreScroll = true;

		secOffsetPos(secPos + 10, true);
	});

	// secOffsetPos
	function secOffsetPos(cnt , state){
		if(state == true){
			$('body, html').stop().animate({
				scrollTop : cnt
			}, function(){
				ignoreScroll = false;
			});
		}
		else{
			$(window).scrollTop(cnt);
		}
	}

	// 스크롤탑
	var winTop = 0;
	$.event.add(window,"load",function(){
		if(window.location.href.split('#')[1] != null){
			if($('html').hasClass('ui-m')){
				winTop = parseInt($('#' + window.location.href.split('#')[1]).offset().top - parseInt($('#' + window.location.href.split('#')[1]).css('padding-top').split('px')[0]/2));

				if(window.location.href.split('#')[1] == 'love'){
					winTop = winTop + parseInt($('#' + window.location.href.split('#')[1]).css('padding-top').split('px')[0]);
				}
			}
			else{
				winTop = parseInt($('#' + window.location.href.split('#')[1]).offset().top);

				if(window.location.href.split('#')[1] == 'love'){
					winTop = winTop + parseInt($('#' + window.location.href.split('#')[1]).css('padding-top').split('px')[0]);
				}
			}
		}
		secOffsetPos(winTop + 10, false);
	});
}

// recruitUI
function recruitUI(){
	var el = $('.recruit');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	el.addClass('on');

	header.find('.titNavBox h2.titleNav').append('<div class="txtLine"><span>Recruit</span></div>');

	$(window).off('scroll.recruitScroll touchmove.recruitScroll touchend.recruitScroll').on('scroll.recruitScroll touchmove.recruitScroll touchend.recruitScroll' , function(){
		var sct = $(this).scrollTop();

		el.find('.recruitWrap').css('background-position-y', -(Math.max(sct) / 30) + "px");

		if(sct + window.innerHeight >= el.find('.thumb').offset().top + (el.find('.thumb').height()/4)){
			el.find('.thumb').addClass('active');
		}
		else{
			el.find('.thumb').removeClass('active');
		}

		if(sct >= 100){
			header.find('.titNavBox h2.titleNav').find('.txtLine').addClass('on');
		}
		else{
			header.find('.titNavBox h2.titleNav').find('.txtLine').removeClass('on');
		}

	}).trigger('scroll.recruitScroll').trigger('touchmove.recruitScroll').trigger('touchend.recruitScroll');

	$(window).on('resize' , function(){
		var winW = window.innerWidth;
		if(winW >= 1024){
			el.find('.topMsg .btm').css({width : el.find('.midMsg dl').width()});
		}
		else{
			el.find('.topMsg .btm').removeAttr('style');
		}
	}).trigger('resize');
}

// ethicsUI
function ethicsUI(){
	var el = $('.ethics');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	el.addClass('on');

	header.find('.titNavBox h2.titleNav').append('<div class="txtLine"><span>Ethics</span></div>');
	setTimeout(function(){
		header.find('.titNavBox h2.titleNav').find('.txtLine').addClass('on');
	}, 400);
}

// boardUI (2022.02.25 add)
function boardUI(){
	var el = $('.board');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	el.addClass('on');

	header.find('.titNavBox h2.titleNav').append('<div class="navBox txtLine"></div>');
	// header.find('.titNavBox h2.titleNav').append('<div class="txtLine"><span>Newsroom</span></div>');
	header.find('.titNavBox h2.titleNav .navBox').append('<a href="/newsroom" id="nav-all" class="nav"><span>Newsroom</span></a>');
	header.find('.titNavBox h2.titleNav .navBox').append('<a href="/newsroom/press" id="nav-m010" class="nav"><span>보도자료</span></a>');
	header.find('.titNavBox h2.titleNav .navBox').append('<a href="/newsroom/article" id="nav-m020" class="nav"><span>기획취재</span></a>');
	header.find('.titNavBox h2.titleNav .navBox').append('<a href="/newsroom/jlog" id="nav-m030" class="nav"><span>중앙로그</span></a>');
  // 모바일
	header.find('.titNavBox h2.titleNav').append('<div class="selectBoxWrap txtLine"></div>');
	header.find('.titNavBox h2.titleNav .selectBoxWrap').append('<select class="selectBox"></select>');
	var pathUrl = document.location.pathname;
	switch(pathUrl) {
		case "/newsroom/press"  :
		case "/newsroom/press/view" :
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/">Newsroom</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/press" selected>보도자료</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/article">기획취재</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/jlog">중앙로그</option>');
			break;
		case "/newsroom/article"  :
		case "/newsroom/article/view" :
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/">Newsroom</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/press">보도자료</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/article" selected>기획취재</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/jlog">중앙로그</option>');
			break;
		case "/newsroom/jlog"  :
		case "/newsroom/jlog/view" :
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/">Newsroom</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/press">보도자료</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/article">기획취재</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/jlog" selected>중앙로그</option>');
			break;
		default :
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/" selected>Newsroom</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/press">보도자료</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/article">기획취재</option>');
			header.find('.titNavBox h2.titleNav select.selectBox').append('<option value="/newsroom/jlog">중앙로그</option>');
			break;
	}
	$.event.add(window,"load",function() {
		header.find('.titNavBox h2.titleNav .navBox').addClass('on');
		header.find('.titNavBox h2.titleNav .selectBoxWrap').addClass('on');
		selectBoxReFresh('#header .selectBox');
	});
/*
	$(window).off('scroll.NewsroomScroll touchmove.NewsroomScroll touchend.NewsroomScroll').on('scroll.NewsroomScroll touchmove.NewsroomScroll touchend.NewsroomScroll' , function(){
		var sct = $(this).scrollTop();

		if(sct >= 100){
			header.find('.titNavBox h2.titleNav').find('.txtLine').addClass('on');
		}
		else{
			header.find('.titNavBox h2.titleNav').find('.txtLine').removeClass('on');
		}

	}).trigger('scroll.NewsroomScroll').trigger('touchmove.NewsroomScroll').trigger('touchend.NewsroomScroll');
*/

	$(window).on('resize' , function(){
		var winW = window.innerWidth;
		if(winW >= 1024){
			el.find('.topMsg .btm').css({width : el.find('.midMsg dl').width()});
		}
		else{
			el.find('.topMsg .btm').removeAttr('style');
		}
	}).trigger('resize');
}

// locationUI
function locationUI(){
	var el = $('.location');
	var header = $('#header');

	if(el.length <= 0){
		return;
	}

	if($('html').hasClass('ui-m')){
		$.event.add(window,"load",function(){
			var locationH = el.find('#contents').outerHeight(true);
			$(window).on('resize.locationResize' , function(){
				if(locationH < window.innerHeight){
					el.find('.locationWrap').css({height : window.innerHeight});
				}
				else{
					el.find('.locationWrap').removeAttr('style');
				}
			}).trigger('resize.locationResize');
		});
	}
}

// skrollrUI
function skrollrUI(){
	s = skrollr.init({
		forceHeight: false,
		smoothScrolling: true,
		mobileCheck: function mobileCheck() {
			if (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent || navigator.vendor || window.opera)) {
				// mobile device
			}
		},
		render: function render(data) {
		}

	});
}
var isitScroll = false;
$(function(){
	ResponsiveImagesNew();
	$(window).resize(function(){
		ResponsiveImagesNew();
	}).resize();
	headerUI();
	familySiteUI();
	allmenuUI();
	commUI();
	mainUI();
	brandUI();
	recruitUI();
	shareUI();
	aboutUI();
	ethicsUI();
	boardUI();
	locationUI();

	// 셀렉트 박스 경우
	if($('select').hasClass('selectBox') == true){
		$('select.selectBox').each(function(i) {
			makeSelect($(this));
		});
	}

	if($('.container').hasClass('main')){
		var mainPosArr = new Array();
		var mainActive;
		var mainConHeight = 0;
		var lastScroll = 0;
		function setPos(){
			$(".mainFixedMotion .section").each(function(idx, obj){
				mainPosArr.push($(obj).offset().top);
				mainConHeight = mainConHeight + $(obj).outerHeight(true);

				for(var i=0 ; i < mainPosArr.length; i++){
					$(obj).attr('data-pos' , mainPosArr[i]);
				}
			});
			//console.log(mainPosArr, mainConHeight);
			mainConHeight = mainConHeight - (parseInt($('.mainFixedMotion .section .thumb').css('padding-bottom').split('px')[0]) - parseInt($('.mainFixedMotion .section .thumb').css('top').split('px')[0]));
			$(".mainFixedMotion").addClass("fixed").height(mainConHeight);
		}
		setTimeout(function(){
			setPos();
		}, 10);

		$(window).on('scroll.mainScroll touchmove.mainScroll touchend.mainScroll' , function(e){
			if(ignoreScroll){
				return
			}
			var firstFixed = null;
			var sct =$(window).scrollTop();
			clearTimeout(firstFixed);
			firstFixed = setTimeout(function(){
				if(!ignoreScroll && $('.container.main .keyVisual').hasClass('scrollAfter') && $(".container.main .sectionWrap").hasClass("fixed")){
                    ignoreScroll = true;
					$(window).scrollTop(1);
					$('.container.main .keyVisual').addClass('start');
					$(".container.main .sectionWrap").removeClass("fixed");
					$('.utilWrap').hide();

					setTimeout(function(){
						$('.container.main .keyVisual').css("opacity", 0);
						$('.container.main .mainFixedMotion').css("opacity", 1);
                        ignoreScroll = false;
					}, 800);

					setTimeout(function(){
						$('.wrap').removeClass('scrollUp').addClass('scrollDown');
						$('.utilWrap').removeAttr('style');
					}, 100);
				}
			},500);

			$(".mainFixedMotion .section").each(function(idx, obj){
				if(sct < lastScroll){
					if(sct <= mainPosArr[idx] - 1){
						//mainActive = idx;
						mainActive = $(".mainFixedMotion").find('.section.activeMotion').last().index();

						$(obj).removeClass('activeFixed').removeAttr("style");

						if(sct + window.innerHeight <= $(obj).prev().find('.bg').offset().top + $(obj).find('.bg').height()){
							$(obj).removeClass('activeMotion').addClass('activeMotionNone');
						}

						$('#header').find('.titNavBox h2.titleNav .nav').removeClass('on');
						$('#header').find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
						if(mainActive != -1){
							$('#header').find('.titNavBox h2.titleNav .nav').eq(mainActive).addClass('on');
							$('#header').find('.titNavBox h2.titleNav select.selectBox option').eq(mainActive).prop('selected' , true);
						}
					}
				}
				else{
					// 아래
					if(sct >= mainPosArr[idx] - 1){
						$(obj).addClass('activeFixed');

						$(obj).css('top', mainPosArr[idx]);
						mainActive = idx;
					}

					if(sct >= mainPosArr[idx] - parseInt($('.mainFixedMotion .section .thumb').css('padding-bottom').split('px')[0])){
						$(obj).addClass('activeMotion').removeClass('activeMotionNone');

						mainActive = $('.mainFixedMotion .section.activeMotion').last().index();

						$('#header').find('.titNavBox h2.titleNav .nav').removeClass('on');
						$('#header').find('.titNavBox h2.titleNav select.selectBox option').prop('selected' , false);
						if(mainActive != -1){
							$('#header').find('.titNavBox h2.titleNav .nav').eq(mainActive).addClass('on');
							$('#header').find('.titNavBox h2.titleNav select.selectBox option').eq(mainActive).prop('selected' , true);
						}
					}
				}
			});
			lastScroll = sct;


		});
	}

	// IE Background-attachment Fixed Bug
	if(navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
		document.body.addEventListener("mousewheel", function(e) {
			e.preventDefault();

			var wheelDelta = e.wheelDelta;
			var currentScrollPosition = window.pageYOffset;

			window.scrollTo(0, currentScrollPosition - wheelDelta);
		});
	}
});

$(window).on('load' , function(){
	skrollrUI();
});

function transitionEndsOnce($dom, callback) {
    var tick = Date.now();
    $dom.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function(e) {
        var diff = Date.now() - tick;
        tick = Date.now();

        if (diff > 20) { // this number can be changed, but normally all the event trigger are done in the same time
            return callback && callback(e);
        }
    });
}