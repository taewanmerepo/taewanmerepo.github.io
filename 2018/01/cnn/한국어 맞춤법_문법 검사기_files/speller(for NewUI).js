var defCharset=document.charset;

//var msgReportBug = "대치어가 맞지 않으면 이유를 간단히 적고 '보내기'를 눌러주세요.";
var msgReportBug = "대치어가 맞지 않거나, 다른 의견이 있으면 내용을 적어서 '보내기'를 눌러 주세요.";

// 1차 대치 결과 반영한 것 보이기(재교정 결과 보이기)
var g_bShowReplaceResult = false;

var g_idxTableForScroll=0;
var g_idxTableForScroll_1=0;
var g_idxTableForScroll_2=10000;
var g_ScrollAniDepth=0;

//===============================================================
// 새 UI를 위해 추가된 함수들	15.10.06 최성기
//===============================================================
$(document).ready(function(){

  var s="<!--[if lte IE 9]><link rel='stylesheet' type='text/css' href='../redesign_ie.css' /><![endif]--><!--[if gte IE 10]><link rel='stylesheet' type='text/css' href='../redesign_ie.css' /><![endif]--><![if !IE]><link rel='stylesheet' type='text/css'  href='../redesign.css'><![endif]>";

  $("head").append($(s));

setTimeout(redesign,1000);

});

function check_minor_change(word){
  var correction=$(".correction",word);
  var correction_word=correction.text();
  var org_word=word.clone().find(".correction").remove().end().text()
  if(correction_word.replace(/[^a-zA-Z0-9가-힣]/ig,"")==org_word.replace(/[^a-zA-Z0-9가-힣]/ig,"")){
    correction.addClass("minor");
    var c2="";
    var j=0;
    for(var i=0;i<correction_word.length;i++){
      var current_char=correction_word.charAt(i);

      if(current_char!=org_word.charAt(j)){
        if(current_char==" "){
          c2+="<span class=sp></span>"+current_char;
          j--;
        }
        else if(org_word.charAt(j)==" "&&current_char==org_word.charAt(j+1)){
            c2+="<span class=tie></span>";
            i--;
          }
        else if(current_char.match(/[^a-zA-Z0-9가-힣 ]/)){
          c2+="<span class=puct>"+current_char+"</span>";
          j--;
        }
        else if(org_word.charAt(j)!=" "&&current_char==org_word.charAt(j+1)){
          i--;
        }
        else if(current_char.match(/[a-zA-Z0-9가-힣]/) && org_word.charAt(j).match(/[^a-zA-Z0-9가-힣]/)){
          i--;
        }

      }else{
        c2+=current_char;
      }
      j++;
    }
    correction.html(c2);
  }
}

function redesign(){
	$(".tdLT:contains('관련학습사이트')").html("참고");

	$("#tdCorrection1stBox .ul").each(function(){
		var word=$(this);
		var id=$(word).attr("id");
		var color=$(word).attr("color");
		word.addClass(color);
		var id_no=id.replace("ul_","");
		var correct_id="tdReplaceWord_"+id_no;
		var correct_item=$("#"+correct_id);
		var correct_word=$("li:nth-child(2) a",correct_item).text();
		if(correct_word=="대치어 없음") correct_word="?";
		//console.log(id,correct_word);
		word.prepend($("<span class=correction>"+correct_word+"</span>"));

		check_minor_change($(this));

		word.on("mouseover",function(){
			var offset=$("#tableErr_"+id_no).offset().top-136+$("#divCorrectionTableBox1st").scrollTop();
			$("#divCorrectionTableBox1st").scrollTop(offset);
		});
	});

	$(".correction").bind('click', {}, function(event){
		replace_correction(this);
		event.stopPropagation();
	} );

	$(".tdErrWord").each(function(){
		var word=$(this);
		var id=$(word).attr("id");
		var id_no=id.replace("tdErrorWord_","");
		var correct_id="ul_"+id_no;
		var color=$("#"+correct_id).attr("color");
		//if($("#"+correct_id).hasClass("Olive")) color="red";
		//console.log(color);
		var parent=$(this).parents("table").eq(0);
		$(".tdReplace",parent).addClass(color);
		//$(".tdReplace li a",parent).css("color",color);
	});

	$(".btnBugReport").each(function(){
		var word=$(this);
		word.addClass("btnBugReport2");
		word.removeClass("btnBugReport");
	});

	g_idxTableForScroll_1=0;
	//fAddClickEventToCopy_noflash();
}

function check_same(id,check_word){

  $(".ul").each(function(){
    console.log($(this).attr("id"),id,$(this).text(),check_word);
    if($(this).attr("id")==id) return;
    if($(this).text()==check_word) {
      replace_correction($(".correction",this)[0]);
      return false;
    }
  });
}

function replace_correction(obj){
	var parent=$(obj).parent();
	var strText = $(obj).text();
	if(!parent.hasClass("ul")) return;

	var check_word=parent.text();

	parent.animate({
		color: "#fff"
		}, 
		150,	
		function() {
	});

	$(obj).animate({
		marginTop: 0
		}, 
		300, 
		function() {
			// Animation complete.
			parent.html( strText );
			parent.css('color', "inherit");
			parent.addClass("done");

			check_same($(parent).attr("id"),check_word);
	});
	fRefreshResultTextLen();
}

//===============================================================
// 목록 끝
//===============================================================

//===============================================================
// 새 UI를 위해 수정된 함수들	15.10.06 최성기
//===============================================================

// 도움말 보이기(결과 테이블 보이기)
// 글자 클릭할 때
function fShowHelp(idx)
{
//do nothing
var obj=$("#ul_"+idx+" .correction");
replace_correction(obj);
}

function fRenew()
{
	//alert("fRenew");
	window.location.href = 'http://speller.cs.pusan.ac.kr/';
}

function fULHilight(idx)
{
	var idUL = "ul_" + idx;
	var fontUL = document.getElementById(idUL);
	fontUL.style.backgroundColor = 'rgb(255, 255, 204)';
	//fontUL.style.backgroundColor = '#ffffcc';
}

function fAddClickEventToCopy() {
	$( '#btnOrgCopy' ).unbind();
	if (navigator.userAgent.match('Safari'))
	{
		ZeroClipboard.destroy();
		ZeroClipboard.config({
			swfPath: 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201602/ZeroClipboard.swf',
			forceHandCursor: true
		});
		ZeroClipboard.on("aftercopy", function(e) {
			toast('복사가 완료되었습니다.');
		});

		// 원문 복사
		clip1 = new ZeroClipboard(document.getElementById('btnOrgCopy'));	//객체 생성
		clip1.on("ready", function(e) {
		  if (e.client === clip1 && clip1 === this) {
			console.log("This client instance is ready!");
		  }
		});
		clip1.on("copy", function(e) {
			if( e.client === clip1 && clip1 === this ) {
				clip1.setData("text/plain", $( '#tdCorrection1stBox' ).clone().find(".correction").remove().end().text());
			}
		});
	}
	else if (window.clipboardData) {
		$( '#btnOrgCopy' ).bind('click',function(){
			window.clipboardData.setData('Text',$( '#tdCorrection1stBox' ).clone().find(".correction").remove().end().text());
			alert('복사가 완료되었습니다.');
			//toast('복사가 완료되었습니다.');
			//if(confirm('복사가 완료되었습니다.\n교정할 오류가 남아있을 수 있습니다.\n재검사를 진행하시겠습니까?'))
			//{
			//	document.getElementById('text1').value = $( '#tdCorrection1stBox' ).text() + document.getElementById('bufText2').value;
			//	document.formReCheck.submit();
			//}
		});
		//$( '#btnResCopy' ).bind('click',function(){
		//  window.clipboardData.setData('Text',$( '#tdCorrectionNstBox' ).text());
		//  alert('복사되었습니다.');
		//});
	}
	else {
		$( '#btnOrgCopy' ).bind('click',function(){
			if($(".js-copytextarea").length==0) {
				$("body").append($("<textarea class=js-copytextarea style='opacity:0;height:0;'></textarea>"));
			}

			$('.js-copytextarea').text($( '#tdCorrection1stBox' ).clone().find(".correction").remove().end().text());

			var copyTextarea = document.querySelector('.js-copytextarea');
			copyTextarea.select();
			try {
				var successful = document.execCommand('copy');
				var msg = successful ? 'successful' : 'unsuccessful';
				toast('복사가 완료되었습니다.');
			} catch (err) {
				toast('ctrl-c 를 눌러 복사하세요');
			}
		});
	}

	//ZeroClipboard.destroy();

	//var idxs = $( '#tdCorrectionNstBox' ).text();          //텍스트 가져오기
	//ZeroClipboard.config({
	//	swfPath: 'http://speller.cs.pusan.ac.kr/PnuSpellerISAPI_201602/ZeroClipboard.swf',
	//	forceHandCursor: true
	//});
	//ZeroClipboard.on("aftercopy", function(e) {
		//alert('복사가 완료되었습니다.');
	//	toast('복사가 완료되었습니다.');
		//if(confirm('복사가 완료되었습니다.\n교정할 오류가 남아있을 수 있습니다.\n재검사를 진행하시겠습니까?'))
		//{
		//	document.getElementById('text1').value = $( '#tdCorrection1stBox' ).text() + document.getElementById('bufText2').value;
		//	document.formReCheck.submit();
		//}
	//});

	// 원문 복사
	//clip1 = new ZeroClipboard(document.getElementById('btnOrgCopy'));	//객체 생성
	//clip1.on("ready", function(e) {
	//  if (e.client === clip1 && clip1 === this) {
	//	console.log("This client instance is ready!");
	//  }
	//});
	//clip1.on("copy", function(e) {
	//	if( e.client === clip1 && clip1 === this ) {
	//		clip1.setData("text/plain", $( '#tdCorrection1stBox' ).clone().find(".correction").remove().end().text());
	//	}
	//});
	// 결과 복사
	//clip2 = new ZeroClipboard(document.getElementById('btnResCopy'));	//객체 생성
	//clip2.on("ready", function(e) {
	//  if (e.client === clip2 && clip2 === this) {
	//	console.log("This client instance is ready!");
	//  }
	//});
	//clip2.on("copy", function(e) {
	//	if( e.client === clip2 && clip2 === this ) {
	//		clip2.setData("text/plain", $( '#tdCorrectionNstBox' ).text());
	//	}
	//});
}

