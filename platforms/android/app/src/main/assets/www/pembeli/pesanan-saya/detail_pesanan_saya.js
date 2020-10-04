var rest;
var latUsaha, lngUsaha;
var jarakPengiriman;
var feeKirim=0, feeKirim_temp = 0;
var allProductSum;

var jpengiriman1 = $("#jpengiriman1");
var jpengiriman2 = $("#jpengiriman2");
var jpengiriman3 = $("#jpengiriman3");
$('.modal').modal();
var d = new Date();
d.setDate(d.getDate);
var dNew = new Date();
dNew.setDate(dNew.getDate + 3);
$('.datepicker').datepicker({
    format: 'yyyy-m-d',
    minDate: new Date(d.getFullYear(), d.getMonth(), d.getDate()),
    maxDate: new Date(dNew.getFullYear(), dNew.getMonth(), dNew.getDate())
});

// $("[name=tglPengiriman]").attr({"min-date":d, "max-date":dNew});
// M.AutoInit();
let A = Date();
$("#textarea1").attr({ "min": A });
function onLoad() {

    var id_akun = storage.getItem('id_akun');
    console.log("id akun : " + id_akun);
    if (id_akun == "" || id_akun == null) {
        // $("#alertLogin").modal('open');
        console.log("id akun : " + id_akun);
        $(".modal").modal();
        $("#alertLogin").modal({
            dismissible: false
        });
        $("#alertLogin").modal('open');
        return false;
    }
    // var keranjang = storage.getItem('keranjang');
    // var keranjangku = JSON.parse(keranjang);
    // // first();
    // if (keranjangku.length < 1) {
    //   if (storage.sukses_login == 1) {
    //     var toastHTML = '<span>Keranjang Kosong, Silahkan melakukan Pemesanan</span><i class="material-icons red-text" onclick="return $(".toast").dismiss();">cancel<i>';
    //     M.toast({
    //       html: toastHTML,
    //       inDuration: 200
    //       // completeCallback: function () { window.location.href = '../index.html'; }
    //     });
    //   }
    // }
    
    $('.produk-saya').empty();
    // if(sukses_login==0){
    //   M.toast({html: 'Silahkan Login Untuk Melanjutkan Transaksi. <a href="../login/index.html">Login Disini</a>',inDuration:10000});

    // }
    if (storage.keranjang == "") {
        window.location.href = '../pembeli/index.html';
    }
    console.log(feeKirim);
    // loadPesanan();
    document.addEventListener("deviceready", onDeviceReady, false);
}

// document.addEventListener("DOMContentLoaded", onDeviceReady, false);
$(document).ready(onDeviceReady); 

function onDeviceReady() {
    var keranjangg = storage.getItem('keranjang');

    // check keranjang length
    if (JSON.parse(keranjangg).length < 1) {
        window.localStorage.removeItem('nama_produk');
        window.localStorage.removeItem('harga_produk');
        window.localStorage.removeItem('berat_produk');
        window.localStorage.removeItem('qty');
        window.localStorage.removeItem('variasi');
        storage.removeItem('namaVariasi');
        var toastHTML = '<span>Keranjang Kosong, Silahkan melakukan Pemesanan</span><i class="material-icons red-text" onclick="return $(".toast").dismiss();">cancel<i>';
        M.toast({
            html: toastHTML,
            inDuration: 200,
            completeCallback: function () { window.location.href = '../index.html'; }
        });
    }

    $.getJSON(API_DETAIL_USAHA, { id_usaha: storage.getItem('id_usaha') }).then(onSuccessLoadAlamatUsaha);

    console.log("Load Alamat Pembeli");
    $.getJSON(API_PEMBELI, { id_akun: storage.getItem('id_akun') }).then(onSuccessLoadAlamatPembeli).done(onDoneLoadAlamatPembeli);

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("backbutton", onBackKeyDown, false);
    document.getElementById("edit-alamat").addEventListener("click", openModalAlamat, false);
    document.getElementById("lokasi-saya").addEventListener("click", currentLocation, false);
    // document.getElementById("simpan_alamat").addEventListener("click", simpan_alamat, false);
    // document.getElementById("login").addEventListener("click", kirim_data, false);

    $.getJSON(API_KENDARAAN_PENJUAL, { id_usaha: localStorage.id_usaha }).then(onSuccessLoadKendaraan).fail(onFailLoadKendaraan);
    $.getJSON(API_KURIR, { id_usaha: localStorage.id_usaha }).then(onSuccessLoadKurir).fail(onFailedLoadKurir);
    $.getJSON(API_REKENINIG_USAHA, { id_usaha: localStorage.id_usaha }).then(onSuccessLoadRekening).fail(onFailLoadRekening);
}


