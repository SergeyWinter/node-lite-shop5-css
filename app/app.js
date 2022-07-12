let express = require('express');
let app = express();
let cookieParser = require('cookie-parser');
// подключение из modul.export из admin.js
let admin = require('./admin.js');
const { createHash } = require('crypto');
// let prim = require('./assets/pr1');
// проба sass
// let sass = require('sass');
// sass.render({file: scss_filename}, function(err, result) {
//   console.log("sass-worke");
//  });
// console.log('okey');
// подключаем bootstrap
// require('bootstrap');
// app.use('/css', express.static(__dirname + 'app/node_modules/bootstrap/dist/css/bootstrap.css'));
/**
 * public - имя папки где хранится статика
 */
app.use(express.static('public'));
// app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css'));
// app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.bundle.js'));
 //задаем шаблонизатор
app.set('view engine', 'pug');
// Подключаем mysql модуль
let mysql = require('mysql');
// настраиваем модуль
// console.log(__dirname);
// подключаем express.json
app.use(express.json());
//подключаем urlencoded для выборки из формы без js
app.use(express.urlencoded());
app.use(cookieParser());
// подключаем jquery
// подключаем nodemailer
const nodemailer = require("nodemailer");
let con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database : 'market'
});
// отключает проверку сертификации локально TLS-сертификат
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

app.listen(3000, function () {
    console.log('node express work on 3000');
});
// проверуа jquery

// middleware
app.use(function(req,res,next){
  // console.log(req);
  // если условие сраб,то направит на /login из admin.js
  if (req.originalUrl == '/admin' || req.originalUrl == '/admin-order') {
    admin(req, res, con, next);
  }
  else{
  next(); 
  }  
})

