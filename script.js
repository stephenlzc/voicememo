let mediaRecorder;
let audioChunks = [];
let audioBlob;
let audioUrl;
let audio = document.getElementById('audioPlayback');

document.getElementById('recordButton').addEventListener('click', async () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('recordButton').textContent = '开始录音';
    } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        document.getElementById('recordButton').textContent = '停止录音';

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks, { type: 'audio/m4a' });
            audioUrl = URL.createObjectURL(audioBlob);
            audio.src = audioUrl;
            document.getElementById('playButton').disabled = false;
            document.getElementById('sendButton').disabled = false;
            audioChunks = [];
        };
    }
});

document.getElementById('playButton').addEventListener('click', () => {
    audio.play();
});

document.getElementById('sendButton').addEventListener('click', () => {
    const formData = new FormData();
    const selectedType = document.querySelector('input[name="type"]:checked').value;
    formData.append('type', selectedType);
    formData.append('voice', audioBlob, 'recording.m4a');

    fetch('https://hook.eu2.make.com/o41oj3uai96jm3td78jroa0jav5o8rlc', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            alert('录音已发送');
        } else {
            alert('发送失败');
        }
    }).catch(error => {
        console.error('Error:', error);
        alert('发送失败');
    });
});