function currentLocation() {
    return navigator.geolocation.getCurrentPosition(got_position, onError);
}

function got_position(position) {
    var element = document.getElementById("map");
    var marker;
    let posisilat = parseFloat(position.coords.latitude);
    let posisilng = parseFloat(position.coords.longitude);
    firstLt = position.coords.latitude;
    firstLg = position.coords.longitude;
    initMap(posisilat, posisilng);
}

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

function taruhMarker(peta, posisiTitik) {
    if (marker) {
        // pindahkan marker
        marker.setPosition(posisiTitik);
    } else {
        // buat marker baru
        marker = new google.maps.Marker({
            position: posisiTitik,
            map: peta
        });
    }
    posisilat = posisiTitik.lat();
    posisilng = posisiTitik.lng();
    console.log("Posisi marker: " + posisilat + "," + posisilng);
    $("body").find("input[name='latitude']").val(posisilat);
    //$("#latitude_pb").val(posisilat);
    //$("#longitude_pb").val(posisilng);
    $("body").find("input[name='longitude']").val(posisilng);
}


function initMap(lat, lng) {
    $("body").find("input[name='latitude']").val(lat);
    $("body").find("input[name='longitude']").val(lng);
    var propertiPeta = {
        center: new google.maps.LatLng(lat, lng), //nentuin titik pusat nya dimana (awal map kebuka, bukan posisi marker)
        zoom: 14, //semakin banyak semakin dekat min 1 maksimal
        mapTypeId: google.maps.MapTypeId.ROADMAP //roadmap, satelite, hybrid, terrain
    };
    var point = new google.maps.LatLng(lat, lng);
    var peta = new google.maps.Map(document.getElementById("map"), propertiPeta); //utama bikin map
    marker = new google.maps.Marker({
        position: point,
        map: peta
        //icon
    });
    google.maps.event.addListener(peta, 'click', function (event) {
        taruhMarker(this, event.latLng);
    });
}


function initMap1(res) {
    // console.log("res: " + res);
    var t;
    let tujuan = []; //UNTUK NYIMPEN LAT LONG AJA
    //origin -7.563823, 110.834977
    //tes origin 2 -7.571133, 110.806309
    var titik_saat_ini = new google.maps.LatLng(latUsaha, lngUsaha);
    var map = new google.maps.Map(document.getElementById('map'), {
        center: titik_saat_ini,
        zoom: 13
    });

    var marker = new google.maps.Marker({ //untuk nampilin marker
        map: map,
        position: titik_saat_ini
    });

    var penanda = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'; //bisa diganti gambar
    var infoWindow = new google.maps.InfoWindow; //buat nampilin box info
    //            for (var j = 0; j < 2; j++) {
    Array.prototype.forEach.call(res, function (row) { //perulangan nampilin ber baris yg mau ditampilin aja
        var id_tempat = row.id_tempat;
        var nama_tempat = row.nama_tempat;
        var longitude = row.longitude;
        var latitude = row.latitude;
        var deskripsi = row.deskripsi;
        var id_galeri = row.id_galeri;
        // var path_storage = row.path_storage;

        var point = new google.maps.LatLng( //di marker nya
            parseFloat(latitude),
            parseFloat(longitude));

        var infowincontent = document.createElement('div');
        infowincontent.setAttribute("style", "width: 200px;");
        var strong = document.createElement('strong');
        strong.textContent = nama_tempat
        infowincontent.appendChild(strong);
        infowincontent.appendChild(document.createElement('br'));

        var text = document.createElement('text');
        text.textContent = deskripsi
        infowincontent.appendChild(text);
        infowincontent.appendChild(document.createElement('br'));

        var image = document.createElement('img');
        // image.setAttribute("src", path_storage);
        image.setAttribute("width", "200px");
        //                    image.textContent = 'FAI';
        infowincontent.appendChild(image);

        //                var icon = 'W';//customLabel[type] || {};
        var marker = new google.maps.Marker({
            map: map,
            position: point,
            icon: penanda
        });

        marker.addListener('click', function () {
            infoWindow.setContent(infowincontent);
            infoWindow.open(map, marker);
        });
    });

    Array.prototype.forEach.call(res, function (row) { //perulangan long lat nya aja buat tujuan
        t = { lat: parseFloat(row.latitude), lng: parseFloat(row.longitude) };
        tujuan.push(t);
    });
    console.log(res);
    console.log(tujuan);


    //origin -7.563823, 110.834977
    //tes origin 2 -7.571133, 110.806309
    var origin1 = { lat: latUsaha, lng: lngUsaha };
    console.log(origin1);
    // des -7.567492, 110.832670 des  -7.566248, 110.833485 des  -7.569072, 110.831500
    // var destinationA = [{lat: -7.567492, lng: 110.832670}, {lat: -7.569072, lng: 110.831500}, {lat: -7.566248, lng: 110.833485}];
    var service = new google.maps.DistanceMatrixService;
    var idx_terdekat;
    var distance_to_this_bf;
    get_distance_matrix(origin1, tujuan, titik_saat_ini, distance_to_this_bf, idx_terdekat, service, res, map);
}