var toast=function(msg){
	$("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+msg+"</h3></div>")
	.css({ display: "block",
		opacity: 0.90,
		position: "fixed",
    "z-index": "1000",
		padding: "7px",
		"text-align": "center",
		width: "270px",
		left: ($(window).width() - 284)/2,
		top: $(window).height()*1.5 })

	.appendTo( $("body"))
  .animate({
    top: $(window).height()*0.4
}, 300, function() {
})

  .delay( 2000 )
  .animate({
    top: $(window).height()*1.5
}, 300, function() {
  $(this).remove();
});

/*	.fadeOut( 400, function(){
		$(this).remove();
	});
  */
}

//===============================================================
// 목록 끝
//===============================================================

function na_open_window(name, url, left, top, width, height, toolbar, menubar, statusbar, scrollbar, resizable)	
{
	var specs="";
	if(parseInt(left)>0)	specs += 'left='+left;
	if(specs.length>0)		specs += ',';
	if(parseInt(top)>0)		specs += 'top='+top;
	toolbar_str = toolbar ? 'yes' : 'no';		
	menubar_str = menubar ? 'yes' : 'no';		
	statusbar_str = statusbar ? 'yes' : 'no';		
	scrollbar_str = scrollbar ? 'yes' : 'no';		
	resizable_str =    resizable?'yes':'no';		
	if(specs.length>0)		specs += ',';
	var popupWindow = window.open(url, name, specs+',width='+width+',height='+height+',toolbar='+toolbar_str+',menubar='+menubar_str+', status='+statusbar_str+',scrollbars='+scrollbar_str+', resizable='+resizable_str);	

}

function fKeyUp(event)
{
	isEnter(event);

	fRefreshTextLen();
}

//콤마찍는 함수 
function fMakeCommaNum(n) 
{
	return (!n||n==Infinity||n=='NaN')?0:String(n).replace(/(\d)(?=(?:\d{3})+(?!\d))/g,'$1,'); 
}

//통화구분점 지우고 숫자만 돌려 받습니다. 
function fRemoveNumberComma(data) 
{
	return parseInt(data.replace(/[^0-9]/g,""),10) || 0; 
}

function fRefreshTextLen()
{
	textLen = $('#text1').val().length;
	//nrLen = $('#text1').text().split('\r').length-1;
	//nrLen2 = $('#text1').text().split('\n').length-1;
	//nrLen3 = $('#text1').text().split('30일').length-1;
	//if(textLen==0)	$('#textInputFormMsg').text( '검사할 문장을 입력하세요.' );
	$('#divTextLen').text( '[총 ' + fMakeCommaNum(textLen) + '자]' );

}

function fRefreshResultTextLen()
{
	textOrgLen = $('#tdCorrection1stBox').text().length;
	//textResultLen = $('#tdCorrectionNstBox').text().length;
	//text = $('#tdCorrection1stBox').text();
	//crLen = $('#tdCorrection1stBox').text().split('\n').length-1;
	
	$('#tResultLTitle1').text( '[총 ' + fMakeCommaNum(textOrgLen) + '자]' );
}

function isEnter(key) 
{
	keyValue = (navigator.appName=='Netscape') ? key.which : key.keyCode;
	if	(	keyValue==13 && key.ctrlKey  
		||	keyValue==13 && key.shiftKey 
		) 
	{
		inputForm.submit();
	}
	else if (keyValue==13)
	{
		
	}
}

function onBugReport(index) 
{
	//document.getElementById('hiddenInputStr').value = document.getElementById('bufHiddenInputStr').value;
	//document.getElementById('hiddenErrorIdx').value = index;
	//document.getElementById('hiddenErrorWord').value = fToHTML(document.getElementById('tdErrorWord_' + index).innerHTML);
	//document.getElementById('hiddenReplaceWord').value = fToHTML(document.getElementById('tdReplaceWord_' + index).innerHTML);
	//document.getElementById('hiddenComment').value = document.getElementById('txtComment_' + index).value;
	//if( document.getElementById('hiddenComment').value.substring(0,20) == msgReportBug.substring(0,20) )
	//{
	//	document.getElementById('hiddenComment').value = "";
	//}

//	var ifr = document.getElementById('ifHidden');
//	if(ifr) document.body.removeChild(ifr);
//	ifr = document.createElement("<iframe id='ifHidden' name='ifHidden' style='display:none; width:300px; height:200px;'></iframe>");
//	document.body.appendChild(ifr);
	document.getElementById('formBugReport1').target = 'ifHidden';

	document.forms['formBugReport1'].hiddenInputStr.value = document.getElementById('bufHiddenInputStr').value;
	document.forms['formBugReport1'].hiddenErrorIdx.value = index;
	document.forms['formBugReport1'].hiddenErrorWord.value = fToHTML(document.getElementById('tdErrorWord_' + index).innerHTML);
	document.forms['formBugReport1'].hiddenReplaceWord.value = fToHTML(document.getElementById('tdReplaceWord_' + index).innerHTML);
	document.forms['formBugReport1'].hiddenComment.value = document.getElementById('txtComment_' + index).value;

	if( document.forms['formBugReport1'].hiddenComment.value.substring(0,20) == msgReportBug.substring(0,20) )
	{
		document.forms['formBugReport1'].hiddenComment.value = "";
	}

	if( fIsIE() || fIsChrome() )
	{
		document.charset = 'euc-kr';
	}
	


	document.getElementById('formBugReport1').submit();

	document.charset=defCharset;
}

function fIsChrome()
{
	return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}
function fIsIE()
{
	return /MSIE/.test(navigator.userAgent);
}

function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}


function onReportOth() 
{
	var strComment = new String(document.getElementById('txtCommentOth').value);
	if(strComment=="소중한 의견 고맙게 받겠습니다."){alert("의견을 입력해 주세요.");return;}
	if(strComment==""){ alert("의견을 입력해 주세요.");return;}

	document.getElementById('hiddenInputStrOth').value = "[기타 사용자 의견]";
	document.getElementById('hiddenCommentOth').value = document.getElementById('txtCommentOth').value;
	//var ifr = document.getElementById('ifHidden');
	//if(ifr) document.body.removeChild(ifr);
	//ifr = document.createElement("<iframe id='ifHidden' name='ifHidden' style='display:none; width:300px; height:200px;'></iframe>")
	//document.body.appendChild(ifr);
	formOthReport.target = 'ifHidden';
	
	if( fIsIE() || fIsChrome() )
	{
		document.charset = 'euc-kr';
	}

	formOthReport.submit();
	
	document.charset=defCharset;
}

function FailErrReport(errCode) 
{
	switch(errCode)
	{
	case 1:
		alert("보내기 실패1");
		break;
	case 2: 
		alert("보내기 실패2");
		break;
	case 3: 
		alert("보내기 실패3");
		break;
	default:
		alert("보내기 실패");
	}
}

function disableErrReportButton(index) 
{
	//alert("보내기 완료(disableErrReportButton)" + ' tdBugReport_'+index);
	document.getElementById('tdBugReport_'+index).innerHTML = '<CENTER>보내기 완료</CENTER>';
}

function disableOthReportButton() 
{
	//alert("보내기 완료(disableOthReportButton)");
	//document.getElementById('rightHead').innerHTML = '<CENTER>보내기 완료</CENTER>';
	//document.getElementById('popLayout').innerHTML = '<CENTER>보내기 완료</CENTER>';
	parent.fHidePopup();
}

function onCommentClick(intake) 
{
	if(intake.value.substring(0,20) == msgReportBug.substring(0,20))
	{
		intake.value = "";
	}
}

function onCommentOthClick(intake) 
{
//	window.opener.resizeTo(440, 200);
	if(intake.value == "소중한 의견 고맙게 받겠습니다.")
	{
		intake.value = "";
	}
}

function fFirstSpell()
{
	fShowLoadingAniPopup(350, 300, 130, 130, true);

	var nextText = fClearGarbageBlank(document.getElementById('text1').value);
	document.getElementById('text1').value = nextText;
	document.inputForm.submit();	
}

function fCallNext()
{
	fShowLoadingAniPopup(350, 300, 130, 130, true);

	var nextText = fClearGarbageBlank(document.getElementById('bufText2').value);
	document.getElementById('text2').value = nextText;
	//this.form.submit();
	//alert(nextText);
	document.formNext.submit();
}

function fToHTML(inputText)
{
	var newTable = new String(inputText);
	var newTable2 = new String("");

	// chrome에서 innerHTML를 다른 innerHTML로 바로 복사하면 '<'이 '&lt'로 바뀌는 등의 문제가 있어서 아래 처리가 필요함
	//alert(newTable);
	while(newTable!=newTable2)
	{
		newTable2 = newTable;
		newTable = newTable.replace("&lt;", "<");
		newTable = newTable.replace("&gt;", ">");
		newTable = newTable.replace("&amp;", "&");
	}
	//alert(newTable2);

	return newTable2;
}

function fCarriageReturnToBR(inputText)
{
	var newTable = new String(inputText);
	var newTable2 = new String("");

	while(newTable!=newTable2)
	{
		newTable2 = newTable;
		newTable = newTable.replace("\r\n", "<brn>");
		newTable = newTable.replace("\n\r", "<brn>");
		newTable = newTable.replace("\n", "<brn>");
		newTable = newTable.replace("\r", "<brn>");
	}

	newTable2 = "";
	while(newTable!=newTable2)
	{
		newTable2 = newTable;
		newTable = newTable.replace("<brn>", "<br>");
	}

	return newTable2;
}


function fReplaceID( table, fromKey, toKey)
{
	var newTable = new String(table);
	var newTable2 = new String("");

	var tempKey = ""; 
	tempKey += String(fromKey).substring(0, 1);
	tempKey += '_';
	tempKey += String(fromKey).substring(1, String(fromKey).length);

	while(newTable!=newTable2)
	{
		newTable2 = newTable;
		newTable = newTable.replace(fromKey, tempKey);
	}

	newTable2 = "";
	while(newTable!=newTable2)
	{
		newTable2 = newTable;
		newTable = newTable.replace(tempKey, toKey);
	}

	return newTable2;
}


function fEditTableID(table)
{
	table = fReplaceID( table, 'tableErr_',		'tableErr_1000'	);
	table = fReplaceID( table, 'tdErrorWord_',	'tdErrorWord_1000'	);
	table = fReplaceID( table, 'tdReplaceWord_','tdReplaceWord_1000'	);
	return table;
}

// 테이블 클릭 이벤트 추가
// key: 'tableErr_'
// prefixIndex: ''
// prefixIndex: '1000'
function fEditTableClickEvent_sub( key, prefixIndex )
{
	for(i=0; i<1000; i++)
	{
		var idUL = key + prefixIndex + i;
		var fontUL = document.getElementById(idUL);
		if(fontUL==null)	continue;

		$('#'+idUL).bind
		(	'click'
		,	{idx: prefixIndex+i}
		,	function(event)
			{
				fShowSelText(event.data.idx);
			}
		);

	}
}

// 테이블 클릭 이벤트 추가
function fEditTableClickEvent()
{
	//$('#divLeft1').click( function(){ fShowSelText('divLeft1'); } ); 
	//$('#divLeft2').click( function(){ fShowSelText('divLeft2'); } ); 

	fEditTableClickEvent_sub( 'tableErr_', '' );
	fEditTableClickEvent_sub( 'tableErr_', '1000' );


	$('#divLeft1').bind
	(	'click'
	,	function(event)
		{
			fChangeHelpTablePage(g_idxTableForScroll_1);
		}
	);
	
	$('#divLeft2').bind
	(	'click'
	,	function(event)
		{
			fChangeHelpTablePage(g_idxTableForScroll_2);
		}
	);

}


function fEditShowFunc(table)
{
	table = fReplaceID( table, "fShowHelp('",	"fShowHelp('1000"	);
	table = fReplaceID( table, 'ul_',			'ul_1000'	);
	return table;
}


// '\r'나 '\n' 앞 뒤로 있는 공백 제거
// 검사기에서 \n에 대한 별다른 처리가 없어서 'xx \n yy'를 여러 번 띄어 쓴 오류로 잡는 문제 해결
function fClearGarbageBlank(inputText)
{
	var newTable = new String(inputText);
	var newTable2 = new String("");

	while(newTable!=newTable2)
	{
		newTable2 = newTable;
		newTable = newTable.replace(" \n", "\n");
		newTable = newTable.replace(" \r", "\r");
		newTable = newTable.replace("\n  ", "\n ");
		newTable = newTable.replace("\r  ", "\r ");

		newTable = newTable.replace("\t\n", "\n");
		newTable = newTable.replace("\t\r", "\r");
		newTable = newTable.replace("\n\t\t", "\n\t");
		newTable = newTable.replace("\r\t\t", "\r\t");
	}	

	return newTable2;
}

function fRemoveHTMLTag(strInputCode)
{
	//var strInputCode = document.getElementById("input-code").innerHTML;
	/* 
		This line is optional, it replaces escaped brackets with real ones, 
		i.e. < is replaced with < and > is replaced with >
	*/	
	//strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1){
	// 	return (p1 == "lt")? "<" : ">";
	//});
	var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
	return strTagStrippedText;
}

