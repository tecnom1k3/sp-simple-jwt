$(function(){

    var store = store || {};

	$("#submit").click(function(e){
        e.preventDefault();
        $.post('login.php', $("#frmLogin").serialize(), function(data){
            store.jwt = data;

            var a = store.jwt.split(".");
            store.claim = b64utos(a[1]);

            $("#token").html(store.jwt);
            $("#decodedToken").html(store.claim);
            $("#loginForm").hide();
            $("#jwt").show()
            $("#resource").show();
        }).fail(function(){
            alert('error');
        });
    });

    $("#btnGetResource").click(function(e){
        e.preventDefault();
        $.ajax({
            url: 'resource.php',
            beforeSend: function(request){
                request.setRequestHeader('Authorization', 'Bearer ' + store.jwt);
            },
            type: 'GET',
            success: function(data) {
                $("#resourceContainer").html('<img src="data:image/png;base64,' + data.img + '" />');
            },
            error: function(err) {
                alert(err);
            }
        });
    });
});