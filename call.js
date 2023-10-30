var peer = new Peer()
var myStream
var peerList = []

//this function will be initiating the peer
function init(userId){
    peer = new Peer(userId)
    peer.on('open',(id)=>{
        console.log(id+" Connected")
    })

    listenToCall();
}

//this function will keep listening to calls or incoming events
function listenToCall(){
    peer.on('call',(call=>{
        navigator.mediaDevices.getUserMedia({
            video: true, 
            audio: true
        }).then((stream)=>{
            myStream = stream
            addLocalVideo(stream)
            call.answer(stream)
            call.on('stream',(remoteStream)=>{
                if(!peerList.includes(call.peer)){
                    addRemoteVideo(remoteStream)
                    peerList.push(call.peer)
                }
            })
        }).catch((err)=>{
            console.log("Unable To Connect Because "+err)
        })
    }))
}

//this function will be called when we try to make a call
function makeCall(recieverId){
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    }).then((stream)=>{
        myStream = stream
        addLocalVideo(stream)
        let call = peer.call(recieverId, stream)
        call.on('stream',(remoteStream)=>{
            if(!peerList.includes(call.peer)){
                addRemoteVideo(remoteStream)
                peerList.push(call.peer)
            }
        })
    }).catch((err)=>{
        console.log("Unable To Connect Because "+err)
    })
}

//this function will add local stream
function addLocalVideo(stream){
    let video = document.createElement('video')
    video.srcObject = stream
    video.classList.add("video")
    video.muted = true //local video need to be muted because of noise issue
    video.play()
    document.getElementById("localVideo").append(video)
}

//this function will add remote stream
function addRemoteVideo(stream){
    let video = document.createElement('video')
    video.srcObject = stream
    video.classList.add("video")
    video.play()
    document.getElementById("remoteVideo").append(video)
}

