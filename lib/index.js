
const hawk = require('hawk');

var _bpc_url = 'https://bpc.berlingskemedia.net';
var _app;

const lib = {

  conf: function(input){

    if(input.url){
      _bpc_url = input.url;
      const lastIndexOfSlash = _bpc_url.lastIndexOf('/');
      if (lastIndexOfSlash === _bpc_url.length - 1) {
        _bpc_url = _bpc_url.substring(0, lastIndexOfSlash);
      }
    }

    if(input.app){
      _app = input.app;
    }
  },

  link: function(elementId, returnUrl){
    var a = document.getElementById(elementId.replace('#',''));
    a.href =  _bpc_url.concat('/au/ticket');
    if(returnUrl && returnUrl.length > 0){
      a.href = a.href.concat('?returnUrl=', returnUrl);
    }
  },

  get: function(callback){

    if(callback === undefined || typeof callback !== 'function'){
      callback = function(){};
    }

    const bpc_auti = readCookie('bpc_auti');
    var ticket;
    try {
      ticket = JSON.parse(window.atob(bpc_auti));
    } catch(err){};

    if (ticket && ticket.exp > hawk.utils.now()) {
      requestUserData(ticket, function (permissions){
        callback({permissions: permissions, ticket: ticket, generated: false});
      });
    } else {
      requestTicket(function (ticket, generated_header) {
        if (ticket === null) {
          callback({permissions: null, ticket:null, generated: false});
        } else {
          setTicketCookie(ticket);
          requestUserData(ticket, function (permissions){
            callback({permissions: permissions, ticket: ticket, generated: generated_header});
          });
        }
      });
    }
  },


  exists: requestAuidExists

};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = lib;
}


function requestUserData(ticket, callback) {
  requestUrl('/au/data', ticket, callback)
}

function requestPermissions(ticket, callback) {
  requestUrl('/permissions', ticket, callback)
}

function requestUrl(urlParam, ticket, callback) {

  if(!ticket || !ticket.id || !ticket.app || !ticket.user || !ticket.key){
    return callback(new Error('Invalid ticket'));
  }

  const url = _bpc_url.concat(urlParam);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);

  var hawkHeader = hawk.client.header(url, 'GET', {credentials: ticket, app: ticket.app});
  if (hawkHeader.err) {
    return callback(new Error(hawkHeader.err));
  }

  xhr.setRequestHeader('Authorization', hawkHeader.field);

  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        callback(JSON.parse(xhr.response));
      } catch(ex) {
        callback(null);
      }
    } else if (xhr.status === 404) {
      callback(null);
    } else if (xhr.status === 500) {
      eraseTicketCookie();
      callback(null);
    } else {
      callback(null);
    }
  };
  xhr.send();
}


function requestTicket(callback){

  if (!_app) {
    return callback(new Error('App not set'));
  }

  const url = _bpc_url.concat('/au/ticket', '?app=', _app);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.withCredentials = true;
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        callback(JSON.parse(xhr.response), xhr.getResponseHeader('X-AUID-GENERATED'));
      } catch (ex) {
        callback(null);
      }
    } else if (xhr.status === 204) {
      // Perhaps it could be useful to return something different,
      callback(null);
    } else {
      callback(null);
    }
  };
  xhr.send();
}


function requestAuidExists(callback){
  const url = _bpc_url.concat('/au/ticket/exists');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.withCredentials = true;
  xhr.onload = function() {
    if (xhr.status === 200) {
      callback(true);
    } else {
      callback(false);
    }
  };
  xhr.send();
}


function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length,c.length);
    }
  }
  return null;
}


function setTicketCookie(ticket){
  var expiresDate = new Date();
  // expiresDate.setMonth(expiresDate.getMonth() + (12 * 15)); // Fifteen years
  expiresDate.setMonth(expiresDate.getMonth() + (12)); // One year
  // expiresDate.setHours(expiresDate.getHours() + 1); // One hour
  // document.cookie = "bpc_auid=" + ticket.user + ";expires=" + expiresDate
  // + ";domain=." + document.domain + ";path=/";
  document.cookie = "bpc_auti=" + window.btoa(JSON.stringify(ticket)) + ";expires=" + expiresDate
  + ";domain=." + document.domain + ";path=/";
}


function eraseTicketCookie(name,value,days) {
  document.cookie = "bpc_auti=;expires=Thu, 01 Jan 1970 00:00:00 UTC;domain=." + document.domain + ";path=/";
}


function browserDetection() {
  //Check if browser is IE
  if (navigator.userAgent.search("MSIE") > 0) {
    // insert conditional IE code here
    console.log('Browser is Internet Explorer');
  }
  //Check if browser is Chrome
  else if (navigator.userAgent.search("Chrome") > 0) {
    // insert conditional Chrome code here
    console.log('Browser is Chrome');
  }
  //Check if browser is Firefox
  else if (navigator.userAgent.search("Firefox") > 0) {
    // insert conditional Firefox Code here
    console.log('Browser is Firefox');
  }
  //Check if browser is Safari
  else if (navigator.userAgent.search("Safari") > 0 && navigator.userAgent.search("Chrome") < 0) {
    // insert conditional Safari code here
    console.log('Browser is Safari');
  }
  //Check if browser is Opera
  else if (navigator.userAgent.search("Opera") > 0) {
    // insert conditional Opera code here
    console.log('Browser is Safari');
  }
}
