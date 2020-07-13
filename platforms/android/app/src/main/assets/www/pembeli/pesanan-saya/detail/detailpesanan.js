function onLoad() {
    load_detail_pesanan();
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
//
function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    // Add similar listeners for other events
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

function onBackKeyDown() {
    // Handle the back button
    localStorage.removeItem("DetailPesanan");
    location.replace("../pesanan-saya.html");
}

function load_detail_pesanan() {
    console.log("id_pemesanan : "+localStorage.idPemesanan);
    $.getJSON(API_DETAIL_PESANAN_PEMBELI, {id_pemesanan: localStorage.idPemesanan})
    .then(
        (e) => {
            if(e.responseMessage=="success"){
                var dataPesanan = e.dataPesanan;
                localStorage.setItem("DetailPesanan", JSON.stringify(dataPesanan));
            }
        }
    );
}

function return_pesanan_saya() {
    location.assign("../pesanan-saya.html");
}