function get_distance_matrix(origin1 = {}, tujuan = {}, titik_saat_ini, distance_to_this_bf = 0, idx_terdekat = 0, service, res, map) {
    service.getDistanceMatrix({
        origins: [origin1],
        destinations: tujuan,
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
    }, function (response, status) {
        if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
            var originList = response.originAddresses;
            var outputDiv = document.getElementById('output');
            outputDiv.innerHTML = '';
            console.log(response);
            for (var i = 0; i < originList.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    // KONDISI BIAYA PENGIRIMAN
                    feeKirim = 5000;
                    // jarakPengiriman = (results[j].distance.value / 1000).toFixed(1);
                    let distance_val = parseFloat(results[j].distance.value / 1000);
                    jarakPengiriman = distance_val.toFixed(1);
                    if (results[j].distance.value > 5000) {
                        feeKirim += parseInt(1000 * (distance_val - 5)); //1000/km
                    }
                    var slicedString = feeKirim.toString().slice(-3);
                    if (parseInt(slicedString) > 500) {
                        feeKirim = feeKirim + 1000 - parseInt(slicedString);
                    } else if (parseInt(slicedString) < 500) {
                        feeKirim = feeKirim - parseInt(slicedString);
                    }
                    // feeKirim_temp = feeKirim;
                    console.log("FEEKIRIM: " + feeKirim);
                    if (j == 0) {
                        idx_terdekat = 0;
                        distance_to_this_bf = results[j].distance.value; //nilai untuk dibandingkan
                        // outputDiv.innerHTML += res[j].nama_tempat + ' titik pertama. idx_terdekat ' + idx_terdekat + '<br>';
                    } else {
                        // outputDiv.innerHTML += '<br>' + res[j].nama_tempat + '<br>' + distance_to_this_bf + '>' + results[j].distance.value + ' maka <br>';
                        if (distance_to_this_bf > results[j].distance.value) {
                            distance_to_this_bf = results[j].distance.value;
                            idx_terdekat = j;
                        }
                        // outputDiv.innerHTML += 'idx_terdekat = ' + idx_terdekat + '<br>';
                    }
                    outputDiv.innerHTML += 'Jarak: ' + results[j].distance.text + '<br>'; //km
                }
            }
            // outputDiv.innerHTML += 'jarak terdekat yaitu ke titik ke ' + idx_terdekat + '<br>yaitu ' + res[idx_terdekat].nama_tempat;

            //fungsi untuk gambar jalurnya
            var start = titik_saat_ini;
            var end = new google.maps.LatLng(res[idx_terdekat].latitude, res[idx_terdekat].longitude);

            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setOptions({ suppressMarkers: true });


            var bounds = new google.maps.LatLngBounds();
            bounds.extend(start);
            bounds.extend(end);
            map.fitBounds(bounds);
            var request = {
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                    directionsDisplay.setMap(map);
                } else {
                    alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
                }
            });
            // var jpembayaran = $("input[type=radio][name=jpembayaran]")[2];
            $("[name=jpengiriman]").change(change_display_pembayaran);
            // $('input[name=jpengiriman]:radio').click(function () {
            //   var jpengirim = $('input[name=jpengiriman]:radio:checked').val();
            //   if (jpengirim == "Biasa" || jpengirim == "Cepat") {
            //     jpembayaran.disabled = true;
            //     $('input[name=jpembayaran]:radio').prop("checked", false);
            //     $("#jpembayaran3").hide();

            //     // loadAlamat(); //Re-load Alamat Usaha untuk Biaya Ongkir
            //     // $(".total-harga-pengiriman").html("Rp&nbsp;" + formatNumber(feeKirim));
            //   }
            //   else {

            //     jpembayaran.disabled = false;
            //     $("#jpembayaran3").show();
            //     $('input[name=jpembayaran]:radio').prop("checked", false);

            //     // TotalPembayaran(feeKirim, allProductSum);
            //     // loadAlamat();
            //   }
            //   $(".total-harga-pengiriman").html("Rp&nbsp;" + formatNumber(feeKirim_temp));
            // });
            loadPesanan();
        }
    });
}

