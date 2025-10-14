# nc-frontend-challenge
Frontend challenge for Natural Cycles in Angular and TypeScript.
[Live demo on Netlify](https://emmasfrontendchallenge.netlify.app/)

## To run the application:
- Clone the repo
- Make sure you're in the countdown-app folder
- Make sure you're using node version 20 or later and in the terminal run **npm i** to install packages
- In terminal run **npm start** to start the project locally

### To reuse the textfit directive:
- Import the **TextFitDirective** in the component you wish you use it and use it in imports, e.g. in countdown.ts

## Suggestions of improvement
- In this working application the input from the text and date inputs are immedietly displayed in the h1 and h2 elements. As the textfit is active on these elements, the evaluation of the fontsize triggers layout change which makes it annoying to use the text input as the user sees the layout being reflowed. My suggestion of improvement for this would be to have a button to update the title and the countdown which would also make it more user friendly.
