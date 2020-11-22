{


    const $data = document.getElementById("data");
    const $video = document.getElementById("video");
    const $livestream = document.getElementById("livestream");
    const $effect = document.getElementById("effect");

    let socket;
    let videoUrl;
    let peer;
    let livestream;

    const servers = {
        iceServers: [{
          urls: 'stun:stun.l.google.com:19302'
        }]
      };

    const init = () => {
        socket = io.connect('/');

        socket.on('connect', () => {
            console.log(`connected: ${socket.id}`);
            socket.on('disconnected', () => {
                console.log('disconnected');
            });

            socket.on('playVideo', video => {
                videoUrl = video;
                if(livestream){
                    livestream.getVideoTracks().forEach(function(track) { 
                        track.stop(); 
                    });
                    $livestream.style.display = "none";      
                }
                playVideo();
            });

            socket.on('signal', (feed, receiver, sender) => {
                console.log(feed);
                peer = new SimplePeer();
                peer.on("signal", data => {
                    console.log("send signal", data);
                    socket.emit("signal", data, sender, receiver);
                });
                peer.on('stream', stream => {
                    console.log("stream", stream);
                    livestream = stream;
                    $livestream.style.display = "block";
                    $video.style.display = "none";    
                    $livestream.srcObject = stream;
                });
                peer.signal(feed);                
            })
            
            socket.on('playEffect', title => {
                effect = title;
                playVideoWithEffect(effect);
            });
          
        });

    }

    const playVideo = () => {
        $video.style.display = "block";
        $video.src = ".." + videoUrl;
        $video.play();
        console.log($video.src);
    }

    const playVideoWithEffect = (effectType) => {
        if(effectType){
            $video.style.display = "none";
            $livestream.style.display = "none";
            $effect.style.display = "block";
            let seriously = new Seriously();
            let source;
            if(livestream){
                source = seriously.source($livestream);
            } else {
                source = seriously.source($video);
            }
            let target = seriously.target($effect);
            let effect = seriously.effect(effectType);
            effect.source = source;
            target.source = effect;
            seriously.go();
        } else {
            $video.style.display = "block";
            $effect.style.display = "none";
        }
    }

    init();
}