function _showwhatiscert(id,clname,vurl)
{
    var _inndivc = document.getElementById("popcertified-"+id).innerHTML;
	try{ document.getElementById("popcertified"+id).style.display = 'block'; }catch(e){  }
	try{ document.getElementById("pop1").style.display = 'block'; }catch(e){ }
	try{ document.getElementById("view_rep").style.display = 'block'; }catch(e){ }
	try{ document.getElementById("view_rep").href= vurl; }catch(e){  }
	if( _inndivc == ""  ){
	try{ document.getElementById("popcertified"+id).appendChild( document.getElementById("pop1") ); }catch(e){ }
	}
}
function _hidewhatiscert(id,clname){
document.getElementById("pop1").style.display = 'none';
 document.getElementById("popcertified-"+id).style.display = 'none';
}