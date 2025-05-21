//1 questao - Atividade aula 17

"use strict";

var gl;
var theta = vec3(0, 0, 0);
var translation = vec3(0, 0, 0);
var scale = vec3(1, 1, 1);

var currentAxis = 0;
var thetaLoc, translationLoc, scaleLoc;;
const X_AXIS = 0;
const Y_AXIS = 1;
const Z_AXIS = 2;
var vertices;
var colors;
var indices;


init();

function init() 
{
    var canvas = document.getElementById("gl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) {
        alert("WebGL 2.0 não disponível");
        return;
    }

    //Definindo os vértices do cubo
    vertices = [
        vec3(-0.5, -0.5, 0.5), 
        vec3(-0.5, 0.5, 0.5), 
        vec3(0.5, 0.5, 0.5), 
        vec3(0.5, -0.5, 0.5), 
        vec3(-0.5, -0.5, -0.5), 
        vec3(-0.5, 0.5, -0.5), 
        vec3(0.5, 0.5, -0.5), 
        vec3(0.5, -0.5, -0.5)
    ];

    //Definindo as cores do cubo
    colors = [
        vec4(1.0, 0.0, 0.0, 1.0),  // vermelho
        vec4(0.5, 0.0, 1.0, 1.0),  // roxo
        vec4(0.0, 1.0, 0.0, 1.0), // verde
        vec4(1.0, 0.5, 0.0, 1.0),  // laranja
        vec4(0.0, 1.0, 1.0, 1.0),  // ciano
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(0.0, 0.5, 0.0, 1.0),  // verde escuro
        vec4(0.0, 0.0, 1.0, 1.0) // azul
        
    ];

    //definindo os indices
    indices = [
        0, 1, 2, 3,  // Frente
    3, 2, 6, 7,  // Direita
    7, 6, 5, 4,  // Trás
    4, 5, 1, 0,  // Esquerda
    1, 5, 6, 2,  // Topo
    4, 0, 3, 7   // Fundo
    ];

    // inicialização
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //buffers dos vertices
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    //buffers para as cores
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    //buffers que ira guardar os indices dos triangles
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

    thetaLoc = gl.getUniformLocation(program, "uTheta");
    translationLoc = gl.getUniformLocation(program, "uTranslation");
    scaleLoc = gl.getUniformLocation(program, "uScale");

    //animacao para  button X
    var XButton = document.getElementById("XButton");
    XButton.addEventListener("click", function () {
        currentAxis = X_AXIS;
    });

    //animacao para  button Y
    var YButton = document.getElementById("YButton");
    YButton.addEventListener("click", function () {
        currentAxis = Y_AXIS;
    });

    //animacao para  button Z
    var ZButton = document.getElementById("ZButton");
    ZButton.addEventListener("click", function () {
        currentAxis = Z_AXIS;
    });

    // animação para os botões de Translação
    document.getElementById("TranslacaoXmais").addEventListener("click", () => translation[0] += 0.1);
    document.getElementById("TranslacaoXmenos").addEventListener("click", () => translation[0] -= 0.1);
    document.getElementById("TranslacaoYmais").addEventListener("click", () => translation[1] += 0.1);
    document.getElementById("TranslacaoYmenos").addEventListener("click", () => translation[1] -= 0.1);
    document.getElementById("TranslacaoZmais").addEventListener("click", () => translation[2] += 0.1);
    document.getElementById("TranslacaoZmenos").addEventListener("click", () => translation[2] -= 0.1);

    // animação para os botões de Escala
    document.getElementById("EscalaXmais").addEventListener("click", () => scale[0] *= 1.1);
    document.getElementById("EscalaXmenos").addEventListener("click", () => scale[0] *= 0.9);
    document.getElementById("EscalaYmais").addEventListener("click", () => scale[1] *= 1.1);
    document.getElementById("EscalaYmenos").addEventListener("click", () => scale[1] *= 0.9);
    document.getElementById("EscalaZmais").addEventListener("click", () => scale[2] *= 1.1);
    document.getElementById("EscalaZmenos").addEventListener("click", () => scale[2] *= 0.9);


    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[currentAxis] += 2.0;
    gl.uniform3fv(thetaLoc, flatten(theta));
    gl.uniform3fv(translationLoc, flatten(translation));
    gl.uniform3fv(scaleLoc, flatten(scale));

    //usando triangle_fan
    for (let i = 0; i < 6; i++) {
        gl.drawElements(gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, 4 * i);
    }

    requestAnimationFrame(render);
}
