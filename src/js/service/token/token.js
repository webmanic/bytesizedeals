app.service("TokenService", TokenService);

function TokenService(){

    var _priv = {
        generateToken: function(length){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
            for (var i = 0; i <= length; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text.toUpperCase();
        }
    };
    return {
        generateToken: _priv.generateToken
    };
}