function change_display_pembayaran() {
    var jpengiriman_val = $("[name=jpengiriman]:checked").val();
    console.log("Jenis Pengiriman : " + jpengiriman_val);
    if (jpengiriman_val == "Biasa" || jpengiriman_val == "Cepat") {
        document.getElementById("rowpembayaran3").style.display = "none";
        document.getElementById("rowpembayaran1").style.display = "block";
        document.getElementById("rowpembayaran2").style.display = "block";
        feeKirim_temp = feeKirim;
        $(".total-harga-pengiriman").html("Rp&nbsp;" + formatNumber(feeKirim));
        loadPesanan();
    } else {
        document.getElementById("rowpembayaran3").style.display = "block";
        document.getElementById("rowpembayaran1").style.display = "block";
        document.getElementById("rowpembayaran2").style.display = "block";
        feeKirim_temp = 0;
        $(".total-harga-pengiriman").html("Rp&nbsp;" + formatNumber(feeKirim_temp));
        $(".total-pembayaran").html("Rp&nbsp;" + formatNumber(allProductSum));
    }
}




function openModalAlamat() {
    $.getJSON(API_PEMBELI, { id_akun: storage.getItem('id_akun') }).then(onSuccessLoadAlamatPembeli).done(onDoneLoadAlamatPembeli);
    // instance_modal.open();
    $("#modalAlamat").modal("open");
}

function onBackKeyDown() {
    storage.removeItem('berat_produk');
    storage.removeItem('nama_produk');
    storage.removeItem('id_produk');
    storage.removeItem('namaVariasi');
    storage.removeItem('variasi');
    storage.removeItem('qty');
    storage.removeItem('harga_produk');
    storage.removeItem('fotoProduk');
    history.back();
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
}

var onSuccessLoadKendaraan = (e, status) => {
    if (e.data_kendaraan.length == 0) {
        document.getElementById("colpengiriman1").innerHTML = "";
        document.getElementById("colpengiriman2").innerHTML = "";
        // $("#jpengiriman1, #jpengiriman2").hide();
    }
}

var onFailLoadKendaraan = (error) => {
    $("#jpengiriman3").prop("checked", true);
    document.getElementById("colpengiriman1").innerHTML = "";
    document.getElementById("colpengiriman2").innerHTML = "";
    // $("#jpengiriman1, #jpengiriman2").hide();
}

var onSuccessLoadKurir = (e, status) => {
    if (e.data.length == 0) {
        document.getElementById("colpengiriman1").innerHTML = "";
        document.getElementById("colpengiriman2").innerHTML = "";
        // $("#jpengiriman1 #jpengiriman2").hide();
    }
}

var onFailedLoadKurir = (error) => {
    document.getElementById("colpengiriman1").innerHTML = "";
    document.getElementById("colpengiriman2").innerHTML = "";
    // $("#jpengiriman1 #jpengiriman2").hide();
}

var onSuccessLoadRekening = (e, status) => {
    if (status !== "success") {
        document.getElementById("rowpembayaran1").innerHTML = "";
        document.getElementById("rowpembayaran2").innerHTML = "";
        // $("#jpembayaran1 #jpembayaran2").hide();
    }
}

var onFailLoadRekening = (error) => {
    $("#jpembayaran3").prop("checked", true);
    document.getElementById("rowpembayaran1").innerHTML = "";
    document.getElementById("rowpembayaran2").innerHTML = "";
}

