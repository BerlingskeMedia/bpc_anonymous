# bpc_anonymous

# Usage

Example:

```
  <script>
    bpca.conf({
      url: 'https://bpc.berlingskemedia-testing.net/',
      app:'test_sso_app'
    });

    bpca.exists(function(exists){
      console.log('exists', exists);
    });

    bpca.get(function(response){
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

## conf

## get

## exists


# Development

Run `npm install` to install dependencies.

Run `webpack` to build the library to *dist/[VERSION]*-folder.

Run `npm start` to build the libary, watch the files for changes and serve the *dist*-folder from http://localhost:9000/.

## Versioning

Run `npm version [<newversion> | major | minor | patch ]` before pushing new version to GitHub.
