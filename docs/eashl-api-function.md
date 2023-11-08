# Getting the EASHL SEARCH TO WORK

1. Run `build.sh` in the `scripts` directory
2. `docker build . --platform linux/amd64` in the `containers` directory
3. Tag like `docker tag 7b4ea0a3c6b4 us-central1-docker.pkg.dev/eashl-db46/mlbtheshow-containers/eashl:v2.0.0`
4. Push like `docker push us-central1-docker.pkg.dev/eashl-db46/mlbtheshow-containers/eashl:v2.0.0`
5. Create a VPC
6. Create a Serverless VPC Connector
7. Create a function


# ON the VM
1. To pull images, gcloud auth configure-docker did not work, had to login manually using `gcloud auth print-access-token | sudo docker login -u  oauth2accesstoken --password-stdin us-central1-docker.pkg.dev`