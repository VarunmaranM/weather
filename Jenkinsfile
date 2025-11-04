pipeline {
  agent any

  environment {
    AWS_REGION        = credentials('aws-region-text')
    AWS_ACCOUNT_ID    = credentials('aws-account-id-text')
    AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
    AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
    ECR_REPOSITORY    = 'weather'
    IMAGE_TAG         = "${env.BUILD_NUMBER}"
    EKS_CLUSTER_NAME  = credentials('eks-cluster-name-text')
    K8S_NAMESPACE     = 'default'
  }

  options {
    timestamps()
    ansiColor('xterm')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('AWS Login to ECR') {
      steps {
        powershell '''
          $env:AWS_DEFAULT_REGION=$env:AWS_REGION
          aws --version
          aws ecr describe-repositories --repository-names $env:ECR_REPOSITORY 2>$null 
            || aws ecr create-repository --repository-name $env:ECR_REPOSITORY | Out-Null
          aws ecr get-login-password --region $env:AWS_REGION |
            docker login --username AWS --password-stdin "$($env:AWS_ACCOUNT_ID).dkr.ecr.$($env:AWS_REGION).amazonaws.com"
        '''
      }
    }

    stage('Docker Build & Push') {
      steps {
        powershell '''
          docker version
          docker build -t "$env:ECR_REPOSITORY:$env:IMAGE_TAG" .
          docker tag "$env:ECR_REPOSITORY:$env:IMAGE_TAG" "$($env:AWS_ACCOUNT_ID).dkr.ecr.$($env:AWS_REGION).amazonaws.com/$($env:ECR_REPOSITORY):$($env:IMAGE_TAG)"
          docker push "$($env:AWS_ACCOUNT_ID).dkr.ecr.$($env:AWS_REGION).amazonaws.com/$($env:ECR_REPOSITORY):$($env:IMAGE_TAG)"
        '''
      }
    }

    stage('Configure kubectl (EKS)') {
      steps {
        powershell '''
          $env:AWS_DEFAULT_REGION=$env:AWS_REGION
          aws eks update-kubeconfig --name $env:EKS_CLUSTER_NAME --region $env:AWS_REGION
          kubectl version --client
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        powershell '''
          kubectl apply -n $env:K8S_NAMESPACE -f k8s/service.yaml
          kubectl apply -n $env:K8S_NAMESPACE -f k8s/deployment.yaml
          kubectl set image -n $env:K8S_NAMESPACE deployment/weather-web weather-web="$($env:AWS_ACCOUNT_ID).dkr.ecr.$($env:AWS_REGION).amazonaws.com/$($env:ECR_REPOSITORY):$($env:IMAGE_TAG)"
          kubectl rollout status -n $env:K8S_NAMESPACE deploy/weather-web
        '''
      }
    }
  }

  post {
    always {
      echo 'Pipeline finished.'
    }
  }
}

