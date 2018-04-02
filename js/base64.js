var Base64 = {};
Base64.table = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
  'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '0', '1', '2', '3',
  '4', '5', '6', '7', '8', '9', '+', '/'
];

Base64.utf16to8 = function(str) {  
  var ret = []
  var len = str.length;  
  for (var i = 0; i < len; i++) {  
    var code = str.charCodeAt(i);  
    if (code > 0x0000 && code <= 0x007F) {  
      ret.push(str.charAt(i));  
    } 
    else if (code >= 0x0080 && code <= 0x07FF) {  
      ret.push(  
        String.fromCharCode(0xC0 | ((code >> 6) & 0x1F)),   
        String.fromCharCode(0x80 | (code & 0x3F))  
      );  
    } 
    else if (code >= 0x0800 && code <= 0xFFFF) {  
      ret.push(  
        String.fromCharCode(0xE0 | ((code >> 12) & 0x0F)),   
        String.fromCharCode(0x80 | ((code >> 6) & 0x3F)),   
        String.fromCharCode(0x80 | (code & 0x3F))  
      );  
    } 
    else if (code >= 0x00010000 && code <= 0x001FFFFF) {  
    } 
    else if (code >= 0x00200000 && code <= 0x03FFFFFF) {  
    } 
    else if (code >= 0x04000000 && code <= 0x7FFFFFFF) {  
    }  
  }  
   return ret.join('');  
};

Base64.utf8to16 = function(str){
  var res = [], len = str.length;  
  var i = 0;  
  for (var i = 0; i < len; i++) {  
    var code = str.charCodeAt(i);  
    if (((code >> 7) & 0xFF) == 0x0) {  
      // 0xxxxxxx  
      res.push(str.charAt(i));  
    } else if (((code >> 5) & 0xFF) == 0x6) {  
      // 110xxxxx 10xxxxxx  
      var code2 = str.charCodeAt(++i);  
      var byte1 = (code & 0x1F) << 6;  
      var byte2 = code2 & 0x3F;  
      var utf16 = byte1 | byte2;  
      res.push(String.fromCharCode(utf16));  
    } else if (((code >> 4) & 0xFF) == 0xE) {  
      // 1110xxxx 10xxxxxx 10xxxxxx  
      var code2 = str.charCodeAt(++i);  
      var code3 = str.charCodeAt(++i);  
      var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);  
      var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);  
      utf16 = ((byte1 & 0x00FF) << 8) | byte2  
      res.push(String.fromCharCode(utf16));  
    } else if (((code >> 3) & 0xFF) == 0x1E) {  
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  
    } else if (((code >> 2) & 0xFF) == 0x3E) {  
      // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx  
    } else if (((code >> 1) & 0xFF) == 0x7E) {  
      // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx  
    }  
  }  
  return res.join('');  
}

Base64.encode = function(data) {
  if (!data) {
    return '';
  }
 
  var utf8 = data;
  var i = 0; 
  var len = utf8.length;
  var ret = [];
  while (i < len) {
    var c1 = utf8.charCodeAt(i++) & 0xFF;
    ret.push(this.table[c1 >> 2]);
    if (i == len) {
      ret.push(this.table[(c1 & 0x3) << 4]);
      ret.push('==');
      break;
    }
    var c2 = utf8.charCodeAt(i++);
    if (i == len) {
      ret.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
      ret.push(this.table[(c2 & 0x0F) << 2]);
      ret.push('=');
      break;
    }
    var c3 = utf8.charCodeAt(i++);
    ret.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
    ret.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
    ret.push(this.table[c3 & 0x3F]);
  }
  
  return ret.join('');
};

Base64.decode = function(s){
  var map = {};
  for (var i=0; i<this.table.length; i++) {
    map[this.table[i]] = i;
  }
  map['='] = 0;
  
  var ret = [];
  var len=s.length;
  s += "====";
  for (var i=0; i<len; i+=4) { 
    var c1 = s.charAt(i);
    var c2 = s.charAt(i+1);
    var c3 = s.charAt(i+2);
    var c4 = s.charAt(i+3);
    ret.push(String.fromCharCode (((map[c1] << 2) & 0xff) | (map[c2] >> 4)));
    if (c3 != '=') ret.push(String.fromCharCode (((map[c2] << 4) & 0xff) | (map[c3] >> 2)));
    if (c4 != '=') ret.push(String.fromCharCode (((map[c3] << 6) & 0xff) | map[c4]));
  }
  return ret.join('');
}
