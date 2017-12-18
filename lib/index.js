
const hawk = require('hawk');

var env = 'prod';
var _bpc_url = 'https://bpc.berlingskemedia.net';
var _app = 'datalake_anonymous';

const lib = {

  setUrl(url){
    _bpc_url = url;
    const lastIndexOfSlash = _bpc_url.lastIndexOf('/');
    if (lastIndexOfSlash === _bpc_url.length - 1) {
      _bpc_url = _bpc_url.substring(0, lastIndexOfSlash);
    }
  },

  setApp(app_id){
    _app = app_id;
  },

  set(input){
    if(input.url){
      this.setUrl(input.url)
    }
    if(input.app){
      this.setApp(input.app)
    }
  },

  getAuid: function(callback){
    var bpc_auid = readCookie('bpc_auid');
    if(bpc_auid !== null) {
      callback(bpc_auid);
    } else {
      this.getTicket(function(ticket){
        if(ticket instanceof Error){
          callback(ticket);
        } else {
          callback(ticket.user);
        }
      });
    }
  },

  getTicket(callback) {

    var bpc_auti = readCookie('bpc_auti');
    var ticket;

    try {
      ticket = JSON.parse(window.atob(bpc_auti));
    } catch(err){};

    if (ticket && ticket.exp > hawk.utils.now()) {
      callback(ticket);
    } else {
      requestTicket(function (new_ticket) {
        console.log('Got the ticket', new_ticket);
        // var expiresDate = new Date();
        // expiresDate.setMonth(expiresDate.getMonth() + (12 * 15));
        // document.cookie = "bpc_auid=" + ticket.user + ";expires=" + expiresDate
        // + ";domain=." + document.domain + ";path=/";
        // document.cookie = "bpc_auti=" + window.btoa(JSON.stringify(ticket)) + ";expires=" + expiresDate
        // + ";domain=." + document.domain + ";path=/";
        callback(new_ticket);
      });
    }
  },

  getPermissions: function(callback){
    this.getTicket(function (ticket) {
      requestPermissions(ticket, callback);
    })
  }
};


if (typeof module !== 'undefined' && module.exports) {
    module.exports = lib;
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


function requestTicket(callback){

  if (_app === undefined) {
    return callback(new Error('App not set'));
  }

  const url = _bpc_url.concat('/ticket/anonymous', '?app=', _app);
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.withCredentials = true;
  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        callback(JSON.parse(xhr.response));
      } catch (ex) {
        callback(ex);
      }
    } else {
      callback(new Error(xhr.response));
    }
  };
  xhr.send();
}

function requestPermissions(ticket, callback) {

  if(!ticket || !ticket.id || !ticket.app || !ticket.user || !ticket.key){
    return callback(new Error('Invalid ticket'));
  }

  const url = _bpc_url.concat('/permissions/anonymous');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);

  let hawkHeader = hawk.client.header(url, 'GET', {credentials: ticket, app: ticket.app});
  if (hawkHeader.err) {
    return callback(new Error(hawkHeader.err));
  }

  xhr.setRequestHeader('Authorization', hawkHeader.field);

  xhr.onload = function() {
    if (xhr.status === 200) {
      try {
        callback(JSON.parse(xhr.response));
      } catch(ex) {
        callback(ex);
      }
    }
    else {
      callback(new Error(xhr.response));
    }
  };
  xhr.send();
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
