# instijl-media.github.io

**data.json**<br />
{<br />
  &nbsp;"id": "_give this user license an unique ID_",<br />
  &nbsp;"shopid": "_Webshop ID_",<br />
  &nbsp;"url": "_url of webshop_",<br />
  &nbsp;"key": "_generate an api key (https://codepen.io/corenominal/pen/rxOmMJ)_",<br />
  &nbsp;"plugins": [<br />
  _&nbsp;&nbsp;Loop all plugins here._<br />
    &nbsp;&nbsp;{<br />
      &nbsp;&nbsp;&nbsp;&nbsp;"title":"_title of plugin. Example: ism_products_connector_",<br />
      &nbsp;&nbsp;&nbsp;&nbsp;"src":"_Link of file. Example: https://instijl-media.github.io/product-connector/main.js_"<br />
    &nbsp;&nbsp;}<br />
  &nbsp;]<br />
}<br />

**app.json**<br />
Add this file to your assets in your webshop.
When you have added the app.js file to your assets, you go to the <head> of your webshop and added the script below.<br/>
_<script src="{{ 'app.js' | url_asset }}?id={{ shop.id }}&secret=_YOUR GENERATED API KEY_" type="module" id="ism_app"></script>_

If you have still the template editor deactivated, your can add the script below.<br />
_<script src="https://instijl-media.github.io/app.js?id={{ shop.id }}&secret=_YOUR GENERATED API KEY_" type="module" id="ism_app"></script>_
