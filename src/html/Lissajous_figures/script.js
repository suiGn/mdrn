const canvas = document.getElementById('lissajousCanvas');
const ctx = canvas.getContext('2d');

let t = 0;
const amplitude = 100;
const frequencyX = 3; // Frequency for x-direction
const frequencyY = 2; // Frequency for y-direction
const delta = Math.PI / 2; // Phase difference

function drawLissajous() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    for (let i = 0; i <= 2 * Math.PI; i += 0.01) {
        const x = canvas.width / 2 + amplitude * Math.sin(frequencyX * i + t);
        const y = canvas.height / 2 + amplitude * Math.sin(frequencyY * i + t + delta);
        ctx.lineTo(x, y);
    }
    
    ctx.strokeStyle = '#ff6347';
    ctx.lineWidth = 2;
    ctx.stroke();
    t += 0.01;
    requestAnimationFrame(drawLissajous);
}

drawLissajous();