function fPixelToNum(pixel)
{
	if(typeof pixel != "string")
		return pixel;
	
	pixel = pixel.replace("px", "");
	pixel = pixel.replace("PX", "");
	return Number(pixel);
}

function fDigitToPixel(digit)
{
	return digit + "px";
}

function fPixelCalc(mode, p1, p2)
{
	p1 =fPixelToNum(p1);
	p2 =fPixelToNum(p2);

	if(mode=="plus")	p1 += p2;
	if(mode=="minus")	p1 -= p2;
	if(mode=="mul")		p1 *= p2;
	if(mode=="div")		p1 /= p2;
	if(mode=="gap")		p1 = Math.abs(p1, p2);

	return p1+"px";
}

function fComeClose(obj, to, _nRatio, _nThreshold)
{
	obj = fPixelToNum(obj);
	to = fPixelToNum(to);
	var newPos;

	if(obj==to)	return 0;
	if(obj<to)	newPos = obj + (to-obj)*_nRatio;
	else		newPos = obj - (obj-to)*_nRatio;

	if(Math.abs(to-obj)<_nThreshold)	return to-obj;

	//return obj;
	return to-newPos;
}

function fComeCloseHeight(element, to, _nRatio, _nThreshold)
{
	var obj = element.style.height;
	if(obj==to)	return 0;
	obj = fPixelToNum(obj);
	to = fPixelToNum(to);
	var newPos;

	if(obj<to)	newPos = obj + (to-obj)*_nRatio;
	else		newPos = obj - (obj-to)*_nRatio;

	if(Math.abs(to-obj)<_nThreshold)	return to-obj;

	element.style.height = String(newPos);
	return to-newPos;
}

function fComeCloseTop(element, to, _nRatio, _nThreshold)
{
	var obj = element.style.top;
	obj = fPixelToNum(obj);
	to = fPixelToNum(to);
	var newPos;

	if(obj==to)	return 0;
	if(obj<to)	newPos = obj + (to-obj)*_nRatio;
	else		newPos = obj - (obj-to)*_nRatio;

	if(Math.abs(to-obj)<_nThreshold)	return to-obj;

	element.style.top = String(newPos);
	return to-newPos;
}

function fComeCloseScrollTop(element, to, _nRatio, _nThreshold, _nTargetHeight)
{
	var obj = element.scrollTop;
	var newPos;

	if(obj==to)	return 0;
	if(obj<to)	newPos = obj + (to-obj)*_nRatio;
	else		newPos = obj - (obj-to)*_nRatio;

	if(Math.abs(to-obj)<_nThreshold)	return to-obj;


	element.scrollTop = newPos;
	return to-newPos;
}

function fComeCloseScrollTopS(element, to, _step, _nThreshold, _nTargetHeight)
{
	var obj = element.scrollTop;
	var newPos;

	if(obj==to)	return 0;
	if(obj<to)	newPos = obj + _step;
	else		newPos = obj - _step;

	if(Math.abs(to-newPos)<_nThreshold)	return to-obj;
//	if(obj<to && fPixelToNum(element.clientHeight)+newPos+fPixelToNum(_nTargetHeight) > fPixelToNum(element.scrollHeight))	return to-obj;

	element.scrollTop = newPos;
	return to-newPos;
}

var g_divLeft1H;
var g_tableLeft1H;
//var g_tdResultLTitle2H;
var g_divLeft2H;
var g_tdResultLTitle2H;
//var g_tdResultRTitleT;

function fResizeResultTableAni()
{
	var divLeft1		= document.getElementById("divLeft1");
	var tableLeft1		= document.getElementById("tableLeft1");
	//var tdResultLTitle2	= document.getElementById("tdResultLTitle2");
	var divLeft2		= document.getElementById("divLeft2");
	//var tdResultRTitle	= document.getElementById("tdResultRTitle");


	var maxGap=0;
	if(divLeft1.style.height!="")
	{
		maxGap = Math.max(maxGap, Math.abs( fComeCloseHeight( divLeft1,			g_divLeft1H,		0.5, 4) ));
		maxGap = Math.max(maxGap, Math.abs( fComeCloseHeight( tableLeft1,		g_tableLeft1H,		0.5, 4) ));
		//maxGap = Math.max(maxGap, Math.abs( fComeCloseHeight( tdResultLTitle2,	g_tdResultLTitle2H,	0.5, 4) ));
		maxGap = Math.max(maxGap, Math.abs( fComeCloseHeight( divLeft2,			g_divLeft2H,		0.5, 4) ));
		//maxGap = Math.max(maxGap, Math.abs( fComeCloseTop( tdResultRTitle,	g_tdResultRTitleT,	0.5, 4) ));
	}

	g_ScrollAniDepth++;
	if	(	g_ScrollAniDepth>20
		||	divLeft1.style.height==""
		||	maxGap<4
		)
	{
		g_ScrollAniDepth=0;
		divLeft1.style.height		= g_divLeft1H;
		tableLeft1.style.height		= g_tableLeft1H;
		//tdResultLTitle2.style.height= g_tdResultLTitle2H;
		divLeft2.style.height		= g_divLeft2H;
		//tdResultRTitle.style.top	= g_tdResultRTitleT;

		document.getElementById("divLeft2").style.height = fPixelCalc("minus", g_divLeft2H, g_tdResultLTitle2H);
		//document.getElementById("tdResultLTitle2").style.height = g_tdResultLTitle2H;
		//if(g_bShowReplaceResult)
		//	document.getElementById('pResultLTitle2').style.display = 'inline';

		return;
	}


	if(maxGap>20)		setTimeout("fResizeResultTableAni();", 30);
	else				setTimeout("fResizeResultTableAni();", 100);

}

function fResultTextShow(_bShow)
{
	g_bShowReplaceResult = _bShow;
	g_ScrollAniDepth = 0;

	if(_bShow)
	{
		g_divLeft1H = '225px';
		g_tableLeft1H = '225px';
		//g_tdResultLTitle2H = '35px';
		g_divLeft2H = '219px';
		//g_tdResultRTitleT = '270px';
		g_tdResultLTitle2H = '15px';
	}
	else
	{
		g_divLeft1H = '447px';
		g_tableLeft1H = '447px';
		//g_tdResultLTitle2H = '15px';
		g_divLeft2H = '0px';
		//g_tdResultRTitleT = '484px';
		g_tdResultLTitle2H = '0px';

		document.getElementById("divLeft2").style.height = fPixelCalc("minus", g_divLeft2H, g_tdResultLTitle2H);
		document.getElementById("tdResultLTitle2").style.height = g_tdResultLTitle2H;
		document.getElementById('pResultLTitle2').style.display = 'none';
	}	

	fResizeResultTableAni();

	document.getElementById('pResultLTitle2').innerHTML 
		= fGetShowSpellerResultButtonHTML(true, true);

	document.getElementById('pResultLTitle1').innerHTML 
		= fGetShowSpellerResultButtonHTML(true, false);
}


function fGetShowSpellerResultButtonHTML(_bConsiderPrevNextButton, _bRespellExp)
{
	// 재교정 결과에도 오류가 있나?
	//var bExistErrorInResult = false;
	//if(document.getElementById('correctionTable2Size').value!='0')
	//	bExistErrorInResult = true;

	var strTitle = "첫 번째 후보로 대치한 결과 보기";
	if(_bRespellExp==true)
	{
/*		if(bExistErrorInResult==true)
			strTitle = "첫 번째 대치어로 고치고 나서도 다시 고칠 오류가 있습니다.";
		else
*/			strTitle = "";
	}

	var strHTML = "";




	if(g_bShowReplaceResult)
		strHTML += "<a id='openCorrectionResult' class='linkText' onClick='fResultTextShow(false);' title='"
	else
		strHTML += "<a id='openCorrectionResult' class='linkText' onClick='fResultTextShow(true);' title='"

	strHTML += strTitle;
	strHTML += "' ";
	strHTML += "ONMOUSEOVER=\"this.style.cursor='pointer'\"";	// ie7에서 css가 안 먹히는 게 있어서
	strHTML += ">";

	if(_bRespellExp!=true && bExistErrorInResult==true)
	//if(bExistErrorInResult==true)
		strHTML += "<font color='red' title='첫 번째 대치어로 고치고 나서도 다시 고칠 오류가 있습니다.'>다시 고칠 <b>오류</b>가 있습니다.</font>";
	else if(g_bShowReplaceResult)
		strHTML += "교정결과 숨기기";
	else
		strHTML += "교정결과 보이기";

	if(g_bShowReplaceResult)	strHTML += " ▼</a>";
	else						strHTML += " ▲</a>";



	
	return strHTML;
}

// 버튼 생성
function fGetPrevNextButtonHTML()
{
	var strHTML = "<table width='465px' style='float:left;'><tr>";

	// 다시 쓰기
	strHTML += "<td width='93px' align='left'>";
	strHTML += "<input id='btnRenew2' type='image' tabindex=1 title='새 문서 검사하기' ";
	strHTML += "src='../images/btnRenew2.gif' ";
	strHTML += "ONMOUSEOUT	=\"this.src='../images/btnRenew2.gif';\" ";
	strHTML += "ONMOUSEOVER	=\"this.src='../images/btnRenew2_over.gif';\" ";
	strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnRenew2_click.gif';\" ";
	strHTML += "ONCLICK		='fRenew();'";
	//strHTML += "ONCLICK		='window.location.assign(\"http://speller.cs.pusan.ac.kr/\");'";
	strHTML += ">";
	strHTML += "</td>";
	
	// 원문 복사하기	14.08.27 최성기
	strHTML += "<td width='93px' align='left'>";
	strHTML += "<input id='btnOrgCopy' type='image' width='88' height='39' tabindex=2 title='결과 복사하기' ";
	strHTML += "src='../images/btnOrgCopy.gif' ";
	strHTML += "ONMOUSEOUT	=\"this.src='../images/btnOrgCopy.gif';\" ";
	strHTML += "ONMOUSEOVER	=\"this.src='../images/btnOrgCopy_over.gif';\" ";
	strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnOrgCopy_click.gif';\" ";
	//strHTML += "ONCLICK		='window.location.assign(\"http://speller.cs.pusan.ac.kr/\");'";
	strHTML += ">";
	strHTML += "</td>";
//	strHTML += "<td width='150px'>";

	// 결과 복사하기	14.07.15 최성기
	//strHTML += "<td width='85px' align='left'>";
	//strHTML += "<input id='btnResCopy' type='image' tabindex=2 title='결과 복사하기' ";
	//strHTML += "src='../images/btnResCopy.gif' ";
	//strHTML += "ONMOUSEOUT	=\"this.src='../images/btnResCopy.gif';\" ";
	//strHTML += "ONMOUSEOVER	=\"this.src='../images/btnResCopy_over.gif';\" ";
	//strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnResCopy_click.gif';\" ";
	//strHTML += "ONCLICK		='window.location.assign(\"http://speller.cs.pusan.ac.kr/\");'";
	//strHTML += ">";
	//strHTML += "</td>";
//	strHTML += "<td width='150px'>";

	// 돌아가기
	strHTML += "<td width='80px' align='left'>";
	strHTML += "<input id='btnGoBackEditor' type='image' tabindex=3 title='돌아가기'";
	strHTML += "src='../images/btnGoBackEditor.gif' ";
	strHTML += "ONMOUSEOUT	=\"this.src='../images/btnGoBackEditor.gif';\" ";
	strHTML += "ONMOUSEOVER	=\"this.src='../images/btnGoBackEditor_over.gif';\" ";
	strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnGoBackEditor_click.gif';\" ";
	strHTML += "ONCLICK		='history.go(-" + document.getElementById('pageNumber').value + ");'";
	strHTML += ">";
	strHTML += "</td>";

	strHTML += "<td width='60px' align='left'>";
	strHTML += "<div width='30px' tabindex=2></div>";
	strHTML += "</td>";

	// 이전 결과
	strHTML += "<td width='60px' align='left'>";
//	if	(	0>navigator.userAgent.indexOf("Chrome") && history.length>1
//		||	history.length>2
//		)
	if	(	Number(document.getElementById('pageNumber').value)>1	)
	{
		strHTML += "<input id='btnPrev' type='image' tabindex=4 title='이전 결과' ";
		strHTML += "src='../images/btnPrev.gif' ";
		strHTML += "ONMOUSEOUT	=\"this.src='../images/btnPrev.gif';\" ";
		strHTML += "ONMOUSEOVER	=\"this.src='../images/btnPrev_over.gif';\" ";
		strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnPrev_click.gif';\" ";
		strHTML += "ONCLICK		='history.back();'";
		strHTML += ">";
	}
	else
	{
		strHTML += "<input id='btnPrev' type='image' tabindex=4 title='첫 결과입니다.' ";
		strHTML += "src='../images/btnPrev_disable.gif' style='cursor:default;' ";
		strHTML += ">";
	}
	strHTML += "</td>";

	// 다음 결과
	strHTML += "<td width='60px' align='left'>";
	if(document.getElementById('bufText2').value != "")
	{		
		strHTML += "<input id='btnNext' type='image' tabindex=5 title='다음 결과' ";
		strHTML += "src='../images/btnNext.gif' ";
		strHTML += "ONMOUSEOUT	=\"this.src='../images/btnNext.gif';\" ";
		strHTML += "ONMOUSEOVER	=\"this.src='../images/btnNext_over.gif';\" ";
		strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnNext_click.gif';\" ";
		strHTML += "ONCLICK		='fCallNext();'";
		strHTML += ">";
	}
	else
	{		
		strHTML += "<input id='btnNext' type='image' tabindex=5 title='마지막 결과입니다.' ";
		strHTML += "src='../images/btnNext_disable.gif' style='cursor:default;'";
		strHTML += ">";
	}
	strHTML += "</td>";
	


	strHTML += "</tr></table>";

	return strHTML;
}

