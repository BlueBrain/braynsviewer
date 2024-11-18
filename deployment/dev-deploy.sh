#!/bin/bash

echo "(1/4) Login to bbpgitlab..."
docker login bbpgitlab.epfl.ch:5050

echo "(2/4) Builing package..."
docker build -t bbpgitlab.epfl.ch:5050/viz/brayns/braynsviewer .

echo "(3/4) Pushing package to bbpgitlab..."
docker push bbpgitlab.epfl.ch:5050/viz/brayns/braynsviewer

echo "(4/4) Rollout in Kubernetes..."
kubectl rollout restart -n bbp-ou-visualization deployment braynsviewer-dev

echo
echo
echo "BraynsViewer has been deployed in:"
echo "  http://dev.braynsviewer.kcp.bbp.epfl.ch/"
echo
