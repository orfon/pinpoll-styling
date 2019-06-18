/**
 * replace customDesign css used by vue app before embed app starts
 */

const isQuiz = document.currentScript.src.includes('embedQuiz')  == true;

const embedScript = isQuiz  ? 'embedQuiz.js': 'embedPoll.js';
const vueTagName = isQuiz ? 'embed-quiz' : 'embed-poll';
const vueAttributeKey = isQuiz ? ':questions' : ':poll';

const embedUrl = [
   'https://tools.pinpoll.com/assets/vue/',
   embedScript,
   '?id=' + Date.now()
].join('');

const injectEmbedPoll = () => {
   var script = document.createElement('script');
   script.src = embedUrl;
   script.type = 'text/javascript';
   document.getElementsByTagName('head')[0].appendChild(script);
}
fetch('../build/embed.css')
   .then(response => response.text())
   .then(customCss => {
      const $vueElement = document.querySelector(vueTagName);
      const attrData = JSON.parse($vueElement.getAttribute(vueAttributeKey));
      if (isQuiz) {
         attrData.forEach(d => {
            d.pollData.customDesign.code = customCss;
         })
      } else {
         attrData.customDesign.code = customCss;
      }
      $vueElement.setAttribute(vueAttributeKey, JSON.stringify(attrData));
      injectEmbedPoll();
   })
   .catch(e => {
      console.error(e)
   });