function fGetButtonHTMLForNoErr()
{
	var strHTML = "";


	// 돌아가기
	strHTML += "<input id='btnGoBackEditor' type='image' tabindex=2 title='돌아가기'";
	strHTML += "src='../images/btnGoBackEditor.gif' ";
	strHTML += "ONMOUSEOUT	=\"this.src='../images/btnGoBackEditor.gif';\" ";
	strHTML += "ONMOUSEOVER	=\"this.src='../images/btnGoBackEditor_over.gif';\" ";
	strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnGoBackEditor_click.gif';\" ";
	strHTML += "ONCLICK		='history.go(-" + document.getElementById('pageNumber').value + ");'";
	strHTML += ">";

	strHTML += "&nbsp;&nbsp;&nbsp;&nbsp;";

	// 다시 쓰기
	strHTML += "<input id='btnRenew2' type='image' tabindex=1 title='새 문서 검사하기' ";
	strHTML += "src='../images/btnRenew2.gif' ";
	strHTML += "ONMOUSEOUT	=\"this.src='../images/btnRenew2.gif';\" ";
	strHTML += "ONMOUSEOVER	=\"this.src='../images/btnRenew2_over.gif';\" ";
	strHTML += "ONMOUSEDOWN	=\"this.src='../images/btnRenew2_click.gif';\" ";
	strHTML += "ONCLICK		='fRenew();'";
	//strHTML += "ONCLICK		='window.location.assign(\"http://speller.cs.pusan.ac.kr/\");'";
	strHTML += ">";
	




	return strHTML;
}



////////////////////////////////////////////////////////////
// 기본 이미지 위치 조정
function fImageRepositioning()
{

	if(0<=navigator.userAgent.indexOf('Chrome'))
	{
		/*
		var img1 = document.getElementById('bgResultLTitle1');
		if(img1!=null)
		{
			img1.style.top = '4px';
			img1.style.left = '2px';
		}
		*/

/*		var img2 = document.getElementById('bgResultRTitle');
		if(img2!=null)
		{
			//img2.style.top = '4px';
			img2.style.left = '399px';
			//img2.style.left = document.getElementById('tdRight').style.left;
		}

		var img4 = document.getElementById('btnTitleTable');
		if(img4!=null)
		{
			img4.style.top = '15px';
			img4.style.left = '252px';
		}
*/
	}

	if(0<=navigator.userAgent.indexOf('Firefox'))
	{
/*		var img1 = document.getElementById('bgResultLTitle1');
		if(img1!=null)
		{
			img1.style.top = '94px';
			img1.style.left = '15px';
		}

		var img2 = document.getElementById('bgResultRTitle');
		if(img2!=null)
		{
			img2.style.top = '94px';
			img2.style.left = '407px';
		}

		var img3 = document.getElementById('btnResultRenew');
		if(img3!=null)
		{
			img3.style.top = '93px';
			img3.style.left = '353px';
		}
		
		var img4 = document.getElementById('btnTitleTable');
		if(img4!=null)
		{
			img4.style.top = '103px';
			img4.style.left = '353px';
		}
*/

	}

	if((document.all)&&(navigator.appVersion.indexOf("MSIE 7.")!=-1))
	{
		var img1 = document.getElementById('bgResultLTitle1');
		if(img1!=null)
		{
			img1.style.top = '5px';
			img1.style.left = '2px';
		}

		var img2 = document.getElementById('bgResultRTitle');
		if(img2!=null)
		{
			img2.style.top = '5px';
			img2.style.left = '394px';
		}
	}
}



////////////////////////////////////////////////////////////
// 버튼 생성
function fMakeButton()
{
	document.getElementById('formNext').innerHTML 
		= "<!--다음 검사할 내용-->"
		;

	document.getElementById('formNext').innerHTML 
		+= "<input type='hidden' id='text2' name='text2' value='empty'/>\n"
		+	"<input type='hidden' id='oldPageNumber' name='pageNumber' value='" 
		+	document.getElementById('pageNumber').value
		+	"'/>\n";

	document.getElementById('idButtons').innerHTML 
		+= fGetPrevNextButtonHTML();						// 하단 버튼

	//document.getElementById('pResultLTitle2').innerHTML 
	//	= fGetShowSpellerResultButtonHTML(true, true);		// 왼쪽 중간 버튼

	//document.getElementById('pResultRTitle').innerHTML 
	//	= fGetShowResultCopyButtonHTML();		// 오른쪽 중간 버튼
}

function fShowCorrectionTable()
{
	var ct = document.getElementById('correctionTable').innerHTML.replace("formBugReport1", "formBugReport");

	while( 0 <= ct.indexOf("id='hidden") )
	{
		ct = ct.replace("id='hidden", "id= 'X_hidden");
	}
	while( 0 <= ct.indexOf("id=hidden") )
	{
		ct = ct.replace("id=hidden", "id= X_hidden");
	}

	document.getElementById('divCorrectionTableBox1st').innerHTML = fToHTML(ct);
	document.getElementById('divCorrectionTableBox1st').scrollTop=0;
	
	//document.getElementById('divCorrectionTableBox2nd').style.visibility = 'hidden';
	//$('#divCorrectionTableBox2nd').css('width', '0px');
	//$('#divCorrectionTableBox2nd').removeClass('divScrollbarStyle');
	//$('#divCorrectionTableBox2nd').addClass('divCorrectionTableBoxStyleHidden');
	//document.getElementById('divCorrectionTableBox2nd').innerHTML = fToHTML(document.getElementById('correctionTable2').innerHTML);
	//document.getElementById('divCorrectionTableBox2nd').scrollTop=0;
	


}


////////////////////////////////////////////////////////////
// 교정 테이블 보이기
function fShowRightDiv()
{
	if(0>document.getElementById('correctionTable').innerHTML.indexOf("문법 및 철자 오류가 발견되지 않았습니다."))
	{
		fShowCorrectionTable();
		fShowHelp(-1);
		
		// 교정 테이블에 오류 보고 form 보이기
		fShowBugReport();

		// 밑줄, 표, 후보선택에 대한 클릭 이벤트 할당
		fAddClickEvent();

		// 교정 테이블에 대치어(선택된) 줄 추가
		//fInsertReplaceWordTR();
	}
	else
	{
		document.getElementById('tdBody').style.textAlign='center';
		document.getElementById('tdBody').innerHTML = "맞춤법과 문법 오류를 찾지 못했습니다.<br><br>기술적 한계로 찾지 못한 맞춤법 오류나 문법 오류가 있을 수 있습니다. <br><br>";
		//document.getElementById('tdBody').innerHTML += "<input id='btnHistoryBack' type='button' value='돌아가기' onclick='history.back();'/>";
		//document.getElementById('btnHistoryBack').focus();
		document.getElementById('tdBody').innerHTML += fGetButtonHTMLForNoErr();
		document.getElementById('btnGoBackEditor').focus();

		return false;
	}
	
	return true;
}

//////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////
//function fFillData(bodyElement) 
function fFillData() 
{
	document.getElementById('pResultLTitle3').innerHTML = "한 번에 300어절씩 검사합니다.";

	// 교정 테이블 보이기
	if( false == fShowRightDiv() ) { return; }

	// 1번째 교정(밑줄) 결과 보이기
	document.getElementById('tdCorrection1stBox').innerHTML = fToHTML(document.getElementById('bufUnderline').innerHTML);
	
	// 2번째 교정(밑줄) 결과 보이기
	//document.getElementById('tdCorrectionNstBox').innerHTML 
	//	=document.getElementById('bufUnderline2').innerHTML;
}

function fTableHilight(idx, color)
{
	var idUL = "tableErr_" + idx;
	var fontUL = document.getElementById(idUL);
	fontUL.style.backgroundColor = color;
}


function fClearULHilight()
{
	var bgColor = document.getElementById('tdCorrection1stBox').style.backgroundColor;

	var i;
	for(i=0; i<1000; i++)
	{
		var idUL = "ul_" + i;
		var fontUL = document.getElementById(idUL);
		if(fontUL==null)	continue;
		fontUL.style.backgroundColor = bgColor;
	}

	for(i=0; i<1000; i++)
	{
		var idUL = "ul_1000" + i;
		var fontUL = document.getElementById(idUL);
		if(fontUL==null)	continue;
		fontUL.style.backgroundColor = bgColor;
	}
}

function fClearTableHilightIfNoneSel()
{
	fClearTableHilight(true);
}

function fClearTableHilight(bIfNoneSel)
{
	var bgColor = document.getElementById('tdCorrection1stBox').style.backgroundColor;

	var i;
	for(i=0; i<1000; i++)
	{
		if(bIfNoneSel && g_idxTableForScroll==i)	continue;
		var idUL = "tableErr_" + i;
		var fontUL = document.getElementById(idUL);
		if(fontUL==null)	continue;
		fontUL.style.backgroundColor = bgColor;
	}

	for(i=0; i<1000; i++)
	{
		if(bIfNoneSel && g_idxTableForScroll==Number(String("1000")+i))	continue;

		var idUL = "tableErr_1000" + i;
		var fontUL = document.getElementById(idUL);
		if(fontUL==null)	continue;
		fontUL.style.backgroundColor = bgColor;
	}
}

function fMakeErrTableForm(tables)
{
	var newHTML
		= //"	<form id='formBugReport' name='formBugReport' action='/BugReporting.asp' method='post'>\n\n"
		//+ "		<!-- 세로로 가운데 정렬을 하려고 테이블로 묶음 -->\n"
		//+ 
		  "		<table id='tableShowErr' border='0' cellpadding='0' cellspacing='0' bordercolorlight='#008685' bordercolordark='white' >\n"
		+ "		<tr><td align='center' valign='center' >\n\n"
		+ "<br/>\n"

		+ tables

		+ "\n\n		</td></tr></table>\n\n"
		
		//+ "		<!--오류 보고를 위한 post 변수값-->\n"
//		+ "		<input type='hidden' id='hiddenInputStr' name='hiddenInputStr' value='' />\n"
//		+ "		<input type='hidden' id='hiddenErrorIdx' name='hiddenErrorIdx' />\n"
//		+ "		<input type='hidden' id='hiddenErrorWord' name='hiddenErrorWord' />\n"
//		+ "		<input type='hidden' id='hiddenReplaceWord' name='hiddenReplaceWord' />\n"
//		+ "		<input type='hidden' id='hiddenComment' name='hiddenComment' />\n\n"

//		+ "	</form>\n"
		;

	return newHTML;
}

