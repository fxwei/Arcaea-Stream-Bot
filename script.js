
class SongList{
    constructor(MAX_SONGS = 20, MAX_SONGS_PER_USER = 1, CD = 60){
        this.MAX_SONGS = MAX_SONGS;
        this.MAX_SONGS_PER_USER = MAX_SONGS_PER_USER;
        this.USER_CD = CD;
        this.listElement = document.getElementById("list");
        this.labelElements = document.getElementsByTagName("label");
        this.functions = document.getElementsByClassName("func");
        this.checkedSongIndex = -1;
        this.isOffline = true;
        this.canAddSongs = false;
        this.statusElement = document.getElementById("status");

        this.textboxElement = document.getElementById("textbox");
        this.n = this.labelElements.length;
        this.checkRadio();
        
        //console.log("ctor: n="+this.n);
    }

    checkRadio(){
        this.updateSongPointers();
        let i = this.n-1;
        for (; i >= 0; i--){
            if(this.labelElements[i].children[0].checked)
                break;
        }
        this.checkedSongIndex = i;
        this.functions[2].disabled = (this.checkedSongIndex == -1);
    }

    unSelect(){
        if(this.checkedSongIndex == -1)return;
        this.labelElements[this.checkedSongIndex].children[0].checked = false;
        this.checkedSongIndex = -1;
        this.functions[2].disabled = true;
    }

    updateStatus(){
        this.statusElement.innerHTML=((this.canAddSongs)?"弹幕点歌运行中":"弹幕点歌已暂停")+" 当前队列共"+this.n+"首";
    }

    disableAddSongs(){
        this.canAddSongs = false;
        this.functions[1].disabled = true;
        this.functions[0].disabled = false;
        this.updateStatus();
        this.statusElement.style.color = "yellow";
    }

    enableAddSongs(){
        if(this.isOffline){
            this.isOffline=false;
            let ID = parseInt(this.textboxElement.value);
            if(isNaN(ID))
                webSocket();
            else
			webSocket(ID);
            this.textboxElement.value = "";
        }
        this.canAddSongs = true;
        this.functions[0].disabled = true;        
        this.functions[1].disabled = false;
        this.updateStatus();
        this.statusElement.style.color = "lawngreen";
    }

    toggleCanAddSongs(){
        this.canAddSongs = !this.canAddSongs;
    }

    updateSongPointers(){
        this.labelElements = document.getElementsByTagName("label");
        this.n = this.labelElements.length;

    }

    addSong(songName/*, user*/, isAdmin = false){
        if(!this.canAddSongs && !isAdmin)
            return false;
        if(isAdmin){
            if(this.textboxElement.value.replace(" ", "") == "")
                return false;
            
        }
        this.listElement.innerHTML += `<label><input type="radio" name="songs" onclick="bot.songlist.checkRadio()"><span class="container">${songName}</span></label>`;
        this.updateSongPointers();
        this.updateStatus();
        if(this.checkedSongIndex != -1)
            this.labelElements[this.checkedSongIndex].children[0].checked = true;
        if(isAdmin){
            this.textboxElement.value = "";
        }
        return true;
    }

    addDummy(length = -1){
        if(length==-1){
            length = Math.floor(Math.random()*20)+10;
        }
        let result = '';
        let characters = 'ABC DEF GHIJ KLMN OPQRS TUVWX YZabc defgh ijklm nopqr stuvw xyz0123 456789';
        let charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
        }
        this.addSong(result);
    }

    removeSong(){

        if(this.checkedSongIndex == -1 || this.checkedSongIndex >= this.n){
            //console.log("remove failed");
            return;
        }
            
        this.listElement.removeChild(this.labelElements[this.checkedSongIndex]);
        //console.log("remove successful");
        this.updateSongPointers();
        this.updateStatus();
        //console.log(this.n);
        //console.log(this.checkedSongIndex);
        if(this.n == this.checkedSongIndex){
            this.checkedSongIndex--;
        }
        if(this.checkedSongIndex != -1)
            this.labelElements[this.checkedSongIndex].children[0].checked = true;
        else
            this.functions[2].disabled = true;
    }

    moveUp(){
        
        if(this.checkedSongIndex <= 0)
            return false;
 
        let container1 = this.labelElements[this.checkedSongIndex], container2 = this.labelElements[this.checkedSongIndex-1];
        [container1.innerHTML, container2.innerHTML] = [container2.innerHTML, container1.innerHTML];
        container2.children[0].checked = true;
        this.checkedSongIndex--;
        return true;
    }

    moveDown(){
        
        if(this.checkedSongIndex >= this.n - 1 || this.checkedSongIndex == -1)
            return false;
        let container1 = this.labelElements[this.checkedSongIndex], container2 = this.labelElements[this.checkedSongIndex+1];
        [container1.innerHTML, container2.innerHTML] = [container2.innerHTML, container1.innerHTML];
        container2.children[0].checked = true;
        this.checkedSongIndex++;
        return true;    
    }

    moveTop(){
        while(this.moveUp());
    }

    moveBottom(){
        while(this.moveDown());
    }

}

class StreamBot {
    constructor(){
        this.songlist = new SongList();
        this.console = false;
    }
}

var bot = new StreamBot();
var default_ID = 1467969;

function parseText(text){
    if (text.slice(0,2)=="点歌" &&  [" ", ":", "：",",","，"].includes(text[2])){
        songToBeAdded = text.slice(3);
        if (songToBeAdded.replace(" ", "") != ""){
            bot.songlist.addSong(songToBeAdded);
            //bot.songlist.addSong(text);
        }
    }    
    
}

function archiveLog(){
    var prtContents = document.getElementsByClassName("log");
    var noPrints = document.getElementsByClassName("noPrint");
    for(let noPrint of noPrints)
        noPrint.style.display = "none";
    for(let prtContent of prtContents)
        prtContent.classList.add("onPrint");
    window.print();

    for(let noPrint of noPrints)
        noPrint.style.display = "block";
    for(let prtContent of prtContents)
        prtContent.classList.remove("onPrint");
}