function loadPesanan() {
    $(".produk-saya").html("");
    var total_semua;
    total_semua = 0;
    allProductSum = 0;
    var keranjang = storage.getItem('checked_item_checkout');
    var keranjangku = JSON.parse(keranjang);
    $.each(keranjangku.data_produk, function (key, val) {
        console.log(val);
        let harga_total_per_produk = parseInt(val.sub_total);
        let jml_produk = parseInt(val.jml_produk);
        let harga_produk = parseInt(val.harga_produk);
        let total_satuan = (harga_produk * jml_produk);
        let namaVariasi = val.nama_variasi;
        let nama_produk = val.nama_produk;
        let foto_produk = `${base_url}foto_usaha/produk/${val.foto_produk}`;
        total_semua += total_satuan;
        let perProductTotal = harga_produk * jml_produk;
        allProductSum += perProductTotal;
        let produk_saya = '<li class="collection-item avatar" id="item-produk-' + key + '">' +
            '<img class="circle image-produk" src="' + foto_produk + '">' +
            '<span class="title nama-produk">' + nama_produk + ' <small>(' + namaVariasi + ')</small></span>' +
            '<p><span class="harga-produk orange-text">Rp ' + harga_produk + '</span>' + '<span class="black-text">&nbsp &times &nbsp' + jml_produk + '&nbsp Kg' + '</span></p>' +
            '<div class="secondary-content right-align">' +
            '<a href="#!" onclick="remove_item(' + key + ')"><i class="tiny material-icons red-text">remove_shopping_cart</i></a>' +
            '<p class="orange-text">Rp ' + formatNumber(harga_total_per_produk) + '</p>' +
            '</div>' +
            '</li>';
        $(".produk-saya").append(produk_saya);
        console.log("Total Per Produk : " + harga_total_per_produk);
    });
    storage.setItem('allProductSum', allProductSum);
    $(".produk-saya").prepend('<li class="collection-header"><h5>Daftar Produk</h5></li>');
    $(".total-produk").html("Rp&nbsp;" + formatNumber(allProductSum));
    TotalPembayaran(feeKirim_temp, allProductSum);
}

function TotalPembayaran(feeKirim_temp = 0, biayaProduk) {
    console.log("feeKirim_temp : " + feeKirim_temp);
    console.log("biayaProduk :" + biayaProduk);
    var total = feeKirim_temp + biayaProduk;
    $(".total-pembayaran").html("Rp&nbsp;" + formatNumber(total));
}

var onSuccessLoadAlamatPembeli = (result, status) => {
    // result = JSON.parse(result);
    console.log("Detail Pembeli : ");
    console.log(result);
    $.each(result, function (row) {
        // console.log(result[row]);
        var alamat = result[row].alamat_pb;
        var kotaKab = result[row].kab_pb;
        var kecamatan = result[row].kec_pb;
        var kelurahan = result[row].kel_pb;
        var longitude = result[row].longitude_pb;
        var latitude = result[row].latitude_pb;
        firstLt = latitude;
        firstLg = longitude;
        $("#alamatLengkap").val(alamat);
        $("#kotaKabupaten").val(kotaKab);
        $("#kecamatan").val(kecamatan);
        $("#kelurahan").val(kelurahan);
        $("#latitude").val(latitude);
        $("#longitude").val(longitude);
        $("#id_akun").val(storage.getItem('id_akun'));
        $(".alamat-pengiriman").html(alamat + ',&nbsp;' + kelurahan + ',&nbsp;' + kecamatan + ',&nbsp;' + kotaKab);
    });
    // result = JSON.stringify(result);
    // rest = [{'latitude' : latitude, 'longitude': longitude, 'nama_tempat' : alamat, 'kota' : kotaKab, 'kecamatan' : kecamatan, 'kelurahan': kelurahan, 'deskripsi' : 'Alamat Pembeli', 'id_tempat':storage.getItem('id_akun')}];
    var res = [{ latitude: parseFloat(latitude.value), longitude: parseFloat(longitude.value), nama_tempat: result[0].alamat_pb }];
    console.log(res);
    initMap1(res);
}

var onDoneLoadAlamatPembeli = () => {
    initMap(firstLt, firstLg);
}

