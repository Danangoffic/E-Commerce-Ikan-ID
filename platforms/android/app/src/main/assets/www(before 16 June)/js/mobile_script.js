 var base_url = "http://192.168.43.196/backendikan/";
// console.log("App IN : " + navigator.appCodeName);
//var base_url = "http://localhost/backendikan/";
// var base_url = "http://192.168.0.69/backendikan/";

var storage = window.localStorage;

if(storage.sukses_login==null||storage.sukses_login==""){
  storage.sukses_login=0;
}
var sukses_login = window.localStorage.getItem('sukses_login');

if(storage.username==null){
  storage.username="";
}
var username  = window.localStorage.getItem('username');


if(storage.getItem('usergroup')==null){
  storage.usergroup = "";
}else if(storage.usergroup=="pembeli"){

  
  if(storage.getItem('keranjang')==null || storage.getItem('keranjang')==""){
    var stor_keranjang = [];
    storage.setItem('keranjang', JSON.stringify(stor_keranjang));
  }
  if(storage.getItem('keranjang')==""||storage.getItem('keranjang')==null){
    var stor_keranjang = [];
    storage.setItem('keranjang', JSON.stringify(stor_keranjang));
  }

  var keranjang = storage.getItem('keranjang');
  var parse_keranjang = JSON.parse(keranjang);
  var total_keranjang = (JSON.parse(keranjang).length) ? JSON.parse(keranjang).length : 0;
  if(total_keranjang > 0){
    $(".krjg, #status_keranjang").addClass('tx-danger');
    $("#status_keranjang").html(JSON.parse(keranjang).length);
  }else{
    $("#status_keranjang").html("0");
  }
}
var usergroup = storage.getItem('usergroup');


if(storage.id_akun==null){
  storage.id_akun = "";
}
var id_akun = window.localStorage.getItem('id_akun');


if(storage.jenis_petani == null){
  storage.jenis_petani = "";
}
var jenis_petani = window.localStorage.getItem('jenis_petani');


$(".logged-name").html(username);
console.log('sukses_login' + sukses_login);
console.log('usergroup' +usergroup);
console.log('username' + username);
console.log('id_akun: ' + id_akun);

if(usergroup=="pembeli"){
$("#totalBasket").html(JSON.parse(storage.keranjang).length);}
// if(sukses_login == 1) {
//  window.location.href = "../dashboard/index.html";
// }
// if(username == ""){
//  window.location.href = "../dashboard/index.html";
// }


$('#signout').click(signout);
function signout() {
  window.localStorage.setItem('sukses_login', 0);
  window.localStorage.setItem('username', '');
  window.localStorage.setItem('usergroup', '');
  window.location.href = "../login/index.html";
}

function openBasket(){
  window.location.href = "../produk/detail_pesanan_saya.html";
}

$(function(){

        // showing modal with effect
        $('.modal-effect').on('click', function(){
          var effect = $(this).attr('data-effect');
          $('#modaldemo8').addClass(effect, function(){
            $('#modaldemo8').modal('show');
          });
          return false;
        });

        // hide modal with effect
        $('#modaldemo8').on('hidden.bs.modal', function (e) {
          $(this).removeClass (function (index, className) {
            return (className.match (/(^|\s)effect-\S+/g) || []).join(' ');
          });
        });
      });

      function checkConnection() {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        alert('Connection type: ' + states[networkState]);
        console.log('Connection type: ' + states[networkState]);
      }
    // checkConnection();