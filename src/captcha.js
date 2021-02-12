const { createCanvas } = require('canvas')
const fs = require('fs')

function captcha(text) {
    let updatedText = text
    // for (let i = 0; i < text.length; i++) {
    //     if (i % 2 === 0) updatedText += text[i].toUpperCase()
    //     else updatedText += text[i].toLowerCase()
    // }
    console.log(updatedText)
    const width = 1000
    const height = 400

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    // FILL THE PAGE WITH BLACK
    context.fillStyle = 'black'
    context.fillRect(0, 0, width, height)

    context.font = 'italic bold 70pt Calibri'
    context.textAlign = 'center'
    context.fillStyle = 'white'
    context.strokeStyle = "white"

    context.lineWidth = 5;
    // MOVE DOWN IMAGE SLIGHTLY
    context.translate(60, -60);
    context.rotate(10 * Math.PI / 180);

    // TEXT 1
    context.strokeText(updatedText, canvas.width / 2 + 6, canvas.height / 2 + 6);
    // TEXT 2
    context.fillText(updatedText, canvas.width / 2, canvas.height / 2)

    const textInfo = context.measureText(updatedText)

    // DRAW SIN WAVE
    context.strokeStyle = "black";
    context.lineWidth = 2;

    var x = 0, y = 0

    while (x < canvas.width) {
        y = (canvas.height / 2 - textInfo.actualBoundingBoxDescent) + textInfo.actualBoundingBoxAscent * Math.sin(x / 2);
        context.lineTo(x, y);
        x += 1;
    }
    context.stroke();

    context.lineWidth = 2;
    // DRAW RED LINE 2
    context.setLineDash([3, 3]);/*dashes are 5px and spaces are 3px*/
    context.strokeStyle = "black";

    // MULTIPLE DASHES
    for (let i = -30; i <= 30; i += 10) {
        context.moveTo(textInfo.actualBoundingBoxDescent + i, canvas.height / 2 - textInfo.emHeightDescent + i);
        context.lineTo(width + i, canvas.height / 2 - textInfo.emHeightDescent + i);
    }

    context.translate(60, -60);

    context.stroke();

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync('./Captcha.png', buffer)
    return "Captcha Generation Success";
}

module.exports = {
    captcha
}