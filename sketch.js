import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";

window.setup = setup;
window.draw = draw;

let drawing = [];
let savedDrawings = []; // Array to hold all the saved drawings
let drawingTimestamp;
let currentPath = [];
let isDrawing = false;

// var currentDrawing = [];

const firebaseDatbaseConnection = initializeApp({
  apiKey: "AIzaSyACTZs6IaFhE6VeldeyYfhzjqC9C_69Sv4",
  authDomain: "test01-d0fdd.firebaseapp.com",
  databaseURL: "https://test01-d0fdd-bbb6e.europe-west1.firebasedatabase.app/",
  projectId: "test01-d0fdd",
  storageBucket: "test01-d0fdd.appspot.com",
  messagingSenderId: "968693583529",
  appId: "1:968693583529:web:1bd15312655ae0daa223b8",
  measurementId: "G-HN8Z87RXQB",
});

const firebaseDatabase = getDatabase(firebaseDatbaseConnection);

function setup() {
  canvas = createCanvas(1080, 3655);
  canvas = canvas.parent("canvas");
  // let video = createVideo("video.mp4");
  //video.hide();
  // video.play();
  // video.loop();
  //canvas = createVideo("test.MP4");

  //let video = createVideo("test.MP4", muteVideo);
  //video.hide();
  // video.play;

  canvas.mousePressed(startPath);
  canvas.touchStarted(startPath);
  canvas.mouseReleased(endPath);
  canvas.touchEnded(endPath);

  select("#button-save").mousePressed(saveDrawing);
  select("#button-erase").mousePressed(clearDrawing);
  getAndDrawData();
}

function startPath() {
  isDrawing = true;
  currentPath = [];
  drawing.push(currentPath);
}

function endPath() {
  isDrawing = false;
}

function draw() {
  background(255, 0);
  //image(video, 0, 0);

  // SAVED DRAWINGS
  if (savedDrawings != null) {
    stroke(255, 244, 28);
    for (let k = 0; k < savedDrawings.length; k++) {
      var currentDrawing = savedDrawings[k];
      beginShape();
      for (let d = 0; d < currentDrawing.length; d++) {
        let x = currentDrawing[d].x;
        let y = currentDrawing[d].y;
        curveVertex(x, y);
      }
      endShape();
    }
  }

  // LIVE DRAWING
  if (isDrawing) {
    var point = {
      x: mouseX,
      y: mouseY,
    };
    currentPath.push(point);
  }

  stroke(0);
  strokeWeight(4);
  noFill();
  for (var i = 0; i < drawing.length; i++) {
    var path = drawing[i];
    beginShape();
    for (var j = 0; j < path.length; j++) {
      curveVertex(path[j].x, path[j].y);
    }
    endShape();
  }
}

function saveDrawing() {
  drawingTimestamp = Date.now();
  let data = ref(firebaseDatabase, "drawings/" + drawingTimestamp);

  set(data, {
    name: "Paulik2",
    drawing: drawing,
  });

  getAndDrawData();
  location.reload();
}

function getAndDrawData() {
  let data = ref(firebaseDatabase, "drawings/");

  onValue(data, (snapshot) => {
    const db = snapshot.val();
    // console.log(db);
    var keys = Object.keys(db);
    for (let i = 0; i < keys.length; i++) {
      var key = keys[i];
      drawPreviousDrawings(key);
    }
  });
}

function drawPreviousDrawings(key) {
  let data = ref(firebaseDatabase, "drawings/" + key);

  onValue(data, (snapshot) => {
    const drawing = snapshot.val();
    console.log(drawing);

    let l = drawing.drawing.length;
    console.log(l);

    for (let i = 0; i < l; i++) {
      var currentDrawing = [];
      var arr = drawing.drawing[i];
      for (let j = 0; j < arr.length; j++) {
        let dx = drawing.drawing[i][j].x;
        let dy = drawing.drawing[i][j].y;
        var point = { x: dx, y: dy };
        currentDrawing.push(point);
      }
      savedDrawings.push(currentDrawing);
    }

    // console.log(savedDrawings.length);
  });
}

function clearDrawing() {
  clear();
  drawing = [];
  let data = ref(firebaseDatabase, "drawings/" + drawingTimestamp);

  remove(currentDrawing);

  savedDrawings = [];
}