function loadAlamatUsaha() {
    console.log("Load Alamat Usaha");

    // return resultAlamatUsaha;
}

var onSuccessLoadAlamatUsaha = (result, status) => {
    // var a = [result];
    console.log("result loadAlamatUsaha: " + JSON.stringify(result));
    // resultAlamatUsaha = result;
    console.log(result.data_usaha);
    latUsaha = parseFloat(result.latitude);
    lngUsaha = parseFloat(result.longitude);
    // return {'latitude': result.latitude, 'longitude': result.longitude};
}

function remove_item(key) {
    var keranjangku = JSON.parse(localStorage.keranjang);
    console.log("Remove Item : ");
    console.log(JSON.stringify(keranjangku[key]));
    var itemPriceToRemove = keranjangku[key]["total_harga"];
    var allProductSum = storage.getItem('allProductSum');
    allProductSum -= itemPriceToRemove;
    keranjangku.splice(key, 1);
    $(".item-produk-" + key).hide(100);
    $(".item-produk-" + key).remove();
    console.log(JSON.stringify(keranjangku));
    localStorage.setItem("keranjang", JSON.stringify(keranjangku));
    M.toast({ html: 'Berhasil hapus 1 produk pada pesanan', inDuration: 100 });
    $(".produk-saya").html("");
    loadPesanan();
    if (keranjangku.length < 1) {
        localStorage.removeItem("id_produk");
        M.toast({
            html: 'Item keranjang kosong, akan menuju halaman toko...',
            inDuration: 200,
            completeCallback: function () { window.location.href = "../../penjual/detail_usaha_by_pembeli.html" }
        });
        window.history.go(-1);
        // window.location.href="../../penjual/detail_usaha_by_pembeli.html";
    }
}

function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
}
function simpan_alamat() {
    $.post(API_PEMBELI_UPDATE_ALAMAT, $("#input-alamat").serialize()).then(onSuccessSimpanAlamat).fail(onFailSimpanAlamat);
}

var onSuccessSimpanAlamat = (result, status) => {
    console.log("Data Alamat : " + $("#input-alamat").serialize());
    M.toast({ html: 'Berhasil simpan alamat <i class="material-icons green-text">check_circle<i>' });
    $.getJSON(API_PEMBELI, { id_akun: storage.getItem('id_akun') }).then(onSuccessLoadAlamatPembeli).done(onDoneLoadAlamatPembeli);
}

var onFailSimpanAlamat = (result) => {
    console.log(result);
    M.toast({ html: 'Gagal simpan alamat <i class="material-icons red-text" onclick="return $(".toast").dismiss();">cancel<i>' });
}

function Beli() {
    if ($("input[type=radio][name=jpengiriman]").val() == null || $("input[type=radio][name=jpembayaran]").val() == null || $("input[type=text][name=tglPengiriman]").val() == null) {
        M.toast({ html: 'Gagal simpan Transaksi karena masih ada yang anda lengkapi. Selahkan lengkapi form diatas <i class="material-icons red-text" onclick="return $(".toast").dismiss();">cancel<i>' });
    }
    var Jpembayaran = $("input[type=radio][name=jpembayaran]:checked").val();
    if (Jpembayaran == null || Jpembayaran == "") {
        M.toast({ html: 'Jenis Pembayaran Mohon Dipilih' });
        return false;
    }
    var Jpengiriman = $("input[type=radio][name=jpengiriman]:checked").val();
    if (Jpengiriman == null || Jpengiriman == "") {
        M.toast({ html: 'Jenis Pengiriman Mohon Dipilih' });
        return false;
    }
    var TglPengiriman = $("input[type=text][name=tglPengiriman]").val();
    if (TglPengiriman == null || TglPengiriman == "") {
        M.toast({ html: 'Tanggal Pengiriman Mohon Dipilih' });
        return false;
    }
    storage.setItem('Jpengiriman', Jpengiriman);
    storage.setItem('Jpembayaran', Jpembayaran);
    let data_keranjang = JSON.parse(storage.getItem('checked_item_checkout'));
    var DataPemesanan = {
        jarak: jarakPengiriman,
        id_akun: storage.getItem('id_akun'),
        id_usaha: storage.getItem('id_usaha'),
        keranjang: data_keranjang.data_produk,
        totalBiayaPengiriman: feeKirim_temp,
        totalBiayaProduk: allProductSum,
        jpengiriman: $("input[type=radio][name=jpengiriman]:checked").val(),
        jpembayaran: $("input[type=radio][name=jpembayaran]:checked").val(),
        tglPengiriman: $("input[type=text][name=tglPengiriman]").val()
    };
    simpanPemesanan(DataPemesanan);
}