var gDefaultShowHelp="";


function fGetScrollElement()
{
	//if(g_idxWhatTableShow==2)
	//{
	//	return document.getElementById('divCorrectionTableBox2nd');
	//}
	return document.getElementById('divCorrectionTableBox1st');
}

function fTableScroll()
{
	g_ScrollAniDepth++;

	var s1 = fGetScrollElement();
	var table = document.getElementById( "tableErr_" +g_idxTableForScroll );
	var offTopTable = Math.min(table.offsetTop, s1.scrollHeight-s1.clientHeight);

	//alert( g_scrollanidepth);

	g_ScrollAniDepth=0;
	s1.scrollTop = offTopTable;
	
	//alert("x");
	return;

}

function fTableScrollAni()
{
	g_ScrollAniDepth++;

	var s1 = fGetScrollElement();	// document.getElementById('divCorrectionTableBox1st');
	var table = document.getElementById( "tableErr_" +g_idxTableForScroll );
	var offTopTable = Math.min(table.offsetTop, s1.scrollHeight-s1.clientHeight);

	//alert( g_ScrollAniDepth);

	var oldScrollTop = s1.scrollTop;
	var maxGap = 0;
	if(g_ScrollAniDepth<7)
	{
		maxGap = Math.abs( fComeCloseScrollTopS( s1, offTopTable, g_ScrollAniDepth*20, g_ScrollAniDepth*20, table.clientHeight) );
		if(maxGap> table.clientHeight && oldScrollTop == s1.scrollTop)
			maxGap = Math.abs( fComeCloseScrollTop( s1, offTopTable, 0.5, 4, table.clientHeight) );
	}
	else
		maxGap = Math.abs( fComeCloseScrollTop( s1, offTopTable, 0.5, 4, table.clientHeight) );
	//alert( maxGap);

	if	(	g_ScrollAniDepth>100
		||	maxGap<4
		)
	{
		g_ScrollAniDepth=0;
		s1.scrollTop = offTopTable;
		
		//alert("x");
		return;
	}

	if(maxGap<50)	setTimeout("fTableScrollAni();", 100);
	else			setTimeout("fTableScrollAni();", 20);
}

function fReliableScrollPos(scrollElement, nShowLine)
{
	var H = fPixelToNum(scrollElement.clientHeight);
	var nUnderShowLine = H-nShowLine;
	var nUnderView = fPixelToNum(scrollElement.scrollHeight) - fPixelToNum(scrollElement.scrollTop) - H;

	return H - Math.min( nUnderView, nUnderShowLine);
}

function fTextScroll()
{
	g_ScrollAniDepth++;
	
	var s1;
	if(g_idxWordForScroll<1000)	s1 = document.getElementById('divLeft1');
	else						s1 = document.getElementById('divLeft2');

	var halfBound =fPixelToNum(s1.clientHeight)/2;	//창 중간에 보이게
	var ul = document.getElementById( "ul_" +g_idxWordForScroll );
	var offTopTable = Math.min(Math.max(ul.offsetTop-halfBound, 0), s1.scrollHeight-s1.clientHeight);

	g_ScrollAniDepth=0;
	s1.scrollTop = offTopTable;
	
	//alert("x");
	return;

}

function fTextScrollAni()
{
	g_ScrollAniDepth++;
	
	var s1;
	if(g_idxWordForScroll<1000)	s1 = document.getElementById('divLeft1');
	else						s1 = document.getElementById('divLeft2');

	var halfBound =fPixelToNum(s1.clientHeight)/2;	//창 중간에 보이게
	var ul = document.getElementById( "ul_" +g_idxWordForScroll );
	var offTopTable = Math.min(Math.max(ul.offsetTop-halfBound, 0), s1.scrollHeight-s1.clientHeight);
	
	//alert( g_ScrollAniDepth);

	var oldScrollTop = s1.scrollTop;
	var maxGap = 0;
	if(g_ScrollAniDepth<7)
	{
		maxGap = Math.abs( fComeCloseScrollTopS( s1, offTopTable, g_ScrollAniDepth*20, g_ScrollAniDepth*20, halfBound) );
		if(maxGap> halfBound && oldScrollTop == s1.scrollTop)
			maxGap = Math.abs( fComeCloseScrollTop( s1, offTopTable, 0.5, 4, halfBound) );
	}
	else
		maxGap = Math.abs( fComeCloseScrollTop( s1, offTopTable, 0.5, 4, halfBound) );
	
	if	(	g_ScrollAniDepth>100
		||	maxGap<4
		)
	{
		g_ScrollAniDepth=0;
		s1.scrollTop = offTopTable;
		
		//alert("x");
		return;
	}

	if(maxGap<50)	setTimeout("fTextScrollAni();", 100);
	else			setTimeout("fTextScrollAni();", 20);
}

var g_idxWhatTableShow=0;
//var g_posCorrTable1=0;
//var g_posCorrTable2=0;

function fChangeHelpTablePage(idx)
{
	var aniSleep=30;
	var forLeft1 = ( idx>=1000 ? false : true );
	// else forLeft2;

	if(forLeft1)
	{
		if(g_idxWhatTableShow!=1)
		{

			//$('#tdCorrectionTable2nd').removeClass('tdCorrectionTableStyle');
			//$('#tdCorrectionTable2nd').addClass('tdCorrectionTableHidden');
			$('#tdCorrectionTable1st').removeClass('tdCorrectionTableHidden');
			$('#tdCorrectionTable1st').addClass('tdCorrectionTableStyle');

			//$('#divCorrectionTableBox2nd').removeClass('divScrollbarStyle');
			//$('#divCorrectionTableBox2nd').addClass('divCorrectionTableBoxStyleHidden');
			//$('#divCorrectionTableBox2nd').animate( {width: '0px'}, 'fast', function(){/*$(this).hide();*/} );
			//$('#divCorrectionTableBox1st').show();
			//$('#divCorrectionTableBox1st').css("visibility", "visible");
			$('#divCorrectionTableBox1st').animate( {width:'427px'}, 'fast' );
			$('#divCorrectionTableBox1st').removeClass('divCorrectionTableBoxStyleHidden');
			$('#divCorrectionTableBox1st').addClass('divScrollbarStyle');

			g_idxWhatTableShow=1;
			aniSleep = 800;
		}

		if(idx<0)	return -1;
	}
	else
	{
		if(g_idxWhatTableShow!=2)
		{


			$('#tdCorrectionTable1st').removeClass('tdCorrectionTableStyle');
			$('#tdCorrectionTable1st').addClass('tdCorrectionTableHidden');
			//$('#tdCorrectionTable2nd').removeClass('tdCorrectionTableHidden');
			//$('#tdCorrectionTable2nd').addClass('tdCorrectionTableStyle');


			$('#divCorrectionTableBox1st').removeClass('divScrollbarStyle');
			$('#divCorrectionTableBox1st').addClass('divCorrectionTableBoxStyleHidden');
			$('#divCorrectionTableBox1st').animate( {width: '0px'}, 'fast', function(){/*$(this).hide();*/} );
			//$('#divCorrectionTableBox2nd').show();
			//$('#divCorrectionTableBox2nd').css("visibility", "visible");
			//$('#divCorrectionTableBox2nd').animate( {width:'427px'}, 'fast' );
			//$('#divCorrectionTableBox2nd').removeClass('divCorrectionTableBoxStyleHidden');
			//$('#divCorrectionTableBox2nd').addClass('divScrollbarStyle');

//			var td1st = $('#divCorrectionTableBox1st').parent();
//			td1st.css('width', '0px');

			g_idxWhatTableShow=2;
			aniSleep = 1000;
		}
	}

	//fShowBugReport();

	fClearULHilight();
	fClearTableHilight(false);
	if(0<=idx)	
	{
		fULHilight(idx);
		fTableHilight(idx, '#ffffcc');//'lightGreen');
		if(g_idxTableForScroll!=idx && g_idxTableForScroll!="" && g_idxTableForScroll>=0)	fTableHilight(g_idxTableForScroll, '#ffffcc');//'lightGreen');
		
		if(forLeft1)	g_idxTableForScroll_1 = idx;
		else			g_idxTableForScroll_2 = idx;
		g_idxTableForScroll = idx;
	}
	//g_idxTableForScrollOld = g_idxTableForScroll;


	return aniSleep;
}

// 도움말 테이블 보이기 스크롤
function fScrollHelpTable(aniSleep)
{
	if((document.all)&&(navigator.appVersion.indexOf("MSIE 7.")!=-1))
	{
		fTableScroll();		
		fClearTableHilightIfNoneSel();
		return;
	}
	else
	{
		setTimeout("fClearTableHilightIfNoneSel();", 500);
		setTimeout("fTableScrollAni();", aniSleep);
	}

}


var g_idxWordForScroll=0;

// 테이블 클릭
function fShowSelText(idx)
{
	//alert(idx);
	fClearTableHilight(false);
	fTableHilight(idx, '#ffffcc');
	fClearULHilight();
	fULHilight(idx);
	g_ScrollAniDepth=0;
	g_idxWordForScroll = idx;

	var forLeft1 = ( (idx=="" || idx<1000) ? true : false );
	if(forLeft1)	g_idxTableForScroll_1 = idx;
	else			g_idxTableForScroll_2 = idx;
	g_idxTableForScroll = idx;

	if((document.all)&&(navigator.appVersion.indexOf("MSIE 7.")!=-1))
	{
		fTextScroll();
	}
	else
	{
		fTextScrollAni();
	}
}

function fShowHelpDefault()
{
	fShowHelp(gDefaultShowHelp);
}

function fSetDefaultShowHelp(idx)
{
	gDefaultShowHelp = idx;
}

function fShowBugReport()
{
	for(var i = 0; i < 1000; i++)
	{
		var x = document.getElementById('tdBugReport_'+i);
		if(x==null){break;}
		x.innerHTML = GetBugReportTD(i);
	}
}

/*
// 교정 테이블에 대치어(선택된) 줄 추가
function fInsertReplaceWordTR()
{
	fInsertReplaceWordTR_sub('');
	fInsertReplaceWordTR_sub('1000');
}
function fInsertReplaceWordTR_sub( prefixIndex )
{	
	for(var i = 0; i < 1000; i++)
	{
		// 입력 내용 얻기
		var tdErrorWord = $('#tdErrorWord_'+prefixIndex+i);
		if(tdErrorWord.length == 0)	break;

		// 입력내용이 있는 tr
		var trErrorWord = tdErrorWord.parent();


		// 대치어(선택된) tr 추가
		trErrorWord.next().clone().insertAfter(trErrorWord);
		
		// 대치어(선택된) tr
		var trReplaceWord = trErrorWord.next();
		var tdReplaceWord = trReplaceWord.children().next();
		
		// ID 변경
		var strOldReplaceWordID = tdReplaceWord.attr('id');
		var strNewReplaceWordID = strOldReplaceWordID.substring(0,2) + 'New' + strOldReplaceWordID.substring(2);	// tdNewReplaceWord_0
		tdReplaceWord.attr('id', strNewReplaceWordID);

		// 내용 변경
		var tdHtmlReplaceWord = "<input class='inputCandidate' value='" + tdErrorWord.text() + "'></input>";
		tdReplaceWord.html( tdHtmlReplaceWord );

		// 후보 대치어 제목 변경
		$('#tdReplaceWord_'+prefixIndex+i).prev().text('대치 후보');
		
	}
}
*/

