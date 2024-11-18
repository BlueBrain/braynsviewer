# BraynsViewer

Advanced UI for Brayns renderer, exposes Brayns renderer interface to the user, highly tunable, web based.

## Deployment

### Prerequisities

* Install [docker](https://docs.docker.com/engine/install/ubuntu/)
* Install [kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)  
  Check the version to be at least in version 1.23:  
  `kubectl version --client`
* Install [Krew](https://krew.sigs.k8s.io/docs/user-guide/setup/install/#bash)
* Install plugin kubelogin:  
  `kubectl krew install oidc-login`
* [Authenticate with Gaspar account](https://bbpteam.epfl.ch/project/spaces/display/SDKB/Authenticate+with+your+Gaspar+account)
* Set your default namespace:  
  `kubectl config set-context --current --namespace=bbp-ou-visualization`
* Check if you have access to the dshboard:  
  `kubectl auth-proxy -n kubernetes-dashboard https://kubernetes-dashboard.svc`  
  or `npm run k8s:dashboard`

### Build Docker image

```bash
docker build -t bbpgitlab.epfl.ch:5050/viz/brayns/braynsviewer:latest .
docker login bbpgitlab.epfl.ch:5050
docker image push bbpgitlab.epfl.ch:5050/viz/brayns/braynsviewer:latest
```

or

```bash
npm run docker:build
```

You can test it with this commands:

```bash
docker run -p 127.0.0.1:9999:8080/tcp brayns-viewer
firefox 127.0.0.1:9999
```

## Funding & Acknowledgment

The development of this software was supported by funding to the Blue Brain Project, a research center of the École polytechnique fédérale de Lausanne (EPFL), from the Swiss government's ETH Board of the Swiss Federal Institutes of Technology.

Copyright (c) 2024 Blue Brain Project/EPFL
