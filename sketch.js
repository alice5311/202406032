/* MoveNet Skeleton - Steve's Makerspace (most of this code is from TensorFlow)

MoveNet is developed by TensorFlow:
https://www.tensorflow.org/hub/tutorials/movenet

*/

let video, bodypose, pose, keypoint, detector;
let poses = [];

function preload(){
catImg = loadImage("animated-cat-image-0184.gif");}

async function init() {
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.MULTIPOSE_LIGHTNING,
  };
  detector = await poseDetection.createDetector(
    poseDetection.SupportedModels.MoveNet,
    detectorConfig
  );
}

async function videoReady() {
  console.log("video ready");
  await getPoses();
}

async function getPoses() {
  if (detector) {
    poses = await detector.estimatePoses(video.elt, {
      maxPoses: 2,
      //flipHorizontal: true,
    });
  }
  requestAnimationFrame(getPoses);
}

async function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, videoReady);
  video.size(width, height);
  video.hide();
  await init();

  stroke(255);
  strokeWeight(5);
}

function draw() {
  image(video, 0, 0);
  drawSkeleton();
  // flip horizontal
  cam = get();
  translate(cam.width, 0);
  scale(-1, 1);
  image(cam, 0, 0);

}

function drawSkeleton() {
  // Draw all the tracked landmark points
  for (let i = 0; i < poses.length; i++) {
    pose = poses[i];
    //眼睛
    partL = pose.keypoints[1];
    partR = pose.keypoints[2];
    if (partL.score > 0.1  ) 
    {
      //elipse(partL.x,partL.y,50)
      image(catImg,partL.x+(frameCount/10),partL.y-25,30,30)
    }
    if (partR.score > 0.1 ) 
    {
      //elipse(partL.x,partL.y,50)
      image(catImg,partR.x+(frameCount/10),partR.y-25,30,30)
    }
    //頭頂的字
    partA = pose.keypoints[0];
    if (partA.score > 0.1) {
    push()
    textSize(40)
    scale(-1,1)
    text("412730680許家寧",partA.x-750,partA.y-100) 
    pop()
    }
    //手腕
    partB = pose.keypoints[9];
    partC = pose.keypoints[10];
    if (partB.score > 0.1  ) 
    {
      image(catImg,partB.x+(frameCount/10),partB.y-25,30,30)
    }
    if (partC.score > 0.1 ) 
    {
      image(catImg,partC.x+(frameCount/10),partC.y-25,30,30)
    }
  }
}

/* Points (view on left of screen = left part - when mirrored)
  0 nose
  1 left eye
  2 right eye
  3 left ear
  4 right ear
  5 left shoulder
  6 right shoulder
  7 left elbow
  8 right elbow
  9 left wrist
  10 right wrist
  11 left hip
  12 right hip
  13 left kneee
  14 right knee
  15 left foot
  16 right foot
*/