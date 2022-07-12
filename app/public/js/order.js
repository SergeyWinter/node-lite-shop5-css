// order.js подкл из order.pug
// console.log('order.js');
let kol_1 = document.querySelector('#kol_1');
kol_1.innerHTML='hhhhhhhh';
console.log(kol_1);
document.querySelector('#lite-shop-order').onsubmit = function (event) {
	// останавливает перезагрузку по нажатию submit
    event.preventDefault();
    // trim()обрезает пробелы справа и слева
    let username = document.querySelector('#username').value.trim();
    let phone = document.querySelector('#phone').value.trim();
    let email = document.querySelector('#email').value.trim();
    let address = document.querySelector('#address').value.trim();

    if (!document.querySelector('#rule').checked) {
        //с правилами не согласен если кнопка не нажата
        // подклю библиотю sweet alert из footer src='//cdn.jsdelivr.net/npm/sweetalert2@11'
        // console.log('кнопка не нажата');
        Swal.fire({
  			title: 'Не отмечено поле!',
  			text: 'Не согласны с правилами?',
  			icon: 'error',
  			confirmButtonText: 'Закрыть'
		})
        return false;
    }
    if (username == '' || phone == '' || email == '' || address == '') {
        //не заполнены поля
        // console.log('не заполнены поля');
        Swal.fire({
  			title: 'Пустые поля!',
  			text: 'Заполните форму!',
  			icon: 'error',
  			confirmButtonText: 'Закрыть'
		})
        // если return false-отправка не произойдет
        return false;
    } 
      //Если ифы не сыграли то отправляем запрос 
          fetch('/finish-order', {
        method: 'POST',
        body: JSON.stringify({
            'username': username,
            'phone': phone,
            'address': address,
            'email': email,
            // отправляем товары которые находяться в карзине
            'key': JSON.parse(localStorage.getItem('cart'))
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
            if (body == 1) {
            	 Swal.fire({
                    title: 'Success',
                    text: 'Success',
                    type: 'info',
                    confirmButtonText: 'Ok'
                });
            }
            else {
            	Swal.fire({
                    title: 'Problem with mail',
                    text: 'Error',
                    type: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        })
}