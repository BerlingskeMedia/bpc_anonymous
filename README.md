# bpc_anonymous

# Usage

Example:

```
    <script>
      // bpca.setUrl('http://bpc.local:8085/');
      // bpca.setApp('test_sso_app');
      bpca.set({
        url: 'https://bpc.berlingskemedia-testing.net/',
        app:'test_sso_app'
      });

      bpca.getAuid(function(auid){
        if(auid instanceof Error){
          console.error('GET auid failed');
          return;
        }
        console.log('auid', auid);
      });

      bpca.getPermissions(function(permissions){
        if(permissions instanceof Error){
          console.error('GET permissions failed');
          return;
        }
        console.log('permissions', permissions);
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