// 대치어 사용자 입력 활성화 버튼 추가
function fAddButtonForUserInput()
{
	fAddButtonForUserInput_sub('');
	fAddButtonForUserInput_sub('1000');
	fAddClickEventForUserInput('');
	fAddClickEventForUserInput('1000');
}
function fAddButtonForUserInput_sub( prefixIndex )
{	
	for(var i = 0; i < 1000; i++)
	{
		var td = $('#tdReplaceWord_'+prefixIndex+i).prev();
		td.css('vertical-align', 'top');
		var newHTML = td.html();
		newHTML += "<button class='btnShowUserInput' style='width:12px;' id='btnShowUserInput_"+prefixIndex+i+"' title='직접 대치어를 입력할 수 있습니다.'></button>";
		newHTML += "<button class='btnHideUserInput' style='width:12px;' id='btnHideUserInput_"+prefixIndex+i+"' title='대치어 입력 칸을 제거합니다.'></button>";
		td.html(newHTML);		
	}
}


function fAddClickEventForUserInput( prefixIndex )
{
	for(var i = 0; i < 1000; i++)
	{
		$('#btnShowUserInput_'+prefixIndex+i)
		.button
		({	icons: { primary:'ui-icon-pencil' }
		,	text: false
		})
		.bind('click', function(event, ui) {
			event.preventDefault();
			$(this).hide();
			$(this).next().show();
			var liUserInput = $(this).parent().next().find('.inputCandidate');
			liUserInput.show();
			fApplyCandidate( liUserInput.children() );
		});

		$('#btnHideUserInput_'+prefixIndex+i)
		.button
		({	icons: { primary:'ui-icon-close' }
		,	text: false
		})
		.bind('click', function(event, ui) {
			event.preventDefault();
			$(this).hide();
			$(this).prev().show();
			$(this).parent().next().find('.inputCandidate').hide();

			var tdErrorWord = $('#tdErrorWord_'+fGetStrDigitID( $(this).parent().next().attr('id') ) );
			fApplyCandidate( tdErrorWord.find('a') );
		});
	}
}

function fAddChangeEventForUserInput()
{
	$('.inputCandidate')
	.bind("change paste keyup", function() {
		//alert($(this).val()); 
		//$(this).val('xx')

		fApplyCandidate( $(this).parent() );
	});
}

//function fAddCopyButton()
//{
//	$('#tdForResultLTitle3').prepend( "<input href='#link' id='btnOrgCopy' type='button' value='Copy to Clipboard'></input>" );
//
//	$('#btnCopy').clipboard({
//        path: 'http://github.com/valeriansaliou/jquery.clipboard/raw/master/jquery.clipboard.swf',
//        copy: function() {
//            //alert('Text copied. Try to paste it now!);
//            return $('#tdCorrection1stBox').text();
//        }
//	});
//}


function fLoadFile()
{
	/*
	$.getScript("../jquery-ui.min.js")
		.done(function( script, textStatus ) {
			console.log( textStatus );
		})
		.fail(function( jqxhr, settings, exception ) {
			console.log( "Triggered ajaxError handler." );
		});
	*/
}

function fPrepare()
{
	fShowLoadingAniPopup(0, -1000, 130, 130, false);
	fShowHelpPopupXYWH('../', 0, -1000, 844, 559);
	fHidePopup();
}

function fPrevStyling()
{	
	// 기본 이미지 위치 조정
	fImageRepositioning();
	
	// 버튼 생성
	fMakeButton();

	//// 전체 layout 조정
	//fResultTextShow(false);
}

function fPostStyling()
{
	//fImageRepositioning();
}

var g_isAddedClickEventToCandidate = false;

function fAddClickEventToCandidate()
{


	// set style
	$('.tdErrWord, .tdReplace').each
	(
		function ( index, item ) 
		{
			var innerHtml = $(item).html();
			if( 0 <= innerHtml.indexOf('<ul') ) return;
			if( 0 <= innerHtml.indexOf('<UL') ) return;

			var newCandForm = "<UL class='nav nav-stacked'>";

			if( 'tdReplace' == $(item).attr('class') )
			{
				var strDigitID = fGetStrDigitID( $(item).attr('id') );
				
				newCandForm +=	"<LI class='liUserInputCandidate'><A href='#link'><input class='inputCandidate' value='";
				newCandForm +=	$('#tdErrorWord_'+strDigitID).text();
				newCandForm +=	"'></input></A></LI>";
			}

			var arrCand = innerHtml.split(/<br[^>]*>/gi);
			
			$.each
			(
				arrCand,
				function (index, item2) 
				{
					if(item2.length>0)
					{
						if( 'tdErrWord' == $(item).attr('class') )
						{
							var strDigitID = fGetStrDigitID( $(item).attr('id') );
							newCandForm += "<LI><A href='#link' style='" + $('#tdErrorWord_'+strDigitID).attr('style') + "'>";
						}
						else
							newCandForm += "<LI><A href='#link'>";
						newCandForm += item2;
						newCandForm += "</A></LI>";
					}
				}
			);

			newCandForm += "</UL>";

			//$(this).html( newCandForm );
			$(this).empty();
			$(this).append( newCandForm );

		}
	);
	//<TD id='tdReplaceWord_0' class='tdReplace' >
	//	<UL id=example2a class="nav nav-tabs nav-stacked">
	//		<LI><A href="#link">더는</A></LI>
	//		<LI><A href="#link">더</A></LI>
	//		<LI><A href="#link">이제는</A></LI>
	//		<LI><A href="#link">다시는</A></LI>
	//		<LI><A href="#link">절대</A></LI>
	//	</UL>
	//</TD>



	// set click reaction
	var aa = $('.tableErrCorrect .nav a');

	if (!window.Element || !window.Element.prototype || !window.Element.prototype.hasAttribute) {
		var an = aa[0].getAttributeNode("onclick");
		if (an === null || !an.specified)
		{
			aa.bind('click', {}, function(event){ fApplyCandidate( $(this) ); } );
		}

	}
	else if( true != aa[0].hasAttribute("onclick") )
	{
		aa.bind('click', {}, function(event){ fApplyCandidate( $(this) ); } );
	}

	g_isAddedClickEventToCandidate = true;
}

// tdErrorWord_0 
// tdReplaceWord_0
// tableErr_0
// ul_0
// ...
// return 0;
function fGetStrDigitID( strID )
{
	var posUL = strID.lastIndexOf('_');
	if( 0 > posUL ) return -1;

	var strDigitID = strID.substring( posUL+1, strID.length );
	
	var nDigitID = parseInt(strDigitID);
	if ( isNaN(nDigitID) || 0>nDigitID ) { return -1; }
	
	return strDigitID;
}

function fApplyCandidate( obj ) 
{
	var objLI = obj.parent();
	var objUL = objLI.parent();
	var objTD = objUL.parent();
	var objTR = objTD.parent();
	var objTable = objTR.parent();

	var strDigitID = fGetStrDigitID( objTD[0].id.toString() );

	var lis = objTable.find('li');
	objTable.find('li').removeClass('selectedCand');
	objLI.addClass('selectedCand');


	//	tableErr_33

	// GUI reaction
	//obj.parents().find('.tableErrCorrect').find('li').removeClass('selectedCand');
	//obj.parent().addClass('selectedCand');



	// apply candidate
	var innerInput = obj.find('input');
	var innerInputValue = ( innerInput.length==0 ? "" : innerInput.val() );

	var strText = obj.text();
	if( strText.length==0 && innerInputValue.length!=0 ) strText = innerInputValue;

	$('#ul_'+strDigitID).html( strText );
	$('#ul_'+strDigitID).css('color', 'black');


	fRefreshResultTextLen();
}



function fPrevEditProperty()
{
	// 2번째 교정(밑줄)의 오류ID 수정
	//var oldUL2 = document.getElementById('bufUnderline2').innerHTML;	
	//document.getElementById('bufUnderline2').innerHTML = fEditShowFunc(oldUL2);

	// 2번째 교정 테이블의 오류ID 수정
	//var oldID2 = document.getElementById('correctionTable2').innerHTML;
	//document.getElementById('correctionTable2').innerHTML = fEditTableID(oldID2);
}

function fAddClickEvent()
{
	// 1번째, 2번째 교정(밑줄)에 클릭 이벤트 할당
	fEditTableClickEvent();

	// 후보 선택과 교정결과 반영
	fAddClickEventToCandidate();

	// 대치어 사용자 입력 활성화 버튼 추가
	fAddButtonForUserInput();

	// 대치어 사용자 입력 활성화 버튼 추가
	fAddChangeEventForUserInput();

	// copy to clipboard
	//fAddCopyButton();
	fAddClickEventToCopy();
}

/*
// 아래처럼 css link를 추가하고 body의 Onload를 수정한 후
// 아래에 임시로 만든 fFillData()는 지울 것
//<body leftmargin='0' topmargin='0' text='#333333' Onload='fOnLoadProc();'>
function fFillData()
{

//	// twitter-bootstrap 추가
//	if( $("#container").size()>0 )
//	{
//		if (document.createStyleSheet)
//		{
//			document.createStyleSheet('http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css');
//		}
//		else 
//		{
//			$("head").append($("<link href='http://netdna.bootstrapcdn.com/twitter-bootstrap/2.3.2/css/bootstrap-combined.min.css' rel='stylesheet' media='screen'>"));
//		}
//	}



	 _fFillData();
	 fAddFunction();
	 fPostStyling();
}
*/

// 쿠키 생성
function setCookie(cName, cValue, cDay){
	var expire = new Date();
	expire.setDate(expire.getDate() + cDay);
	cookies = cName + '=' + escape(cValue) + '; path=/ '; 
	if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
	document.cookie = cookies;
}

// 쿠키 가져오기
function getCookie(cName) {
	cName = cName + '=';
	var cookieData = document.cookie;
	var start = cookieData.indexOf(cName);
	var cValue = '';
	if(start != -1){
		start += cName.length;
		var end = cookieData.indexOf(';', start);
		if(end == -1)end = cookieData.length;
		cValue = cookieData.substring(start, end);
	}
	return unescape(cValue);
}

function fChangeUIMode() {
	if( getCookie('uiMode') == 'old' )
	{
		setCookie('uiMode','new',7);
		$( "script" ).filter(function(){return $(this).attr("src")==="../speller.js"}).remove();
		$("head").append($("<script src='../speller(for NewUI).js'></script>"));
		$("#textUIChange").text('옛 인터페이스 사용하기');
	}
	else
	{
		setCookie('uiMode','old',7);
		$( "script" ).filter(function(){return $(this).attr("src")==="../speller(for NewUI).js"}).remove();
		$( "link" ).filter(function(){return $(this).attr("href")==="../redesign.css"}).remove();
		$( "link" ).filter(function(){return $(this).attr("href")==="../redesign_ie.css"}).remove();
		$( "span" ).remove(".correction");
		$("head").append($("<script src='../speller.js'></script>"));
		$(".btnBugReport2").each(function(){
			var word=$(this);
			word.addClass("btnBugReport");
			word.removeClass("btnBugReport2");
		});
		$("#textUIChange").text('새 인터페이스 사용하기');
	}
}

function fOnLoadProc()
{
	fLoadFile();
	fPrepare();
	fPrevStyling()
	fPrevEditProperty();
	fFillData();
	//fAddFunction();
	//fPostStyling();
	//fResetPath();
	fRefreshResultTextLen();
	
}
/*
function fAddFunction_ApplyCandidate()
{
	for(var i = 0; i < 1000; i++)        
	{
		//alert("trBugReport_"+i);
		//var x = document.getElementById('trBugReport_'+i);
		var x = document.getElementById('tdBugReport_'+i);
		//var x = document.getElementById('txtComment_'+i);
		if(x==null){break;}
		x.innerHTML = GetBugReportTD(i);
		//x.value = GetBugReportTD(i);
	}
}
*/