function simpanPemesanan(DataPemesanan) {
    $.post(API_CREATE_PESANAN, DataPemesanan).then(onSuccessCreate).fail(onFailedCreate).done(onDoneCreate);
}

function onSuccessCreate(result, status) {
    console.log(result);
    if (result.responseCode == "00") {
        var Jpembayaran = storage.getItem('Jpembayaran');
        var Jpengiriman = storage.getItem('Jpengiriman');
        storage.setItem("id_pemesanan", result.id_pemesanan);
    }
}

function onDoneCreate() {
    $.getJSON(base_url + 'api/pesanan/detail-pesanan-by-id', { id_pemesanan: localStorage.id_pemesanan }).then(onSuccessGetDetail);
}

function onFailedCreate() {
    M.toast({ html: 'Gagal simpan Transaksi karena ' + result.responseMessage + ' <i class="material-icons red-text" onclick="return $(".toast").dismiss();">cancel<i>' });
}

function onSuccessGetDetail(e, status) {
    if (e.responseMessage == "success") {
        console.log(e);
        var dataPesanan = e.dataPesanan;
        console.log("DataPesanan : ");
        console.log(dataPesanan);
        var AllPurchaseProduk = dataPesanan.AllPurchaseProduk;
        AllPurchaseProduk = JSON.stringify(AllPurchaseProduk);
        var ID = dataPesanan.ID;
        var JenisPengiriman = dataPesanan.JenisPengiriman;
        var DataPembayaran = dataPesanan.DataPembayaran;
        var metodePembayaran = DataPembayaran.metode_pembayaran;
        localStorage.setItem("statusPemesanan", "Baru");
        localStorage.setItem("JenisPengiriman", JenisPengiriman);
        localStorage.setItem("metodePembayaran", metodePembayaran);
        localStorage.setItem('idPemesanan', dataPesanan.idPemesanan);
        localStorage.setItem("DetailPesanan", JSON.stringify(dataPesanan));
        localStorage.setItem("AllPurchaseProduk", AllPurchaseProduk);
        localStorage.setItem("status", "Baru");
        localStorage.setItem("NOPESANAN", ID);

        // storage.removeItem('berat_produk');
        // storage.removeItem('nama_produk');
        // storage.removeItem('id_produk');
        // storage.removeItem('namaVariasi');
        // storage.removeItem('variasi');
        // storage.removeItem('qty');
        // storage.removeItem('harga_produk');
        // storage.removeItem('fotoProduk');
        // storage.removeItem("keranjang");
        // storage.removeItem("allProductSum");
        // storage.removeItem("alamat");
        // storage.removeItem("id_usaha");
        // storage.setItem("id_pesanan", dataPesanan.idPemesanan);
        M.toast({ html: 'Berhasil simpan Transaksi, silahkan tunggu beberapa saat. <i class="material-icons green-text" onclick="return $(".toast").dismiss();">check_circle<i>', inDuration: 2900 });
        if (metodePembayaran == "Full Transfer") {
          setTimeout(function () { window.location.href = "pembayaran-fulltransfer.html"; }, 1000);
        } else if (metodePembayaran == "Transfer Cash") {
          if (JenisPengiriman == "Biasa" || JenisPengiriman == "Cepat") {
            setTimeout(function () { window.location.href = "pembayaran-dp-kirim.html" }, 1000);
          } else if (JenisPengiriman == "Ambil di Toko") {
            setTimeout(function () { window.location.href = "pembayaran-dp-ambil.html"; }, 1000);
          }
        } else if (metodePembayaran == "Full Cash") {
          setTimeout(function () { window.location.href = "pesanan-saya.html"; }, 1000);
        }
    } else {
        alert(e.responseMessage);
        return false;
    }
}

function hitung() {
    var harga_final = $(".qty").val() * harga_produk;
    $(".harga").html('<strong class="tx-12 tx-orange">Rp&nbsp;' + harga_final + '</strong>');
    return harga_final;
}