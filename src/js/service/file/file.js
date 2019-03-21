app.service("FileService", FileService);

function FileService(){

    var geocoder;
    var map;
    var address;

    var _priv = {
        b64toBlob: function(b64Data, contentType, sliceSize) {
            contentType = contentType || '';
            sliceSize = sliceSize || 512;
    
            var byteCharacters = atob(b64Data);
            var byteArrays = [];
    
            for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                var slice = byteCharacters.slice(offset, offset + sliceSize);
    
                var byteNumbers = new Array(slice.length);
                for (var i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
    
                var byteArray = new Uint8Array(byteNumbers);
    
                byteArrays.push(byteArray);
            }
    
          var blob = new Blob(byteArrays, {type: contentType});
          return blob;
        },
        imageBase64ToBlob: function(imgBase64){
            var ImageURL = imgBase64;
            // Split the base64 string in data and contentType
            var block = ImageURL.split(";");
            // Get the content type of the image
            var contentType = block[0].split(":")[1];// In this case "image/gif"
            // get the real base64 content of the file
            var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."
            // Convert it to a blob to upload
            var blob = _priv.b64toBlob(realData, contentType);
            return blob;
        }
    };
    return{
        imageBase64ToBlob: _priv.imageBase64ToBlob
    };
}