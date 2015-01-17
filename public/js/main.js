$(function(){

    var store = store || {};

    /**
     * Export the current JWT values to the specified containers
     * @param tokenContainer
     * @param decodedTokenContainer
     */
    store.exportValues = function(tokenContainer, decodedTokenContainer){
        tokenContainer.html(this.jwt);
        decodedTokenContainer.html('<pre>' + JSON.stringify(JSON.parse(this.claim), null, 4) + '</pre>');
    }

    /**
     * Decodes the JWT
     * @param jwt
     * @returns {*}
     */
    store.decodeToken = function(jwt){
        var a =jwt.split(".");
        return  b64utos(a[1]);
    }

    /**
     * Sets the JWT to the store object
     * @param data
     */
    store.setJwt = function(data){
        this.jwt = data;
        this.claim = this.decodeToken(data);
    }

	$("#submit").click(function(e){
        e.preventDefault();
        $.post('login.php', $("#frmLogin").serialize(), function(data){
            store.setJwt(data);
            store.exportValues($("#token"), $("#decodedToken"));
            $("#loginForm").hide();
            $("#jwt").show();
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
            error: function() {
                alert('error');
            }
        });
    });

    $("#btnExpire").click(function(e){
        e.preventDefault();
        store.jwt = null;
        store.claim = null;
        store.exportValues($("#token"), $("#decodedToken"));
        $("#resourceContainer").html('');
        $("#loginForm").show();
        $("#jwt").hide();
        $("#resource").hide();
    });
});