function GetBugReportTD(intake)
{
	var htmlBugReport="";
//	htmlBugReport += "<td class='tdLT'>오류보고</td>";
//	htmlBugReport += "<td id='tdBugReport_" + intake + "'>";
//	htmlBugReport += "<textarea id='txtComment_" + intake + " class='tdBugReport' onclick='onCommentClick(this);'>";
	htmlBugReport += "<textarea id='txtComment_" + intake + "' class='tdBugReport' style='width:258px;' onclick='onCommentClick(this);'>";
	htmlBugReport += msgReportBug;
	htmlBugReport += "</textarea>\n";

	htmlBugReport += "<input type='button' value='보내기' class='btnBugReport' onclick='onBugReport(" + intake + ");'/>\n";

//	htmlBugReport += "<input type='button' value='보내기' class='btnBugReport' onclick='onBugReport(" + intake + ");' />";
//	htmlBugReport += "<input type='button' value='보내기' class='btnBugReport' onclick='onBugReport(" + intake + ");' />";
//	htmlBugReport += "</td>";

	return htmlBugReport;
}

function fAccessDeny(userIP)
{
	var newHtml = new String("");

//	newHtml += "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n";
//	newHtml += "<html>\n";
//	newHtml += "<head> \n";
//	newHtml += "	<title>온라인 한국어 맞춤법/문법 검사기</title>\n";
//	newHtml += "	<meta http-equiv='Content-Type' content='text/newHtml; charset=UTF-8'> \n";
//	newHtml += "</head>\n";
//	newHtml += "<body style=\"background:#ffffff center center  no-repeat url('RoundBox1.JPG');\" >\n";
	newHtml += "	<table style=\"height:100%; width:100%; vertical-align:middle; text-align:center; font: bold 12px/25px; color:yellow; \">\n";
	newHtml += "		<tr><td>\n";
	newHtml += "			한국어 맞춤법 문법 검사기는 상용 프로그램입니다.<br>\n";
	newHtml += "			웹검사기는 개인 용도로 사용할 수 있게 편의를 제공하는 것입니다.<br>\n";
	newHtml += "			최근 웹검사기를 허락 없이 다른 응용프로그램에서 사용하거나, <br>\n";
	newHtml += "			개인 용도 외에 회사, 공공기관, 단체 등에서 이용하는 사례가 발견되어 <br>\n";
	newHtml += "			개선하는 중입니다. <br>\n";
	newHtml += "			불편을 끼쳐 죄송합니다.<br>\n";
	newHtml += "			<br>\n";
	newHtml += "			아래에 해당하는데 사용이 안 된다면, 문의해 주십시오.<br>\n";
	newHtml += "			 - 가정이나 PC방 등에서 사용하는 개인<br>\n";
	newHtml += "			 - 대법원도서관, 조선일보, 특허청, SBS, 학교<br>\n";
	newHtml += "			<br>\n";
	newHtml += "			<hr />\n";
	newHtml += "			문의: 051-516-9268, urimal@pusan.ac.kr<br>\n";
	newHtml += "			<hr />\n";
	newHtml += "			참고: 간혹 잘못 차단될 수가 있습니다. <br>\n";
	newHtml += "			확인 시 사용자의 IP를 알아야 하니 미리 확인해 주십시오. <br>\n";
	newHtml += "			<br>\n";
	newHtml += "			사용자 IP: " + userIP + "\n";
	newHtml += "		</td></tr>\n";
	newHtml += "	</table>\n";
//	newHtml += "</body>\n";
//	newHtml += "</html>\n";

	document.body.innerHTML = newHtml;
}

var g_idxSCrol=0;

function fScroll1()
{
	return;

	if(g_idxSCrol==2)	return;
	g_idxSCrol=1;

	var s1 = document.getElementById('divLeft1');
	var s2 = document.getElementById('divLeft2');

	var posRat1 = parseFloat(s1.scrollTop)/parseFloat(s1.scrollHeight);
	var pos2 = parseInt(posRat1 * parseFloat(s2.scrollHeight));

	if(s2.scrollTop != pos2)	s2.scrollTop = pos2;	

	var t=setTimeout("g_idxSCrol=0;",500);
}

function fScroll2()
{
	return;

	if(g_idxSCrol==1)	return;
	g_idxSCrol=2;

	var s1 = document.getElementById('divLeft1');
	var s2 = document.getElementById('divLeft2');

	var posRat2 = parseFloat(s2.scrollTop)/parseFloat(s2.scrollHeight);
	var pos1 = parseInt(posRat2 * parseFloat(s1.scrollHeight));

	if(s1.scrollTop != pos1)	s1.scrollTop = pos1;

	g_bProcScroll=false;

	var t=setTimeout("g_idxSCrol=0;",500);
}
/*
function ShowHelp()
{
	if(document.getElementById('imgHelpWebSpellerB').style.left!='0px')
	{
		//$("#imgHelpWebSpellerB").toggle();
		$("#imgHelpWebSpellerB").animate({left:"0px", top:"70px", width:"815px", height:"555px"});
		$("#btnHelpWebSpellerShow").animate({top:"620px"});
		document.getElementById('btnHelpWebSpellerShow').src = "btnGrowDown.PNG";
		//document.getElementById('btnHelpWebSpellerShow').style.top = '620px';
	}
	else
	{
		$("#imgHelpWebSpellerB").animate({left:"400px", top:"220px", width:"420px", height:"300px"});
		$("#btnHelpWebSpellerShow").animate({top:"530px"});
		document.getElementById('btnHelpWebSpellerShow').src = "btnGrowUp.PNG";				
		//document.getElementById('btnHelpWebSpellerShow').style.top = '530px';
	}
}
function CloseHelp()
{
	$("#imgHelpWebSpellerA").animate({left:"570px", top:"630px", width:"0px", height:"0px"});
	$("#btnCloseImg").animate({left:"570px", top:"630px", width:"0px", height:"0px"});
	document.getElementById('divCorrectionTableBox').innerHTML = "";
}
*/

var baseText = null;


function fShowPopupBackground()
{
	var tableMain = document.getElementById("tableMain");
	var background = document.getElementById("divPopupBackground");
	background.style.left = tableMain.style.left;
	background.style.top = tableMain.style.top;
	background.style.width = tableMain.style.width;
	background.style.height = tableMain.style.height;
	background.style.opacity='0.0';
	background.style.visibility = "visible";
}

function fShowCloseBtn(x,y,w)
{
	var tableClose = document.getElementById("divClosePopup");
	tableClose.style.top = y+20 + "px";//-25;
	//tableClose.style.left = x+w - 30 + "px";
	tableClose.style.left = x+w - 150 + "px";
	tableClose.style.visibility = "visible";
}


function fShowFrameElement(elementID, x,y,w,h, strPath)
{
	//alert(elementID);
	var element = document.getElementById(elementID);
	//if(element==null)		alert("null");
	element.src = strPath;
	element.style.top = y + "px";
	element.style.left = x + "px";
	element.style.width = w + "px";
	element.style.height = h + "px";
	element.style.visibility = "visible";
}

function fShowFramePopup(x,y,w,h, strPath)
{
	fShowPopupBackground();
	fShowFrameElement("framePopup", x,y,w,h, strPath);
	fShowCloseBtn(x,y,w);
}

function fShowImgPopup(x,y,w,h, strPath, bWithBackround, bShowCloseButton)
{
	//alert(strPath);
	fShowFrameElement("imgPopup", x,y,w,h, strPath);
	if(bWithBackround!=false)
		fShowPopupBackground();
	if(bShowCloseButton!=false)	
		fShowCloseBtn(x,y,w);
}

function fHidePopup()
{
	document.getElementById("divPopupBackground").style.visibility = "hidden";
	document.getElementById("framePopup").style.visibility = "hidden";
	document.getElementById("imgPopup").style.visibility = "hidden";
	document.getElementById("divClosePopup").style.visibility = "hidden";
}

function fShowLoadingAniPopup(x,y,w,h, bWithBackround)
{

	if(0<=navigator.userAgent.indexOf('Opera'))	// 동작을 안 하나?
	{
		return;
	}

	if(document.getElementById('formNext')==null)
	{
		fShowImgPopup(x,y,w,h, 'images/loadingAnimation.gif', bWithBackround, false);
	}
	else
	{
		fShowImgPopup(x,y,w,h, '../images/loadingAnimation.gif', bWithBackround, false);
	}
}

function fShowHelpPopupXYWH(strPath, x,y,w,h)
{
	fShowImgPopup(x, y, w, h, strPath+"images/WebSpellerHelp_newUI.jpg", true, true);
}

function fShowHelpPopup(strPath, x,y,w,h)
{
	fShowImgPopup(3, 83, 844, 559, strPath+"images/WebSpellerHelp_newUI.jpg", true, true);
}

function fShowUserReportPopup(strPath)
{
	fShowFramePopup(0, 80, 850, 565, strPath+"UserReport.htm");
}

function fShowOrderPopup(strPath)
{
	fShowFramePopup(0, 80, 850, 565, strPath+"SpellerOrder.html");
}

function fResetPath()
{
	while( 0 <= document.body.innerHTML.indexOf("201109") )
	{
		document.body.innerHTML = document.body.innerHTML.replace("201109", "201110");
	}

	if(document.getElementById("text1")!=null)
		document.inputForm.text1.focus();
}

////////////////////////////////////////////////////////////////////
// for Popup

function setCookie( name, value, expiredays ) { 
	var todayDate = new Date(); 
	todayDate.setDate( todayDate.getDate() + expiredays ); 
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";" 
} 

function fClosePopupMsg() { 
	if ( document.formPopup.chkTimer.checked ){ 
		setCookie( "CloseSpellerPopupMsg", "done" , 1 ); 
	} 
	document.all['divPopupMsg'].style.visibility = "hidden";
	document.all['divPopupMsg'].innerHTML = "";
}

function fShowPopupMsgIfFirst()
{	
	cookiedata = document.cookie; 
	if ( cookiedata.indexOf("CloseSpellerPopupMsg=done") < 0 )
	{
		document.all['divPopupMsg'].innerHTML = fMakePopupMsg();
		document.all['divPopupMsg'].style.visibility = "visible";
	}
	else
	{
		document.all['divPopupMsg'].style.visibility = "hidden"; 	
	}
}

