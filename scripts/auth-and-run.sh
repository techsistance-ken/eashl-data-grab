echo $abc | base64 --decode > ken.json
export GOOGLE_APPLICATION_CREDENTIALS=./ken.json
node ../completeclub.js common-gen5 13156
unset GOOGLE_APPLICATION_CREDENTIALS

