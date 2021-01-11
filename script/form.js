// 서술형 줄 자동추가
// @obj : this
function textarea_Resize(obj){
    obj.style.height = "1px";
    obj.style.height = (12+obj.scrollHeight)+"px";
}   

// 객관식 라디오 버튼 내부 원 생성
// @obj : this
function formRadioCheck(obj){
    // console.log(obj.nextElementSibling.children[0].innerHTML);
    if ( obj.children[0].className == "formRadioisChecked"){
        obj.children[0].className = "";
        obj.children[1].value = "";
    }
    else {
        obj.children[0].className = "formRadioisChecked";
        // obj.children[1].value = "checked";
        obj.children[1].value = obj.nextElementSibling.children[0].innerHTML;
    }
}