// console.log('regist работает!!!');
//  $('body').on('click', '.password-control', function(){
// 	if ($('#password-input').attr('type') == 'password'){
// 		$(this).addClass('view');
// 		$('#password-input').attr('type', 'text');
// 	} else {
// 		$(this).removeClass('view');
// 		$('#password-input').attr('type', 'password');
// 	}
// 	return false;
// });
// //////////////////////////////скрывать или пок пароль//////////////////////////////////////////////////////////////
document.querySelector('.password-control').onclick=function(event){
    event.preventDefault();
    let atrib = document.querySelector('#reg_cpwd');
    // console.log(atrib);
	if (atrib.getAttribute('type') == 'password') {
	// target.classList.add('view');
	atrib.setAttribute('type', 'text');
	}else{
		// target.classList.remove('view');
		atrib.setAttribute('type', 'password');
	}
	return false;
    // atrib = atrib.getAttribute('type');
    // console.log(atrib);
}
/////////////////////////////////////////////////////////////////////////////////////////
document.querySelector('#regist-shop').onsubmit = function (event) {
	// останавливает перезагрузку по нажатию submit
    event.preventDefault();
    // trim()обрезает пробелы справа и слева
    let reg_Name = document.querySelector('#reg_Name').value.trim();
    let reg_Email = document.querySelector('#reg_Email').value.trim();
    let reg_pwd = document.querySelector('#reg_pwd').value.trim();
    let reg_cpwd = document.querySelector('#reg_cpwd').value.trim();
    // console.dir(reg_Email);
    // console.log(reg_Email.attributes['aria-describedby']);
        if (reg_Name=='' || reg_Email == '' || reg_pwd == '') {
        Swal.fire({
  			title: 'Пустые поля!',
  			text: 'Заполните форму!',
  			icon: 'error',
  			confirmButtonText: 'Закрыть'
		})
        // если return false-отправка не произойдет
        return false;
    }
    	if( reg_pwd != reg_cpwd){
        Swal.fire({
  			title: 'Не совпадают',
  			// text: 'Заполните форму!',
  			icon: 'error',
  			confirmButtonText: 'Закрыть'
		})
		return false;
    	} 

    	fetch('/regist_form', {
        method: 'POST',
        body: JSON.stringify({
            'reg_Name': reg_Name,
            'reg_Email': reg_Email,
            'reg_pwd': reg_pwd,
            'reg_cpwd': reg_cpwd
            // отправляем товары которые находяться в карзине
            // 'key': JSON.parse(localStorage.getItem('cart'))
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
    	 .then(function (response) {
            return response.text();
        })
        .then(function (body) {
            if (body == 2) {
            	 Swal.fire({
                    title: 'There are Problem',
                    text: 'Пользователь существует',
                    type: 'error',
                    confirmButtonText: 'Ok'
                });
            }
            else {
            	Swal.fire({
                    title: 'Every think okey',
                    text: 'okey',
                    type: 'info',
                    confirmButtonText: 'Ok'
                });
            }
        })
    }

//     function show_hide_password(target){
// 	var input = document.getElementById('password-input');
// 	if (input.getAttribute('type') == 'password') {
// 		target.classList.add('view');
// 		input.setAttribute('type', 'text');
// 	} else {
// 		target.classList.remove('view');
// 		input.setAttribute('type', 'password');
// 	}
// 	return false;
// }
