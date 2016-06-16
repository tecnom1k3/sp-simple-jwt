$(function(){

    var store = store || {};

    store.init = function() {
        this.iat = null;
        this.nbf = null;
        this.exp = null;
        this.currentTimeContainer = $("#currentTime");
        this.iatContainer = $("#iat");
        this.nbfContainer = $("#nbf");
        this.expContainer = $("#exp");
        this.tokenContainer = $("#token");
        this.decodedTokenContainer = $("#decodedToken");
    }

    /**
     * Export the current JWT values to the specified containers.
     */
    store.exportValues = function(){
        this.tokenContainer.html(this.jwt || '&nbsp;');
        var parsedJSON = JSON.parse(this.claim);

        var iatString = '';
        var nbfString = '';
        var expString = '';

        if (parsedJSON) {
            this.iat = new Date(parsedJSON.iat * 1000);
            this.nbf = new Date(parsedJSON.nbf * 1000);
            this.exp = new Date(parsedJSON.exp * 1000);

            iatString = this.dateObjToString(this.iat);
            nbfString = this.dateObjToString(this.nbf);
            expString = this.dateObjToString(this.exp);
        }
        var beautifiedJSON = JSON.stringify(parsedJSON, null, 4);
        this.decodedTokenContainer.html( ((this.claim)) ? beautifiedJSON : '&nbsp;');

        store.iatContainer.html(iatString);
        store.nbfContainer.html(nbfString);
        store.expContainer.html(expString);
    }

    /**
     * Decodes the JWT
     * @param jwt
     * @returns {*}
     */
    store.decodeToken = function(jwt){
        var a = jwt.split(".");
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

    /**
     *
     * @param date
     * @returns {string}
     */
    store.dateObjToString = function(date) {
        return date.toDateString() + ' ' + date.toLocaleTimeString();
    }

    setInterval(function() {
        var currentTime = new Date();
        store.currentTimeContainer.html(store.dateObjToString(currentTime));
    }, 100);

	$("#frmLogin").submit(function(e){
        e.preventDefault();
        $.post('auth.php', $("#frmLogin").serialize(), function(data){
            store.setJwt(data.jwt);
            store.exportValues();
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
                $("#resourceContainer").html('<img src="data:image/jpeg;base64,' + data.img + '" />');
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
        store.iat = null;
        store.nbf = null;
        store.exp = null;
        store.exportValues();
        $("#resourceContainer").html('');
    });

    store.init();
});