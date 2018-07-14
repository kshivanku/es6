// THE IDEA IS TO GET A WORD FROM THE WORDNIK API, FORWARD THAT TO GIPHY AND GET A
// RELEVANT GIPH


let wordnikAPI = "https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&&includePartOfSpeech=verb&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&api_key=64038ccb0036bb79cb00801ea2d0a2291d952838ba0ef4e5a"
let giphyAPI = "https://api.giphy.com/v1/gifs/search?api_key=t50EO3E76jJvUoKAsMgpntltHDUjMHpK&q=QUERY&limit=25&offset=0&rating=R&lang=en";


//TRADITIONAL WAY
// function setup() {
//   noCanvas();
//   loadJSON(wordnikAPI, function(data){
//     let randomWord = data.word;
//     createP(randomWord);
//     giphyAPI = giphyAPI.split("QUERY")[0] + randomWord + giphyAPI.split("QUERY")[1];
//     loadJSON(giphyAPI, function(giphydata){
//       let gif = giphydata.data[0].images['fixed_height'].url;
//       createImg(gif);
//     })
//   });
// }

//VANILA ES6
// function setup(){
//   noCanvas();
//   fetch(wordnikAPI)
//     .then(response => response.json())
//     .then(json => {
//       createP(json.word);
//       return fetch(giphyAPI.split("QUERY")[0] + json.word + giphyAPI.split("QUERY")[1]);
//     })
//     .then(response => response.json())
//     .then(json => createImg(json.data[0].images['fixed_height'].url))
//     .catch(err => console.error(err))
// }

//ES8, ASYNC AND AWAIT (MAKING TWO CALLS)
// function setup() {
//   noCanvas();
//   wordGIF().
//   then(results => {
//     createP(results.word);
//     createImg(results.img);
//     return wordGIF()
//   }).
//   then(results => {
//     createP(results.word);
//     createImg(results.img);
//   }).
//   catch(err => console.error(err))
// }
//
// async function wordGIF() {
//   let response1 = await fetch(wordnikAPI);
//   let json1 = await response1.json();
//   let response2 = await fetch(giphyAPI.split("QUERY")[0] + json1.word + giphyAPI.split("QUERY")[1]);
//   let json2 = await response2.json();
//   let imgURL = json2.data[0].images['fixed_height'].url;
//   return {
//     word: json1.word,
//     img: imgURL
//   }
// }

//PROMISE ALL
function setup(){
  noCanvas();
  // let promises = [wordGIF(4), wordGIF(5), wordGIF(6)];
  let promises = [];
  for(let i = 0 ; i < 30; i++){
    promises.push(wordGIF(6));
  }
  Promise.all(promises)
    .then((results) => {
      for(result of results) {
        createP(result.word);
        createImg(result.img);
      }
    })
    .catch((err) => console.error(err))
}

async function wordGIF(num){
  let wordnikResponse = await fetch(wordnikAPI.split("minLength=5&maxLength=-1")[0] + "minLength=" + num + "&maxLength=" + num + wordnikAPI.split("minLength=5&maxLength=-1")[1]);
  let wordnikResponseJson = await wordnikResponse.json();
  let giphyResponse = await fetch(giphyAPI.split("QUERY")[0] + wordnikResponseJson.word + giphyAPI.split("QUERY")[1]);
  let giphyResponseJson = await giphyResponse.json();
  let img_url = null;
  try{
    img_url = giphyResponseJson.data[0].images['fixed_height'].url
  }
  catch(err) {
    console.log("No image found for " + wordnikResponseJson.word);
    console.error(err);
  }
  return {
    word: wordnikResponseJson.word,
    img: img_url
  }
}
