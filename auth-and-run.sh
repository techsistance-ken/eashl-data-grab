echo $abc | base64 --decode > ken.json
export GOOGLE_APPLICATION_CREDENTIALS=./ken.json
node completeclub.js $EASHL_PLATFORM $EASHL_CLUB_ID
unset GOOGLE_APPLICATION_CREDENTIALS

