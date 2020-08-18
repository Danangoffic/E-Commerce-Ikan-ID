var app = {
    init: function(){
        document.addEventListener("deviceready", this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        document.addEventListener("pause", this.onPause, false);
        document.addEventListener("resume", this.onResume, false);
        document.addEventListener("menubutton", this.onMenuKeyDown, false);
        $.getJSON(API_KERANJANG, {id_akun: localStorage.id_akun}).then(on_success_load_keranjang).fail()
    },
    onPause: function(){

    },
    onResume: function(){

    },
    onMenuKeyDown: function(){

    },
    on_success_load_keranjang: function(data, status){
        if(status=="success"){
            if(data.keranjang.length > 0){
                var keranjang = data.keranjang;
                foreach(keranjang, function(key, value){
                    var usaha = key;
                    
                });
            }
        }
    },
    on_fail_load_keranjang: function(){

    }
}
function onLoad() {
    app.init();
    // document.addEventListener("deviceready", onDeviceReady, false);
}