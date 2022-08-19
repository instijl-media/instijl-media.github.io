# instijl-media.github.io

**data.json**
{
  "id": "_give this user license an unique ID_",
  "shopid": "_Webshop ID_",
  "url": "_url of webshop_",
  "key": "_generate an api key (https://codepen.io/corenominal/pen/rxOmMJ)_",
  "plugins": [
  _Loop all plugins here._
    {
      "title":"_title of plugin. Example: ism_products_connector_",
      "src":"_Link of file. Example: https://instijl-media.github.io/product-connector/main.js_"
    }
  ]
}

**app.json**
Add this file to your assets in your webshop.
When you have added the app.js file to your assets, you go to the <head> of your webshop and added the script below.
_<script src="{{ 'app.js' | url_asset }}?id={{ shop.id }}&secret=_YOUR GENERATED API KEY_" type="module" id="ism_app"></script>_

If you have still the template editor deactivated, your can add the script below.
_<script src="https://instijl-media.github.io/app.js?id={{ shop.id }}&secret=_YOUR GENERATED API KEY_" type="module" id="ism_app"></script>_
