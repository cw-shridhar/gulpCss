/*
1) Load This file in all layout files
2) Declare varible const LOADBTFSCRIPTS = "loadBtfScripts";  in layout files
   refer _MLayout_V2.cshtml
3) consume/listen event LOADBTFSCRIPTS, on each page and pass btf script file names to
Consume LOADBTFSCRIPTS event on each page to render btf jaavscripts
refer : Static\m\JavaScript\model.js
*/
const loadBtfScriptsEvent = new Event( LOADBTFSCRIPTS );
function lazyLoadScripts()
{
    window.dataLayer.push( {
        event: "LoadScriptsEventComplete",
     } );
    window.dispatchEvent(loadBtfScriptsEvent);
}
window.addEventListener( 'load', () => {
     setTimeout( lazyLoadScripts, 4000 );
} );

function loadJS( FILE_URL, async = true ) {
  let scriptEle = document.createElement("script");

  scriptEle.setAttribute("src", FILE_URL);
  scriptEle.setAttribute("type", "text/javascript");
  scriptEle.setAttribute("async", async);
  document.body.appendChild(scriptEle);
}

function loadLocalScripts(fileList)
{
    for ( let i = 0; i < fileList.length; i++ )
    {
        loadJS( fileList[i] );
    }
}
