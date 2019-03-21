app.service("ValidationService", ValidationService);

function ValidationService(){

    var _priv = {
        validateEmail: function(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        },
        validateNumber: function(number){
            var re = _priv.getTelephoneRegix();
            return re.test(number);
        },
        getTelephoneRegix: function(){
            return new RegExp(/^[0-9\-()+.\s]{10,50}$/);
        },
        isURL: function(url){
            var pattern = new RegExp('^((https?:)?\\/\\/)?'+ // protocol
            '(?:\\S+(?::\\S*)?@)?' + // authentication
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locater
            if (!pattern.test(url)) {
                return false;
            } else {
                return true;
            }
        }
    };
    return {
        validateEmail: _priv.validateEmail,
        validateNumber: _priv.validateNumber,
        getTelephoneRegix: _priv.getTelephoneRegix,
        isURL: _priv.isURL
    };
}