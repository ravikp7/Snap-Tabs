
var name="";



//Loads snaps in selection box
function loadsnaps(){
var x=document.getElementById('snaps');
while(x.length>0){
    x.remove(x.length-1);
}

chrome.storage.sync.get(null,function(items){
        for(key in items){
            var option=document.createElement("option");
            option.text= key;
            document.getElementById('snaps').add(option);
        }
    });
}
loadsnaps();





//Deletes snaps
function deletesnap(){
    chrome.storage.sync.remove(document.getElementById('snaps').value,function(){
        console.log("deleted");
    });
    loadsnaps();
    show();
   
}





//Confirm snap deletion
function conf(){
    document.getElementById('buttons').style.display='none';
    document.getElementById('conf').style.display='block';
}




// Show buttons again
function show(){
    document.getElementById('buttons').style.display='block';
    document.getElementById('conf').style.display='none';
}







//Creates the tabs for saved snaps
function createtabs(){
    name=document.getElementById('snaps').value;
    chrome.storage.sync.get([name],function(obj){
        var a=obj[name];
        console.log(a);
        a.forEach(function(url){
            chrome.tabs.create({'url':url});
        });
    });
}






//Saves the snap of current tabs
function savesnaps(){
   var t=[]; 
    name=document.getElementById('name').value;
    name=name.trim();
    name=name.replace(/\s{2,}/g, ' ');

    if(!name) {document.getElementById("alert").style.display='block';}
    else{
    chrome.tabs.query({'currentWindow': true},function(tabs){
        tabs.forEach(function(tab,index){
            
          t[index]=tab.url;
        });
        
        
        var ob={};
        ob[name]=t;
        chrome.storage.sync.set(ob,function(){
            console.log("saved");
        });
    });
    
        setTimeout(loadsnaps,30);
        document.getElementById('name').value=null;
}
}






// Add date and time to text input
function adddate(){
    var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var dat=new Date();
    var d=dat.getDate();
    var m=months[dat.getMonth()];
    var hr=dat.getHours();
    var min=dat.getMinutes();
    if(d<10){d="0"+d;}
    if(min<10){min="0"+min;}
    if (hr>12){hr=hr-12;}
    else if (hr==12){hr=hr+":"+min+" PM";}
    else {hr=hr+":"+min+" AM";}
    if(hr<12){hr= "0"+hr+":"+min+" PM";}

    console.log(hr);
    document.getElementById('name').value+=(" "+m+" "+d+", "+hr);
}







document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('save').addEventListener('click',savesnaps);
    document.getElementById('open').addEventListener('click',createtabs);  
    document.getElementById('remove').addEventListener('click',conf);
    document.getElementById('date').addEventListener('click',adddate);
    document.getElementById('name').addEventListener('focus',function(){document.getElementById("alert").style.display='none';});
    document.getElementById('yes').addEventListener('click',deletesnap);
    document.getElementById('no').addEventListener('click',show);
});