app.get('/', function (req, res) {
  // console.log(req.cookies.hash_users);
  // console.log(req.originalUrl);
  // пример модуля
  // console.log(prim(3,10));
  // 
  let cat = new Promise(function (resolve, reject) {
    con.query(
      // выбирает 3 последних товар
      "select id,slug,name, cost, image, category from (select id,slug,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, '') != '', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := '' ) v ) goods where ind < 3",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  let catDescription = new Promise(function (resolve, reject) {
    con.query(
      "SELECT * FROM category",
      function (error, result, field) {
        if (error) return reject(error);
        resolve(result);
      }
    );
  });
  Promise.all([cat, catDescription]).then(function (value) {
    // console.log(value[1]);
    res.render('index_2', {
      goods: JSON.parse(JSON.stringify(value[0])),
      catR: JSON.parse(JSON.stringify(value[1])),
    });
  });
});
// =======По категориям НОУТБУКИ ТЕЛЕФОНЫ ================
app.get('/cat', function (req, res) {
  // console.log(req.query.id);из GETзапроса localhost300/cat?id=1или2
  let catId = req.query.id;

  let cat = new Promise(function(resolve, reject){
    con.query(
      'SELECT * FROM category WHERE id='+catId,
      function(error, result){
        if (error) reject(error);
        resolve(result);
      });
  });
  let goods = new Promise(function(resolve, reject){
    con.query(
      'SELECT * FROM goods WHERE category='+catId,
      function(error, result){

        if (error) reject(error);
        resolve(result);
      });
  });

  Promise.all([cat, goods]).then(function(value){
    // выведет массив cat с "RowDataPacket"[]!!!
    // console.log(value[0]);
    //let vrm = (JSON.parse(JSON.stringify(value[1])));//без "RowDataPacket"
    //выводит массив [
    //                 { id:2,category:'телефоны' }]
    // console.log(vrm[0]['category']);
    // console.log(vrm);
    res.render('cat', {
        catR: JSON.parse(JSON.stringify(value[0])),
        goods : JSON.parse(JSON.stringify(value[1]))
    });
  })
});
// -------------Страница одиночного товара------------

app.get('/goods/*', function (req, res) {
  // console.log('work');
  // console.log(req.query.id);
  // console.log(req.params);
  con.query('SELECT * FROM goods WHERE slug="' + req.params['0'] + '"', function (error, result, fields) {
    if (error) throw(error);
    result = JSON.parse(JSON.stringify(result));
    // console.log(result[0]['name']);
    res.render('goods',{
      goods:result
    });
      // resolve(result);
  });
});
// -------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!-----------------


///////////////////////////////////////////////////////////

app.post('/get-category-list',function(req,res){
  // получаем '/get-category-list' Post из nav.js
  // выведет  адрес /get-category-list
  // console.log(req.route);
  // console.log(typeof (req.route));
 con.query('SELECT id, category FROM category', function (error, result, fields) {
    if (error) throw error;
    // let jsonz =result;
    // console.log(jsonz);
    // console.log( typeof jsonz);
    // Преобразует в json-строку
    res.json(result);
  });
});
app.post('/get-pers',function(req,res){
  let catCokie=req.cookies.id_users;
  if (catCokie) {
       con.query('SELECT name,email FROM users WHERE id='+catCokie, function (error, result, fields) {
    if (error) throw error;
    console.log(result);
        res.json(result);
  });
  }

})
// взаимодействует с card.js выводит карзину
app.post('/get-goods-info',function(req,res){
  // console.log(req.cookies.id_users);
  // console.log(req.body.key);
  // Условие if если 
  if(req.body.key.length !=0){
 con.query('SELECT id,name,cost FROM goods WHERE id IN('+req.body.key.join(',')+')', function (error, result, fields) {
    if (error) throw error;
    // console.log(result);
    let goods = {};
    for (let i = 0; i < result.length; i++) {
      goods[result[i]['id']] = result[i];
    }
     res.json(goods); 
});
}
else{
    res.send('0'); 
}
});
app.post('/finish-order', function (req, res) {
// выведет запрос из order.js
// console.log(req.body);
// Чтоб не отправляли пустую карзину
if (req.body.key.length != 0) {
    let key = Object.keys(req.body.key);
    con.query(
     'SELECT id,name,cost FROM goods WHERE id IN (' + key.join(',') + ')',
     function (error, result, fields) {
      if (error) throw error;
        // console.log(result);
        // catch ловит ошибки
      sendMaill(req.body, result).catch(console.error);
        saveOrder(req.body, result);
        res.send('1');
    });
  }
  // Если карзина пустая посылаем 0  
  else {
    res.send('0');
  }
});
app.get('/rest_psw',function(req,res){res.render('rest_psw',{})});
app.post('/rest_psw',function(req,res){
  console.log(req.body.email);
  console.log(req.body.password);
  res.redirect('/rest_psw');
});

app.get('/login_user', function (req, res) {
  res.render('login_user', {});
});


app.post('/login_user',function(req,res){
let user_email=(req.body.email);
// console.log(req.body.password)
let psw_user=hash5((req.body.password));
con.query(
  'SELECT * FROM users WHERE email="'+user_email+'"and password="'+psw_user+'"',
  function(error,result){
    // console.log(result);
  if(error)throw error;
  if (result.length==0) {
    console.log("not founded");
    res.redirect('/');
  }else
         if(result[0]['isEmailConfirmed']==0){
          let hash3=result[0]['token'];
          sendMaill2(user_email,hash3);
        // setCookie('hash_users',result[0]['token']);
        console.log('Пoдтвердите свой email');
        res.redirect('/regist');
      }
            else {
              
              let hash = makeHash(32);
              res.cookie('hash_users',hash,{maxAge: 3600000 * 24});
              res.cookie('id_users',result[0]['id'],{maxAge: 3600000 * 24});
              // console.log(result[0]['id']);
              res.redirect('/');
            }
    })   
});
///////////////////////////regist/////////////////
app.get('/regist', function (req, res){
  res.render('regist', {});
});

app.post('/regist_form',function(req,res){
  let reg_Name=req.body.reg_Name;
  let reg_Email=req.body.reg_Email;
  let reg_pwd=req.body.reg_pwd;
  console.log(typeof reg_pwd);
  reg_pwd=hash5(reg_pwd);
  console.log(reg_pwd);
  // console.log(reg_Email);
        // res.send('1');
  con.query(
    // 'SELECT id FROM users WHERE email="' + reg_Email + '"',
    'SELECT id FROM users WHERE email="' + reg_Email + '"',
      function(error, result){
          // console.log(result);
        if (error) throw error;
        // res.send('2');
        // console.log(result);
        if (result.length != 0) {
          // console.log(result);
          res.send('2');
        }else{
        let hash2 = makeHash(32);//попадет в token
        // console.log(hash2);
          let sql;
          // sql = "INSERT INTO users (name, email, password, token) VALUES ('" + data.username + "','" + data.phone + "','" + data.email + "','" + data.address + "')";
          sql = "INSERT INTO `market`.`users` (`name`, `email`, `password`, `token`, `isEmailConfirmed`) VALUES ('"+reg_Name+"', '"+ reg_Email +"', '" + reg_pwd + "', '"+ hash2 +"', '0')";
          // console.log(sql);
          con.query(sql, function (error, resultQuery) {
          if (error) throw error;
          // console.log(resultQuery.insertId);  
          });
          // console.log(reg_Email);
          sendMaill2(reg_Email,hash2);
          // console.log("every think okey");
          res.send('20');
        }
      });
})
app.get('/order', function (req, res) {
  // console.log(req.cookies);
    if (req.cookies.hash_users == undefined || req.cookies.id_users == undefined) {
    res.render('order');
    }else{
      console.log(req.cookies.hash_users);
      // res.redirect('using_page');
      res.render('order2');

    }
});
// app.get('/using_page',function(req,res){res.render('using_page',{})});
app.get('/using_page',function(req,res){
  // let id_users=(JSON.parse(JSON.stringify(req.cookies)));
    console.log(req.cookies.id_users);
        if (req.cookies.id_users == undefined) {
        res.redirect('/login_user');
        return false;
    }
  let id_users=(req.cookies.id_users);
  let shoper_od = new Promise(function(resolve, reject){
   con.query(`SELECT
   *
   FROM shop_order WHERE user_id="`+id_users+`"`, function (error, result, fields) {
        if (error) reject(error);
       resolve(result);
     });
    });
  let user_od = new Promise(function(resolve, reject){
   con.query(`SELECT
   *
   FROM user_info WHERE id=12`, function (error, result, fields) {
        if (error) reject(error);
       resolve(result);
     });
    });
  Promise.all([shoper_od, user_od]).then(function (value) {
    console.log(value[1]);
    res.render('using_page', {
      use1: JSON.parse(JSON.stringify(value[0])),
      use2: JSON.parse(JSON.stringify(value[1])),
    });
  });
});
// app.post('/using_page',function(req,res){
//     // console.log(req.cookies.id_users);
//   // console.log(req.body);
//   res.render('using_page');
// })
app.get('/admin',function(req,res){
  // admin(req,res,con);
  // console.log(req.cookies);
  // console.log(req.cookies.hash);
  // if (req.cookies.hash == undefined || req.cookies.id == undefined) {
  //       res.redirect('/login');
  //   return false;
  // }
  //     con.query(
  //       'SELECT * FROM user WHERE id=' + req.cookies.id + ' and hash="' + req.cookies.hash + '"',
  //       function (error, result) {
  //           if (error) reject(error);
  //           console.log(result);
  //           if (result.length == 0) {
  //               console.log('error user not found');
  //               res.redirect('/login');
  //           }
  //           else {
  //               // next();
  //           res.render('admin',{})

  //           }
  //       });

  res.render('admin.pug',{});
});
//----------------Меняем статус на, зарегистрированого с emaila
app.get('/confirmedusers',function (req, res) {
  let catmail = req.query.mail;
  let cattoken = req.query.token;
  con.query('SELECT * FROM users WHERE email="'+catmail+'"and token="'+cattoken+'"',
    function(error,result){
    if(error)throw error;
    if (result.length == 0) {
    console.log('error user not found');
    res.redirect('/reg_ver');
    }else{
        result = JSON.parse(JSON.stringify(result));
        console.log(result[0]['id']);
        sql = "UPDATE users  SET isEmailConfirmed='1',token='' WHERE id=" + result[0]['id'];
          con.query(sql, function (error, resultQuery) {
          if (error) throw error;
          res.cookie('hash_users',cattoken,{maxAge: 3600 * 24});
          res.cookie('id_users',result[0]['id'],{maxAge: 3600 * 24});
          res.render('confirmedusers');
          });
          };
    });
  // console.log(req.query.mail);
  // res.render('confirmedusers');
});
app.get('/admin-order',function(req,res){
  con.query(`SELECT 
  shop_order.id as id,
  shop_order.user_id as user_id,
    shop_order.goods_id as goods_id,
    shop_order.goods_cost as goods_cost,
    shop_order.goods_amount as goods_amount,
    shop_order.total as total,
    from_unixtime(date,"%Y-%m-%d %h:%m") as human_date,
    user_info.user_name as user,
    user_info.user_phone as phone,
    user_info.address as address
FROM 
  shop_order
LEFT JOIN 
  user_info
ON shop_order.user_id = user_info.id ORDER BY id DESC`, function (error, result, fields) {
      if (error) throw error;
      // console.log(result);
      // console.log("from app.js-222");
      res.render('admin-order', { order: JSON.parse(JSON.stringify(result)) });
    });
});

// * LOGIN FORM*
app.get('/login', function (req, res) {
  res.render('login', {});
});

app.post('/login', function(req, res){
  // res.end('work');
  // console.log(req.body);
  // console.log(req.body.login);
  // console.log(req.body.password);
  con.query(
    'SELECT * FROM user WHERE login="' + req.body.login + '" and password="' + req.body.password + '"',
    function(error, result){
      if (error) reject(error);
      // console.log(result);
      // console.log(resuly.length);
      if (result.length == 0) {
        console.log('error user not found');
        res.redirect('/login');
      }
      else {
        result = JSON.parse(JSON.stringify(result));
        // console.log(result[0]['id']);
        let hash = makeHash(32);
        res.cookie('hash',hash);
        res.cookie('id',result[0]['id']);
        // добавляем хэш данного пользователя
        sql = "UPDATE user  SET hash='" + hash + "' WHERE id=" + result[0]['id'];
        con.query(sql, function (error, resultQuery) {
          if (error) throw error;
          res.redirect('/admin');
        });
      };
  });
});
function saveOrder(data, result) {
  // data - информация о пользователе из finish-order:username,phone,email,address
  // result - сведения о товаре
  let sql;
  // заносит покупателя в user_info и связывает id с user_id в shop_order 
  sql = "INSERT INTO user_info (user_name, user_phone, user_email, address) VALUES ('" + data.username + "','" + data.phone + "','" + data.email + "','" + data.address + "')";
  con.query(sql, function (error, resultQuery) {
    if (error) throw error;
    console.log('1 user info saved');
    // console.log(resultQuery); 
    let userId = resultQuery.insertId;//id ползователя вставленного  в таблицу
    date = new Date() / 1000;
    for (let i = 0; i < result.length; i++) {
      sql = "INSERT INTO shop_order(date, user_id, goods_id,goods_cost, goods_amount, total) VALUES (" + date + "," + userId + "," + result[i]['id'] + "," + result[i]['cost'] + "," + data.key[result[i]['id']] + "," + data.key[result[i]['id']] * result[i]['cost'] + ")";
      con.query(sql, function (error, resultQuery) { 
        if (error) throw error;
        console.log("1 goods saved");
      })
    }
  });
  }
function hash5(string) {
  return createHash('sha256').update(string).digest('hex');
}
// data =что приход из fetch из body(req.body);result-выборка из con.query
 async function sendMaill(data,result) {
  // data=post запрос,result= выборка из бд
  // console.log(data);
  // console.log(result);
/*
   let good = {};
    for (let i = 0; i < result.length; i++) {
      // good[result[i]['id']] = result[i];
     console.log(result[1]['cost']);
    }
*/
  // console.log(result[1]['name']);
  // console.log(result[0]);
  let res = '<h2>Order in lite shop</h2>';
  let total = 0;
  for (let i = 0; i < result.length; i++) {
    // ${data.key[result[i]['id']]} = data.key[2]
    // res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]}</p>`;
    res += `<p>${result[i]['name']} - ${data.key[result[i]['id']]} - ${result[i]['cost'] * data.key[result[i]['id']]} rub</p>`;
    total += result[i]['cost'] * data.key[result[i]['id']];
  }
    // console.log(res); 
    res += '<hr>';
    res += `Total ${total} rub`;
    res += `<hr>Phone: ${data.phone}`;
    res += `<hr>Username: ${data.username}`;
    res += `<hr>Address: ${data.address}`;
    res += `<hr>Email: ${data.email}`;
    res += `<hr><a href="http://localhost:3000/">Регистрация</a>`;
    // тестовый акаунт почты из nodemailer
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
  }
  });

  let mailOption = {
    from: '<sletozima@gmail.com>',
    to: "sletozima@gmail.com,"+" sleto@mail.ru ," + data.email,
    subject: "Lite shop order",
    text: 'Hello world',
    html: res
  };
    let info = await transporter.sendMail(mailOption);
    console.log("MessageSent: %s", info.messageId);
    console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));
    return true;
}
 async function sendMaill2(data1,data2) {
  let testAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
  }
  });
// `<a href="http://localhost:3000/"></a>`

  let mailOption = {
    from: '<sletozima@gmail.com>',
    to: "sletozima@gmail.com,"+" sleto@mail.ru ",
    subject: "Registration",
    text: '<a href="http://localhost:3000/">перейти</a>',
    html: `<hr><a href="http://localhost:3000/confirmedusers?mail=` + data1 +`&token=`+data2+`">Регистрация</a>`
  };
    let info = await transporter.sendMail(mailOption);
    console.log("MessageSent: %s", info.messageId);
    console.log("PreviewSent: %s", nodemailer.getTestMessageUrl(info));
    return true;
}
  function makeHash(length) {//вызывается в login
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
