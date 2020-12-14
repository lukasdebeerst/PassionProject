{
    const $data = document.getElementById("data");
    const $video = document.getElementById("video");
    const $livestream = document.getElementById("livestream");
    const $effect = document.getElementById("effect");

    let socket;
    let videoUrl;
    let peer;
    let livestream;
    let effect;
    let dynamic;

    const servers = {
        iceServers: [{
          urls: 'stun:stun.l.google.com:19302'
        }]
      };

    const init = () => {
        const server = "http://192.168.1.56:4000";
        socket = io.connect(server);

        socket.on('connect', () => {
            console.log(`connected: ${socket.id}`);
            socket.emit('device', "screen");
            socket.on('disconnected', () => {
                console.log('disconnected');
            });

            socket.on("handleStop", bool => {
                location.reload();
            })

            socket.on('video', video => {
                videoUrl = video;
                if(livestream){
                    livestream.getVideoTracks().forEach(function(track) { 
                        track.stop(); 
                    });
                    $livestream.style.display = "none";      
                }
                playVideo();
            });

            socket.on('signal', async (myId, signal, peerId) => {
                if (signal.type === 'offer') {
                    peer = new SimplePeer();
                    peer.on('signal', data => {
                        socket.emit('signal', peerId, data);
                    });
                    peer.on('stream', stream => {
                        livestream = stream;
                        $livestream.style.display = "block";
                        $video.style.display = "none";
                        $livestream.srcObject = stream;
                    });
                }
                peer.signal(signal);                
            })
            
            socket.on('effect', title => {
                effect = title;
                playVideoWithEffect(effect);
            });

            socket.on('dynamicEffect', (percent) => {
                dynamic = percent;
            })
          
        });

    }

    const playVideo = () => {
        $video.style.display = "block";
        $livestream.style.display = "none";
        $effect.style.display = "none";
        $video.src = ".." + videoUrl;
        $video.play();
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