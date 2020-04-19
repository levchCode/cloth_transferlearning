let featureExtractor;
let nn; 
let loss;
let labels;

// A function to be called when the model has been loaded
function modelReady() {
  document.getElementById("ready_model").innerHTML = "MobileNet загружена!"
}

function setup() {
  noCanvas();
  
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady, params);
  // Create a new classifier using those features and give the video we want to use
  nn = featureExtractor.classification();
}

// Classify the current frame.
function classify() {
  let img_pred = document.getElementById("igp");
  nn.classify(img_pred, gotResults);
}


function loadPatterns()
{
  labels = ["camouflage", "checkered", "dotted", "flower", "striped"]
  var imgtag = document.getElementById("ig");

  for (var j = 0; j < labels.length; j++)
  {
    for (var i = 0; i < 79; i++)
    {
        imgtag = document.createElement("img");
        imgtag.src = "data/" + labels[j] + "/"+ labels[j].name.toLocaleLowerCase() + " (" + (i+1) + ").jpg"
        imgtag.setAttribute("height", "100");
        imgtag.setAttribute("width", "100");
        document.getElementById(labels[j]).appendChild(imgtag);
    }

    for (var i = 0; i < 20; i++)
    {
        imgtag = document.createElement("img_test");
        imgtag.src = "data/" + labels[j] + "/test/"+ labels[j].name.toLocaleLowerCase() + " (" + (i+1) + ").jpg"
        imgtag.setAttribute("height", "100");
        imgtag.setAttribute("width", "100");
        document.getElementById(labels[j]).appendChild(imgtag);
    }
  }

  document.getElementById("ready").innerHTML = "Тренировочный набор загружен."

}

function addPatterns()
{
  cam_pix = document.getElementById("camouflage")
  check_pix = document.getElementById("checkered")
  dot_pix = document.getElementById("dotted")
  flwr_pix = document.getElementById("flower")
  strip_pix = document.getElementById("striped")

  for (var j = 0; j < 80; j++)
  {
      nn.addImage(cam_pix.childNodes[j], "camouflage");
      nn.addImage(check_pix.childNodes[j], "checkered");
      nn.addImage(dot_pix.childNodes[j], "dotted");
      nn.addImage(flwr_pix.childNodes[j], "flower");
      nn.addImage(strip_pix.childNodes[j], "striped");
  }

}

function train()
{
  nn.train(function(lossValue) {
    if (lossValue) {
        loss = lossValue;
        document.getElementById("loss").innerHTML = 'Ошибка: ' + loss;
        console.log('Ошибка: ' + loss);
    } else {
        document.getElementById("loss").innerHTML = 'Конечная ошибка: ' + loss;
    }});
}



function saveModel()
{
    nn.save();
}

function loadModel()
{
    files = document.getElementById("loadModel").elt.files
    nn.load(files, function(){
        console.log('Другая модель загружена');
      });
}
  
// Show the results
function gotResults(err, results) {
  // Display any error
  if (err) {
    console.error(err);
  }

  // действительная метка
  let lab = document.getElementById("expect").innerHTML

  // предсказанная метка
  let pred = results[0].label

  correct = 0;
  wrong = 0;

  if (pred === lab)
  {
    correct++;
  }
  else
  {
    wrong++;
  }

  let acc = correct/(correct+wrong)

  confuse = []

  for (let i = 0; i < labels.length; i++)
  {
    confuse[i] = Array(labels.length).fill(0)
  }

  confuse[labels.index(lab)][labels.index(pred)]++

  const arrSum = arr => arr.reduce((a,b) => a + b, 0)
  
  let prec = Array(labels.length).fill(0);
  let recall = Array(labels.length).fill(0);

  
  for (let i = 0; i < confuse.length; i++)
  {
    prec[i] = consfuse[i][i]/arrSum(confuse[i])
    total_label = 0
    for (let j = 0; j < confuse.length; j++)
    {
      total_label += confuse[i][j]
    }
    recall[i] = consfuse[i][i]/total_label
  }
  

  document.getElementById("pred_vol").innerHTML = pred
  document.getElementById("pred_conf").innerHTML = results[0].confidence;
}

function onFileSelected(event) {
    var selectedFile = event.target.files[0];
    var reader = new FileReader();
  
    var imgtag = document.getElementById("igp");
    imgtag.title = selectedFile.name;
  
    reader.onload = function(event) {
      imgtag.src = event.target.result;
    };
  
    reader.readAsDataURL(selectedFile);
}
