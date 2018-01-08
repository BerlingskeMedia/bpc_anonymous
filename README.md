# bpc_anonymous

# Usage

Example:

```
  <script>
    bpca.conf({
      url: 'https://bpc.berlingskemedia-testing.net/',
      // url: 'http://bpc.local:8085/',
      app:'test_sso_app'
    });

    // bpca.exists(function(exists){
    //   console.log('exists', exists);
    // });

    bpca.get(function(response){
      if(response instanceof Error){
        console.error('GET permissions failed');
        return;
      }
      console.log('bpca.response', response);
      var elem = $('#bpc_auid');
      if (elem) {
        if(response.ticket === null){
          elem.text('Unitialized Safari user');
        } else {
          elem.text(response.ticket.user);
        }
      }
      var elem = $('#bpc_auid_permissions');
      if (elem) {
        elem.text(JSON.stringify(response.permissions));
      }
    });

  </script>
```

# API

## setUrl

## setApp

## set

## getAuid

## getTicket

## getPermissions