function fMakePopupMsg()
{
	var strHTML = new String;

	strHTML += "<table cellpadding='0' cellspacing='0' width='480' bgcolor='#ffffff' style='border:3px #ffffff solid'>";
	strHTML += "	<tr><td height='252' bgcolor='#ddddff' style='border:1px solid;padding-left:6px;padding-right:3px;font-size:10pt;font-family:돋움;font-weight:bold; text-align:left;'>";

	strHTML += "		<br/>";
	strHTML += "		<CENTER style='font-size:11pt; font-family:돋움; font-weight:bold;'>&lt;알리는 글&gt;</CENTER><br/><br/>";
	
	strHTML += "		<div style='line-height:1.5em'>&nbsp;&nbsp;맞춤법/문법 검사기에 대한 오해 몇 가지를 알려 드립니다.<br/><br/>";
	strHTML += "		&nbsp;&nbsp;- 300어절밖에 검사 안 한다.<br/>";
	strHTML += "		&nbsp;&nbsp;&nbsp;: <font color='red'>아닙니다.</font> 검사하는 길이에는 제한이 없습니다. 단, 사용자의 편의를 위해 300어절 단위로 구별하여 찾을 수 있습니다. 검사창 아랫부분에 보면 오른쪽 화살표가 있습니다. 클릭하시면 300자 단위로 차례로 넘어가면서 검사합니다. (곧 1|2|3처럼 해서 선택하실 수 있게 하겠습니다.)<br/><br/>";
	strHTML += "		&nbsp;&nbsp;- 수정이 안 된다.<br/>";
	strHTML += "		&nbsp;&nbsp;&nbsp;: <font color='red'>아닙니다.</font> 검사 후 오른쪽에서 제시하는 대치어 중 적합한 것을 클릭하시면, 그 어절로 대치합니다. 다시 원래 어절로 돌리시려면 원래 어절을 클릭하시면 됩니다. 틀렸지만 대치어가 바르지 않으면, 대치어 제시 부분 오른쪽에 연필 모양의 아이콘을 눌러 원하시는 대치어를 입력하시면 고쳐집니다.<br/>";
	strHTML += "		&nbsp;&nbsp;&nbsp;고친 내용을 가져다 쓰시려면 '현재 페이지 복사'를 하여 붙여 쓰시면 됩니다. 또 음절 개수는 원문 오른쪽 위에서 찾을 수 있습니다. 다른 불편하신 점이 있으시면 연락해 주시기 바랍니다.<br/><br/>";
	strHTML += "		&nbsp;&nbsp;마지막으로 아래아한글이나 MS-Word에서 이 검사기를 사용하실 분은 (주)나라인포테크에서 사서 쓰실 수 있습니다.<br/>";
	strHTML += "		&nbsp;&nbsp;아래아한글용은 아래아한글의 맞춤법 검사기를 대치하여 사용할 수 있으며, MS-Word용도 같지만, 오류 종류에 따라 색깔을 달리해 보여줍니다. <br/>";
	strHTML += "		&nbsp;&nbsp;법원의 결재시스템에서는 문서 작성 과정에서 이 맞춤법 검사기를 사용하며, 우리나라 대부분 언론사도 이 맞춤법 검사기를 기사 작성에 활용합니다. 전자우편(e-mail) 시스템에서 사용하는 기관도 있습니다.<br/><br/>";
	//strHTML += "		<div style='line-height:1.5em'>&nbsp;&nbsp;2015년 4월 27일부터 '한국어 맞춤법/문법 검사기'의 5.6판을 공개합니다.<br/><br/>";
	//strHTML += "		&nbsp;&nbsp;5.6판은 법률용어, 시사용어, 외래어를 비롯하여 다수 자료가 추가되었습니다.<br/><br/>";
	//strHTML += "		&nbsp;&nbsp;시스템 불안문제를 해결하려고 새로운 서버를 도입했습니다. 1차로 1대를 추가했으며, 조만간 서버 1대를 추가하겠습니다.<br/><br/>";
	//strHTML += "		&nbsp;&nbsp;또 통계적 방법에 기반을 둔 기술을 개발하여 현재 적용 중이며, 8월경에 6.0판으로 공개하겠습니다. <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;혹시 불편하거나 수정하고 싶은 내용이 있으시면, 아래의 연락처로 의견 남겨주시기 바랍니다. <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;'아래아 한글용'도 함께 5.6판이 나왔으며 자동 업데이트는 이번 주 중에 제공될 예정입니다.<br/><br/>";
	//strHTML += "		<center>[구매 문의 및 의견 주실 곳]</center><br/><center>urimal@pusan.ac.kr, 051) 516 - 9268</center><br/>";
	//strHTML += "		<div style='line-height:1.5em'>&nbsp;&nbsp;안녕하십니까? 서비스 장애 시의 대처법을 알려드리려고 합니다.<br/>";
	//strHTML += "		&nbsp;&nbsp;먼저 '한국어 맞춤법/문법 검사기' 사용에 불편을 끼쳐 죄송합니다.<br/><br/>";
	//strHTML += "		&nbsp;&nbsp;현재 본 서버에서 정상적으로 결과를 얻기 힘드시다면 아래의 서버를 이용해주시길 부탁하겠습니다.<br/>";
	//strHTML += "		&nbsp;&nbsp;<center><a href='http://164.125.36.75/PnuSpellerISAPI_201406'><font size='5'>추가 서버</font></a></center></br/>";
	//strHTML += "		&nbsp;&nbsp;해당 '추가 서버'는 서버 상황에 따라 주소가 수시로 바뀔 수 있으니 가능하면 아래의 '우리말 배움터'를 '<font color='red'>즐겨찾기</font>'해놓으시고 '우리말 배움터' 우측의 '한글 맞춤법/문법 검사기' 배너를 사용해서 접속해주시면 감사하겠습니다.<br/>";
	//strHTML += "		&nbsp;&nbsp;<center><a href='http://urimal.cs.pusan.ac.kr'><font size='5'>우리말 배움터</a></font></center></br/>";
	//strHTML += "		&nbsp;&nbsp;다시 한 번, 불편을 끼쳐 죄송합니다.<br/>";
	//strHTML += "		&nbsp;&nbsp;현재 새 인터페이스에 <font color='red'>브라우저 호환성 문제</font>가 있습니다. 검사 결과가 제대로 보이지 않거나 문제가 있으시면 검사창 메인에 있는 <font color='red'>'기존 검사기 가기'</font> 버튼을 클릭하여 5.0 버전의 인터페이스를 사용해주시길 바랍니다.<br/>";
	//strHTML += "		&nbsp;&nbsp;불편을 끼쳐 죄송합니다. 빠른 시일 내에 해결하도록 하겠습니다.<br/><br/>";
	//strHTML += "		&nbsp;&nbsp;사용하시면서 불편하거나 수정하고 싶은 내용이 있으시면, 다음의 메일로 의견 남겨주시기 바랍니다. (urimal@pusan.ac.kr) 새로 바뀐 '한국어 맞춤법/문법 검사기'에도 많은 관심과 좋은 의견 부탁합니다.<br/><br/></div>";
	//strHTML += "		<div style='line-height:1.5em'>&nbsp;&nbsp;8월 9일(토)~8월 10일(일), 접속 장애에 대해 알립니다. <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;2014년 8월 9일 오전 8시부터 8월 10일 오후 6시까지 '고압변전실 수변전설비 설치에 따른 휴전'으로, 우리말 배움터 서버가 있는 곳(부산대학교)의 전기가 공급되지 않아 우리말 배움터에 접속하실 수 없습니다.<br/><br/>";
	//strHTML += "		&nbsp;&nbsp;1. 일시 : 2014-08-09(토) 08:00 ~ 2014-08-10(일) 18:00 <br/>";
	//strHTML += "		&nbsp;&nbsp;2. 대상 : 부산대학교 자연대연구실험동 <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;정전 후 서버를 바로 재가동하여 최대한 이용에 불편함이 없도록 하겠습니다. <br/><br/></div>";
	//strHTML += "		<div style='line-height:1.5em'>&nbsp;&nbsp;2013년 12월 30일 자로 '한국어 맞춤법/문법 검사기'의 정식 새 버전, 2014판(5.0V.)이 나왔습니다. <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;4.5버전에서 처리했던 인명 처리, 문장 부호와 기호 처리, 인용 조사 처리 기능을 더 다듬고, 보조용언의 띄어쓰기 일관성 기능 등을 보완하였습니다.  <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;국립국어원의 최근 외래어 심의 내용(~2013.12.15.)과 표준국어대사전의 수정 내용도 최대한 반영하였습니다. 최근 북한 관련 뉴스가 많았던 만큼 북한 관련 용어들도 추가하였습니다.  <br/>";
	//strHTML += "		&nbsp;&nbsp;&nbsp;예) 북한연선 -> 북한 국경선, 북한 국경선 주위  <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;혹시 불편하거나 수정하고 싶은 내용이 있으시면, 아래의 메일로 의견 남겨주시기 바랍니다. <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;새로 바뀐 '한국어 맞춤법/문법 검사기'에 많은 관심과 좋은 의견 부탁합니다. <br/>";
	//strHTML += "		&nbsp;&nbsp;현재 사용하시는 온라인 검사기도 새 버전입니다. <br/>";
	//strHTML += "		&nbsp;&nbsp;새 검사기를 사용하시면서 불편하거나 수정하고 싶은 점이 있으시면, 메일로 의견 보내주시기 바랍니다.  <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;상업적인 목적으로 사용하려고 하거나 구매를 하시고자 한다면 나라인포테크로 문의하시면 됩니다. <br/>";
	//strHTML += "		&nbsp;&nbsp;(개인에게 판매하는 한국어 맞춤법/문법 검사기는 '아래아 한글용'입니다.) <br/><br/>";
	//strHTML += "		&nbsp;&nbsp;MS Word 2010 용 한국어 맞춤법/문법 검사기는 내부 테스트용이 있습니다. 테스트해 보고 싶으신 분은 아래의 메일로 연락 주시면 됩니다. <br/><br/></div>";
	//strHTML += "		<br/><center>[구매 문의 및 의견 주실 곳]</center><br/><center>urimal@pusan.ac.kr, 051) 516 - 9268</center><br/><br/>";
	
	//strHTML += "		<p style='line-height:13pt;'>";

	//strHTML += "		&nbsp;&nbsp;[추가된 기능]<br/>";
	//strHTML += "		&nbsp;&nbsp;복합명사 띄어쓰기 일관성 처리<br/><br/>";

	//strHTML += "		&nbsp;&nbsp;[내용]<br/>";
	//strHTML += "		&nbsp;&nbsp;&nbsp;명사구(명사+명사)는 띄어 써야 하지만, 맞춤법 검사기에서는 '고유명사·전문용어'와 '일반 명사구'를 구별하기 어려워 띄어 씀과 붙여 씀을 모두 허용합니다. <br/>";
	//strHTML += "		&nbsp;&nbsp;&nbsp;또한, 표준국어대사전에서 '^' 기호는 띄어 씀이 원칙이고 붙여 씀도 허용한다는 뜻입니다. <br/>";
	//strHTML += "		&nbsp;&nbsp;&nbsp;맞춤법 검사기는 이런 단어들이 쓰일 때 한 문서 내에서는 일관성을 유지하고자 처음으로 들어온 단어의 띄어쓰기에 맞춰 교정합니다. <br/>";
	//strHTML += "		&nbsp;&nbsp;&nbsp;예를 들어 '부분 일치'로 먼저 쓰이면, 그 문서에서는 '부분 일치'로 띄어 쓰도록 하고, '부분일치'로 먼저 쓰이면, 그 문서에서는 '부분일치'로 붙여 쓰도록 합니다.<br/>";
	//strHTML += "		&nbsp;&nbsp;&nbsp;해당 오류는 회색으로 표시합니다.<br/><br/>";

	//strHTML += "		</p>";
			
	//strHTML += "		<center>urimal@pusan.ac.kr <a href='#' onclick='fClosePopupMsg();fShowUserReportPopup(\"./\");'>[의견 보내기]</a></center><br/><br/>";

//	strHTML += "		&nbsp;&nbsp;<font style='font-weight:normal;'>1년여 동안 많은 고민 끝에 나온 시스템입니다. 많은 관심과 좋은 의견 부탁합니다.</font><br/><br/>";

	strHTML += "	</td></tr>";
	strHTML += "	<tr><td align='right' valign='middle' bgcolor='#000000' height='20'>";
	strHTML += "		<form name='formPopup'>";
	strHTML += "		<input type='checkbox' name='chkTimer'>";
	strHTML += "		<font face='돋움' style='font-size:8pt;color:#ffffff;'>오늘 하루 이 창을 열지 않음</font>";
	strHTML += "		<a href='javascript:fClosePopupMsg();' style='font-size:8pt;color:#ffffff;font-weight:bold;'>[닫기]</a>";
	strHTML += "		</form>";
	strHTML += "	</td></tr>";
	strHTML += "</table>";
	return strHTML;
}
////////////////////////////////////////////////////////////////////

