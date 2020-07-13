var base_url = "http://127.0.0.1/backendikan/";
console.log("App IN : " + navigator.appCodeName);
// var base_url = "http://localhost/backendikan/";
// var base_url = "http://192.168.0.69/backendikan/";
var nav = '', nav2 = '', nav3 = '';
if(usergroup == 'penjual'){

  nav = "<a href=\"../penjual/profil.html\" class=\"br-menu-link\">"+
          "<div class=\"br-menu-item\">"+
            "<i class=\"fa fa-user\"></i>"+
            "<span class=\"menu-item-label\">Profile</span>"+
          "</div>"+
        "</a>"+
        "<a href=\"#\" class=\"br-menu-link\">"+
          "<div class=\"br-menu-item\">"+
            "<i class=\"fa fa-bank\"></i>"+
            "<span class=\"menu-item-label\">Usaha</span>"+
            "<i class=\"menu-item-arrow fa fa-angle-down\"></i>"+
          "</div>"+
        "</a>"+
        "<ul class=\"br-menu-sub nav flex-column\">"+
          "<li class=\"nav-item\"><a href=\"../usaha/index.html\" class=\"nav-link\">Usaha Saya</a></li>"+
          "<li class=\"nav-item\"><a href=\"../produk/index.html\" class=\"nav-link\">Produk</a></li>"+
          "<li class=\"nav-item\"><a href=\"../kurir/index.html\" class=\"nav-link\">Kurir</a></li>"+
          "<li class=\"nav-item\"><a href=\"../kendaraan/index.html\" class=\"nav-link\">Kendaraan</a></li>"+
        "</ul>"+
        "<!-- TRANSAKSI -->"+
        "<a href=\"../penjual/transaksi_penjual.html\" class=\"br-menu-link\">"+
          "<div class=\"br-menu-item\">"+
            "<i class=\"fa fa-dollar\"></i>"+
            "<span class=\"menu-item-label\">Transaksi</span>"+
          "</div>"+
        "</a>"+
        "<a class=\"br-menu-link\" href=\"../login/logout.html\">"+
            "<div class=\"br-menu-item\">"+
              "<i class=\"fa fa-power-off\"></i>"+
              "<span class=\"menu-item-label\">Keluar</span>"+
            "</div>"+
          "</a>";
  nav2 = '';
  nav3 = '';
}
else if(usergroup == "pembeli"){
  nav = '<li><a href="index.html" class="waves-effect"><i class="material-icons">home</i>Dashboard</a></li>'+
      '<li><a href="profil.html" class="waves-effect"><i class="material-icons">person</i>Profil</a></li>'+
      '<li><a href="pesanan-saya/pesanan-saya.html" class="waves-effect"><i class="material-icons">receipt</i>Pesanan Saya</a></li>'+
      '<li class="divider"></li>'+
      '<li><a href="bantuan.html" class="waves-effect"><i class="material-icons">help</i>Bantuan</a></li>'+
      '<li><a href="../login/logout.html" class="waves-effect"><i class="material-icons">power_settings_new</i>Keluar</a></li>';
  // nav = "<a href=\"../pembeli/profil.html\" class=\"br-menu-link\">"+
  //         "<div class=\"br-menu-item\">"+
  //           "<i class=\"fa fa-user\"></i>"+
  //           "<span class=\"menu-item-label\">Profil</span>"+
  //         "</div>"+
  //       "</a>"+
  //       "<a class=\"br-menu-link\" href=\"../login/logout.html\">"+
  //           "<div class=\"br-menu-item\">"+
  //             "<i class=\"fa fa-power-off\"></i>"+
  //             "<span class=\"menu-item-label\">Keluar</span>"+
  //           "</div>"+
  //         "</a>";
  nav2 = "<div class=\"input-group wd-170 transition\">"+
        "<input id=\"searchbox\" type=\"text\" class=\"form-control\" placeholder=\"Cari Ikan...\">"+
        "<span class=\"input-group-btn\">"+
          "<button class=\"btn btn-secondary\" type=\"button\"><i class=\"fa fa-search\"></i></button>"+
        "</span>"+
      "</div>";
  nav3 = "<nav class=\"nav\">"+
          "<div class=\"dropdown\">"+
            "<a href=\"../produk/detail_pesanan_saya.html\" class=\"nav-link nav-link-profile \">"+
              "<i class=\"fa fa-shopping-basket krjg\"></i>"+
              "<span class=\"badge badge-light square-10 bg-default\" id=\"status_keranjang\"></span>"+
            "</a>"+
          "</div>"+
        "</nav>";
}else if(usergroup==""){
  nav = "<a class=\"br-menu-link\" href=\"../login/index.html\">"+
            "<div class=\"br-menu-item\">"+
              "<i class=\"fa fa-power-off\"></i>"+
              "<span class=\"menu-item-label\">Masuk</span>"+
            "</div>"+
          "</a>";
  nav2 = "<div class=\"input-group wd-170 transition\">"+
        "<input id=\"searchbox\" type=\"text\" class=\"form-control\" placeholder=\"Cari Ikan...\">"+
        "<span class=\"input-group-btn\">"+
          "<button class=\"btn btn-secondary\" type=\"button\"><i class=\"fa fa-search\"></i></button>"+
        "</span>"+
      "</div>";
  nav3 = "<nav class=\"nav\">"+
          "<div class=\"dropdown\">"+
            "<a href=\"../produk/detail_pesanan_saya.html\" class=\"nav-link nav-link-profile \">"+
              "<i class=\"fa fa-shopping-basket krjg\"></i>"+
              "<span class=\"badge badge-light square-10 bg-default\" id=\"status_keranjang\"></span>"+
            "</a>"+
          "</div>"+
        "</nav>";
}

$("#NavUser").append(nav);
$(".br-header-left").append(nav2);
$(".br-header-right").append(nav3);

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